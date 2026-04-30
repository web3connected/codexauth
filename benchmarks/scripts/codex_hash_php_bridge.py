#!/usr/bin/env python3
"""
CodexHash PHP Bridge for Python Testing Framework

This module provides a Python interface to the PHP CodexHarmonicHash implementation
via Laravel artisan commands.
"""

import json
import subprocess
import sys
from pathlib import Path
from typing import Dict, Any, Optional, Union

class CodexHashPHPBridge:
    """
    Bridge class to call PHP CodexHarmonicHash implementation from Python.
    """
    
    def __init__(self, codex_admin_path: str = "/home/web3codex/projects/codex_admin"):
        """
        Initialize the PHP bridge.
        
        Args:
            codex_admin_path: Path to the codex_admin Laravel project
        """
        self.codex_admin_path = Path(codex_admin_path)
        if not self.codex_admin_path.exists():
            raise FileNotFoundError(f"CodexAdmin path not found: {codex_admin_path}")
        
        # Verify artisan command exists
        artisan_path = self.codex_admin_path / "artisan"
        if not artisan_path.exists():
            raise FileNotFoundError(f"Laravel artisan not found: {artisan_path}")
    
    def hash(self, 
             input_data: str, 
             salt: Optional[str] = None, 
             tiu: Optional[float] = None, 
             rounds: int = 1000) -> Dict[str, Any]:
        """
        Generate a CodexHash using the PHP implementation.
        
        Args:
            input_data: The input string to hash
            salt: Optional salt (if None, random salt will be generated)
            tiu: Optional TIU value (if None, will use a default deterministic value)
            rounds: Number of hash rounds (default: 1000)
        
        Returns:
            Dictionary containing hash, salt, tiu, and rounds
        
        Raises:
            RuntimeError: If the PHP command fails
            ValueError: If the response cannot be parsed
        """
        # For deterministic testing, use a fixed TIU if none provided
        if tiu is None:
            tiu = 123.456789  # Fixed TIU for deterministic results
        
        # Build artisan command
        cmd = [
            "php", "artisan", "codex:hash", input_data,
            "--rounds", str(rounds)
        ]
        
        if salt is not None:
            cmd.extend(["--salt", salt])
        
        if tiu is not None:
            cmd.extend(["--tiu", str(tiu)])
        
        try:
            # Execute the command
            result = subprocess.run(
                cmd,
                cwd=self.codex_admin_path,
                capture_output=True,
                text=True,
                check=True
            )
            
            # Parse JSON response
            response = json.loads(result.stdout.strip())
            
            # Check for errors
            if response.get('error'):
                raise RuntimeError(f"CodexHash error: {response.get('message', 'Unknown error')}")
            
            return response
            
        except subprocess.CalledProcessError as e:
            try:
                error_response = json.loads(e.stdout.strip()) if e.stdout else {}
                error_msg = error_response.get('message', 'Unknown error')
            except json.JSONDecodeError:
                error_msg = f"Command failed with exit code {e.returncode}"
            
            raise RuntimeError(f"PHP CodexHash command failed: {error_msg}")
        
        except json.JSONDecodeError as e:
            raise ValueError(f"Failed to parse CodexHash response: {e}")
    
    def hash_deterministic(self, input_data: str, rounds: int = 1000) -> str:
        """
        Generate a deterministic hash using fixed parameters for testing.
        
        Args:
            input_data: The input string to hash
            rounds: Number of hash rounds
        
        Returns:
            The hash string only
        """
        result = self.hash(
            input_data=input_data,
            salt="test_salt_for_deterministic_results",
            tiu=123.456789,
            rounds=rounds
        )
        return result['hash']


def main():
    """CLI interface for testing the bridge."""
    if len(sys.argv) < 2:
        print("Usage: python codex_hash_php_bridge.py <input> [salt] [tiu] [rounds]")
        sys.exit(1)
    
    input_data = sys.argv[1]
    salt = sys.argv[2] if len(sys.argv) > 2 and sys.argv[2] != 'null' else None
    tiu = float(sys.argv[3]) if len(sys.argv) > 3 and sys.argv[3] != 'null' else None
    rounds = int(sys.argv[4]) if len(sys.argv) > 4 else 1000
    
    try:
        bridge = CodexHashPHPBridge()
        result = bridge.hash(input_data, salt, tiu, rounds)
        print(json.dumps(result, indent=2))
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
