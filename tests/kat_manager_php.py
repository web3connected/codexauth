#!/usr/bin/env python3
"""
Known Answer Test (KAT) Manager for CodexHash

This module generates and validates Known Answer Tests (KATs) for the CodexHash
implementation using the PHP bridge.
"""

import json
import sys
import os
from pathlib import Path
from typing import Dict, List, Any, Optional
import hashlib

# Add the benchmarks scripts to Python path
sys.path.insert(0, str(Path(__file__).parent.parent / "benchmarks" / "scripts"))

try:
    from codex_hash_php_bridge import CodexHashPHPBridge
except ImportError as e:
    print(f"Error importing PHP bridge: {e}")
    print("Make sure codex_hash_php_bridge.py is in benchmarks/scripts/")
    sys.exit(1)

class KATManager:
    """
    Manager for Known Answer Tests (KATs) for CodexHash.
    """
    
    def __init__(self, kat_file: str = None):
        """
        Initialize the KAT manager.
        
        Args:
            kat_file: Path to the KAT JSON file
        """
        if kat_file is None:
            kat_file = Path(__file__).parent / "vectors" / "known_answer_tests.json"
        
        self.kat_file = Path(kat_file)
        self.kat_file.parent.mkdir(parents=True, exist_ok=True)
        
        # Initialize PHP bridge
        self.bridge = CodexHashPHPBridge()
        
        # Load existing KATs
        self.kats = self._load_kats()
    
    def _load_kats(self) -> List[Dict[str, Any]]:
        """Load existing KATs from file."""
        if self.kat_file.exists():
            try:
                with open(self.kat_file, 'r') as f:
                    return json.load(f)
            except (json.JSONDecodeError, FileNotFoundError):
                print(f"Warning: Could not load KATs from {self.kat_file}")
        return []
    
    def _save_kats(self) -> None:
        """Save KATs to file."""
        with open(self.kat_file, 'w') as f:
            json.dump(self.kats, f, indent=2)
    
    def call_codex_hash(self, input_data: str, salt: str = None, tiu: float = None, rounds: int = 1000) -> Dict[str, Any]:
        """
        Call CodexHash via PHP bridge.
        
        Args:
            input_data: Input string to hash
            salt: Salt value (if None, random will be generated)
            tiu: TIU value (if None, default deterministic value will be used)
            rounds: Number of rounds
        
        Returns:
            Dictionary with hash result
        """
        try:
            return self.bridge.hash(input_data, salt, tiu, rounds)
        except Exception as e:
            print(f"Error calling CodexHash: {e}")
            return {'error': str(e)}
    
    def generate_test_vector(self, test_id: str, input_data: str, salt: str = None, 
                           tiu: float = None, rounds: int = 1000) -> Dict[str, Any]:
        """
        Generate a single test vector.
        
        Args:
            test_id: Unique identifier for the test
            input_data: Input string to hash
            salt: Salt value (if None, fixed salt will be used for determinism)
            tiu: TIU value (if None, fixed TIU will be used for determinism)
            rounds: Number of rounds
        
        Returns:
            Test vector dictionary
        """
        # Use deterministic values for KATs
        if salt is None:
            salt = f"kat_salt_{test_id}"
        if tiu is None:
            tiu = 123.456789
        
        result = self.call_codex_hash(input_data, salt, tiu, rounds)
        
        if 'error' in result:
            raise RuntimeError(f"Failed to generate test vector: {result['error']}")
        
        # Create test vector
        vector = {
            'test_id': test_id,
            'input': input_data,
            'salt': result['salt'],
            'tiu': float(result['tiu']),
            'rounds': result['rounds'],
            'expected_hash': result['hash'],
            'description': f"KAT for input '{input_data}'"
        }
        
        return vector
    
    def generate_standard_kats(self) -> List[Dict[str, Any]]:
        """
        Generate standard Known Answer Tests.
        
        Returns:
            List of test vectors
        """
        standard_tests = [
            ('empty_string', ''),
            ('single_char', 'a'),
            ('simple_word', 'hello'),
            ('sentence', 'The quick brown fox jumps over the lazy dog'),
            ('numbers', '1234567890'),
            ('special_chars', '!@#$%^&*()_+-=[]{}|;:,.<>?'),
            ('unicode', 'Hello, 世界! 🌍'),
            ('long_string', 'a' * 1000),
            ('json_like', '{"key": "value", "number": 42}'),
            ('base64_like', 'SGVsbG8gV29ybGQ='),
            ('hex_like', '0x1234567890abcdef'),
            ('uuid_like', '123e4567-e89b-12d3-a456-426614174000'),
            ('email_like', 'test@example.com'),
            ('url_like', 'https://www.example.com/path?param=value'),
            ('whitespace', '   \t\n\r   '),
            ('mixed_content', 'Text with\nnewlines\tand\ttabs   and spaces')
        ]
        
        vectors = []
        for test_id, input_data in standard_tests:
            try:
                vector = self.generate_test_vector(test_id, input_data)
                vectors.append(vector)
                print(f"Generated KAT: {test_id}")
            except Exception as e:
                print(f"Failed to generate KAT {test_id}: {e}")
        
        return vectors
    
    def generate_missing_vectors(self) -> int:
        """
        Generate missing test vectors and add them to the KAT collection.
        
        Returns:
            Number of vectors generated
        """
        existing_ids = {kat.get('test_id') for kat in self.kats}
        new_vectors = self.generate_standard_kats()
        
        added_count = 0
        for vector in new_vectors:
            if vector['test_id'] not in existing_ids:
                self.kats.append(vector)
                added_count += 1
        
        if added_count > 0:
            self._save_kats()
            print(f"Added {added_count} new test vectors")
        
        return added_count
    
    def validate_vectors(self) -> Dict[str, Any]:
        """
        Validate all test vectors against current implementation.
        
        Returns:
            Validation results
        """
        results = {
            'total_tests': len(self.kats),
            'passed': 0,
            'failed': 0,
            'errors': [],
            'failed_tests': []
        }
        
        for kat in self.kats:
            try:
                # Call CodexHash with exact parameters from KAT
                result = self.call_codex_hash(
                    kat['input'], 
                    kat['salt'], 
                    kat['tiu'], 
                    kat['rounds']
                )
                
                if 'error' in result:
                    results['errors'].append(f"Test {kat['test_id']}: {result['error']}")
                    results['failed'] += 1
                    continue
                
                # Compare hash
                if result['hash'] == kat['expected_hash']:
                    results['passed'] += 1
                    print(f"✓ KAT {kat['test_id']}: PASS")
                else:
                    results['failed'] += 1
                    results['failed_tests'].append({
                        'test_id': kat['test_id'],
                        'expected': kat['expected_hash'],
                        'actual': result['hash'],
                        'input': kat['input']
                    })
                    print(f"✗ KAT {kat['test_id']}: FAIL")
                    print(f"  Expected: {kat['expected_hash']}")
                    print(f"  Actual:   {result['hash']}")
                
            except Exception as e:
                results['errors'].append(f"Test {kat['test_id']}: {str(e)}")
                results['failed'] += 1
                print(f"✗ KAT {kat['test_id']}: ERROR - {e}")
        
        return results
    
    def get_kat_count(self) -> int:
        """Get the number of loaded KATs."""
        return len(self.kats)
    
    def get_kat(self, test_id: str) -> Optional[Dict[str, Any]]:
        """Get a specific KAT by test_id."""
        for kat in self.kats:
            if kat.get('test_id') == test_id:
                return kat
        return None


def main():
    """Main function for CLI usage."""
    import argparse
    
    parser = argparse.ArgumentParser(description='KAT Manager for CodexHash')
    parser.add_argument('--generate', action='store_true', help='Generate missing KATs')
    parser.add_argument('--validate', action='store_true', help='Validate existing KATs')
    parser.add_argument('--kat-file', help='Path to KAT file')
    
    args = parser.parse_args()
    
    # Initialize KAT manager
    kat_manager = KATManager(args.kat_file)
    
    if args.generate:
        print("Generating missing KAT vectors...")
        count = kat_manager.generate_missing_vectors()
        print(f"Total KATs: {kat_manager.get_kat_count()}")
    
    if args.validate:
        print("Validating KAT vectors...")
        results = kat_manager.validate_vectors()
        print(f"\nValidation Results:")
        print(f"  Total tests: {results['total_tests']}")
        print(f"  Passed: {results['passed']}")
        print(f"  Failed: {results['failed']}")
        
        if results['errors']:
            print(f"  Errors: {len(results['errors'])}")
            for error in results['errors']:
                print(f"    {error}")
    
    if not args.generate and not args.validate:
        print(f"KAT Manager loaded with {kat_manager.get_kat_count()} test vectors")
        print("Use --generate to create missing vectors or --validate to check existing ones")


if __name__ == "__main__":
    main()
