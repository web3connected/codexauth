#!/usr/bin/env python3
"""
Known Answer Test (KAT) Manager for CodexHash

This module generates and validates Known Answer Tests (KATs) for the CodexHash
implementation using the Python implementation directly.
"""

import json
import sys
import os
from pathlib import Path
from typing import Dict, List, Any, Optional
import hashlib

# Add the codex_hash package to the path
sys.path.insert(0, str(Path(__file__).parent.parent / "src"))

try:
    from codex_hash import CodexHarmonicHash, TestMode
except ImportError as e:
    print(f"Error importing CodexHash: {e}")
    print("Make sure the codex_hash package is properly installed")
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
        
        # Initialize Python CodexHash hasher
        self.hasher = CodexHarmonicHash()
        
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
        Call CodexHash using Python implementation.
        
        Args:
            input_data: Input string to hash
            salt: Salt value (if None, random will be generated)
            tiu: TIU value (if None, default deterministic value will be used)
            rounds: Number of rounds
        
        Returns:
            Dictionary with hash result
        """
        try:
            # Set deterministic mode for reproducible KAT generation
            self.hasher.set_test_mode(TestMode.DETERMINISTIC, seed=12345)
            
            # Call the Python implementation
            result = self.hasher.hash(input_data, salt=salt, tiu=tiu, rounds=rounds, mode=TestMode.DETERMINISTIC)
            
            # Convert to dictionary format compatible with existing KAT format
            return {
                'hash': result.hash_value,
                'salt': result.salt,
                'tiu': str(result.tiu),
                'rounds': result.rounds,
                'execution_time_ns': result.execution_time_ns,
                'base_frequency': result.base_frequency
            }
        except Exception as e:
            print(f"Error calling CodexHash: {e}")
            return {'error': str(e)}
    
    def generate_missing_vectors(self) -> int:
        """Generate missing test vectors."""
        generated_count = 0
        
        print("Generating missing test vectors...")
        
        # The KATs structure is different - it's a dict with a 'vectors' key
        if isinstance(self.kats, list):
            vectors_to_process = self.kats
        elif isinstance(self.kats, dict) and 'vectors' in self.kats:
            vectors_to_process = self.kats['vectors']
        else:
            print("Invalid KAT structure")
            return 0
        
        for kat in vectors_to_process:
            if kat.get('expected_output_hex') == 'TBD_AFTER_FIRST_RUN':
                print(f"Generating vector for: {kat['id']}")
                
                try:
                    # Get input data
                    input_data = kat['input']
                    salt = kat.get('salt')
                    tiu = float(kat['tiu']) if kat.get('tiu') else None
                    rounds = kat.get('rounds', 1000)
                    
                    # Generate hash
                    result = self.call_codex_hash(input_data, salt, tiu, rounds)
                    
                    if 'error' not in result:
                        kat['expected_output_hex'] = result['hash']
                        kat['metadata'] = {
                            'salt_used': result['salt'],
                            'tiu_used': result['tiu'],
                            'rounds': result['rounds'],
                            'execution_time_ns': result['execution_time_ns']
                        }
                        generated_count += 1
                        print(f"  ✓ {kat['id']}: {result['hash'][:16]}...")
                    else:
                        print(f"  ✗ {kat['id']}: Failed - {result['error']}")
                    
                except Exception as e:
                    print(f"  ✗ {kat['id']}: Failed - {e}")
                    continue
        
        if generated_count > 0:
            # Update metadata
            import datetime
            if isinstance(self.kats, dict):
                self.kats['last_update'] = datetime.datetime.utcnow().isoformat() + 'Z'
            
            # Save updated KATs
            self._save_kats()
            print(f"\nGenerated {generated_count} new test vectors")
        else:
            print("No missing vectors found")
        
        return generated_count
    
    def validate_vectors(self) -> Dict[str, Any]:
        """Validate all test vectors against current CodexHash implementation"""
        vectors = self.load_vectors()
        results = {
            'total_tests': len(vectors['vectors']),
            'passed': 0,
            'failed': 0,
            'failures': []
        }
        
        print("Validating Known Answer Tests...")
        
        for vector in vectors['vectors']:
            if vector['expected_output_hex'] == 'TBD_AFTER_FIRST_RUN':
                print(f"  ⚠ {vector['id']}: Skipping (no expected output)")
                continue
            
            try:
                # Get input hex
                if 'input_hex' in vector and vector['input_hex']:
                    input_hex = vector['input_hex']
                else:
                    input_hex = vector['input'].encode('utf-8').hex()
                
                # Get current hash
                current_hash = self.call_codex_hash(input_hex)
                expected_hash = vector['expected_output_hex']
                
                if current_hash == expected_hash:
                    print(f"  ✓ {vector['id']}: PASS")
                    results['passed'] += 1
                else:
                    print(f"  ✗ {vector['id']}: FAIL")
                    print(f"    Expected: {expected_hash}")
                    print(f"    Got:      {current_hash}")
                    
                    results['failed'] += 1
                    results['failures'].append({
                        'id': vector['id'],
                        'description': vector['description'],
                        'input_hex': input_hex,
                        'expected': expected_hash,
                        'actual': current_hash
                    })
                    
            except Exception as e:
                print(f"  ✗ {vector['id']}: ERROR - {e}")
                results['failed'] += 1
                results['failures'].append({
                    'id': vector['id'],
                    'description': vector['description'],
                    'error': str(e)
                })
        
        # Summary
        print(f"\nKAT Results: {results['passed']}/{results['total_tests']} passed")
        
        if results['failed'] > 0:
            print(f"CRITICAL: {results['failed']} test vectors failed!")
            print("This indicates CodexHash is not producing deterministic outputs.")
            return results
        else:
            print("✓ All Known Answer Tests passed - CodexHash is deterministic")
        
        return results
    
    def add_vector(self, id: str, description: str, input_data: str, input_hex: str = None) -> bool:
        """Add a new test vector"""
        vectors = self.load_vectors()
        
        # Check if ID already exists
        for vector in vectors['vectors']:
            if vector['id'] == id:
                print(f"Error: Vector with ID '{id}' already exists")
                return False
        
        # Create new vector
        new_vector = {
            'id': id,
            'description': description,
            'input': input_data,
            'expected_output_hex': 'TBD_AFTER_FIRST_RUN'
        }
        
        if input_hex:
            new_vector['input_hex'] = input_hex
        else:
            new_vector['input_hex'] = input_data.encode('utf-8').hex()
        
        vectors['vectors'].append(new_vector)
        self.save_vectors(vectors)
        
        print(f"Added new test vector: {id}")
        return True
    
    def export_for_other_implementations(self, output_file: str):
        """Export test vectors in a format suitable for other implementations"""
        vectors = self.load_vectors()
        
        # Create a simplified format
        export_data = {
            'algorithm': 'CodexHash',
            'version': vectors.get('version', '1.0.0'),
            'hash_size_bits': 256,
            'test_vectors': []
        }
        
        for vector in vectors['vectors']:
            if vector['expected_output_hex'] != 'TBD_AFTER_FIRST_RUN':
                export_data['test_vectors'].append({
                    'name': vector['id'],
                    'input': vector['input_hex'],
                    'output': vector['expected_output_hex']
                })
        
        with open(output_file, 'w') as f:
            json.dump(export_data, f, indent=2)
        
        print(f"Exported {len(export_data['test_vectors'])} vectors to {output_file}")

def main():
    import argparse
    
    parser = argparse.ArgumentParser(description="CodexHash Known Answer Test Manager")
    parser.add_argument("command", choices=["generate", "validate", "add", "export"], 
                       help="Command to execute")
    parser.add_argument("--vectors-file", help="Path to test vectors JSON file")
    parser.add_argument("--id", help="Vector ID (for add command)")
    parser.add_argument("--description", help="Vector description (for add command)")
    parser.add_argument("--input", help="Input data (for add command)")
    parser.add_argument("--input-hex", help="Input as hex (for add command)")
    parser.add_argument("--output", help="Output file (for export command)")
    
    args = parser.parse_args()
    
    kat = KATManager(args.vectors_file)
    
    if args.command == "generate":
        kat.generate_missing_vectors()
        
    elif args.command == "validate":
        results = kat.validate_vectors()
        if results['failed'] > 0:
            sys.exit(1)
            
    elif args.command == "add":
        if not args.id or not args.description or not args.input:
            print("Error: --id, --description, and --input are required for add command")
            sys.exit(1)
        kat.add_vector(args.id, args.description, args.input, args.input_hex)
        
    elif args.command == "export":
        output_file = args.output or "codex_hash_test_vectors.json"
        kat.export_for_other_implementations(output_file)

if __name__ == "__main__":
    main()
