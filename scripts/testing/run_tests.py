#!/usr/bin/env python3
"""
CodexHash Test & Benchmark Runner
Simple entry point for running all CodexHash tests and benchmarks
"""

import os
import sys
import subprocess
from pathlib import Path

def run_command(cmd, description):
    """Run a command and report results"""
    print(f"\n{'='*60}")
    print(f"🔥 {description}")
    print(f"{'='*60}")
    
    try:
        result = subprocess.run(cmd, shell=True, check=True)
        print(f"✅ {description} - COMPLETED")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} - FAILED (exit code {e.returncode})")
        return False

def main():
    script_dir = Path(__file__).parent
    
    print("🚀 CodexHash Test & Benchmark Suite")
    print("=" * 60)
    
    # Change to the benchmark directory
    os.chdir(script_dir / "benchmarks")
    
    success = True
    
    # 1. Generate/validate Known Answer Tests
    success &= run_command(
        f"python3 ../tests/kat_manager.py generate",
        "Generating Known Answer Test vectors"
    )
    
    success &= run_command(
        f"python3 ../tests/kat_manager.py validate",
        "Validating Known Answer Tests (KATs)"
    )
    
    # 2. Run quick benchmark
    success &= run_command(
        f"python3 harness.py --quick --output-dir reports/quick",
        "Running quick performance benchmark"
    )
    
    # 3. Run full benchmark (if requested)
    if "--full" in sys.argv:
        success &= run_command(
            f"python3 harness.py --output-dir reports/full",
            "Running full performance benchmark"
        )
    
    # Summary
    print("\n" + "="*60)
    if success:
        print("🎉 ALL TESTS PASSED!")
        print("\nResults available in:")
        print("  - tests/vectors/known_answer_tests.json")
        print("  - benchmarks/reports/")
    else:
        print("💥 SOME TESTS FAILED!")
        print("Check the output above for details.")
        sys.exit(1)
    
    print("="*60)

if __name__ == "__main__":
    main()
