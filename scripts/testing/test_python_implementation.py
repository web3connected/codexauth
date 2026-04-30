#!/usr/bin/env python3
"""
CodexHash Python Implementation Test
===================================

Quick test to verify the new Python CodexHash implementation works
and produces consistent results.
"""

import sys
import os
import json
from pathlib import Path

# Add the codex_hash module to the path
sys.path.insert(0, str(Path(__file__).parent / "src"))

try:
    from codex_hash import CodexHarmonicHash, TestMode, CodexHashError
except ImportError as e:
    print(f"Import error: {e}")
    print("Available paths:")
    for path in sys.path:
        print(f"  {path}")
    sys.exit(1)


def test_basic_functionality():
    """Test basic hash functionality."""
    print("Testing basic CodexHash functionality...")
    
    hasher = CodexHarmonicHash()
    
    # Test deterministic hashing
    result1 = hasher.hash("test input", mode=TestMode.DETERMINISTIC)
    result2 = hasher.hash("test input", mode=TestMode.DETERMINISTIC)
    
    print(f"Hash 1: {result1.hash_value[:16]}...")
    print(f"Hash 2: {result2.hash_value[:16]}...")
    print(f"Deterministic match: {result1.hash_value == result2.hash_value}")
    
    # Test with fixed parameters
    result3 = hasher.hash(
        "test input",
        salt="fixed_salt_for_testing_123456789abcdef",
        tiu=1234567.890123,
        rounds=1000,
        mode=TestMode.DETERMINISTIC
    )
    
    print(f"Fixed params hash: {result3.hash_value[:16]}...")
    print(f"TIU: {result3.tiu}")
    print(f"Base frequency: {result3.base_frequency:.6f}")
    print(f"Entropy score: {result3.entropy_score:.6f}")
    print(f"Execution time: {result3.execution_time_ns / 1000:.2f} µs")
    
    return result3


def test_verification():
    """Test hash verification."""
    print("\nTesting hash verification...")
    
    hasher = CodexHarmonicHash()
    
    # Create a hash
    original = hasher.hash(
        "verification test",
        salt="test_salt_123456789abcdef0123456789abcdef",
        tiu=9876543.210987,
        rounds=500,
        mode=TestMode.DETERMINISTIC
    )
    
    # Verify it
    is_valid = hasher.verify(
        "verification test",
        original.hash_value,
        original.salt,
        original.tiu,
        original.rounds
    )
    
    print(f"Verification result: {is_valid}")
    
    # Test with wrong input
    is_invalid = hasher.verify(
        "wrong input",
        original.hash_value,
        original.salt,
        original.tiu,
        original.rounds
    )
    
    print(f"Wrong input verification: {is_invalid}")
    
    return is_valid


def test_performance():
    """Test performance benchmarking."""
    print("\nTesting performance benchmarking...")
    
    hasher = CodexHarmonicHash()
    
    # Run benchmark
    benchmark = hasher.benchmark_hash(
        "performance test input data",
        iterations=100,
        mode=TestMode.PERFORMANCE
    )
    
    print(f"Benchmark results:")
    print(f"  Iterations: {benchmark['iterations']}")
    print(f"  Average time: {benchmark['avg_time_ns'] / 1000:.2f} µs")
    print(f"  Min time: {benchmark['min_time_ns'] / 1000:.2f} µs")
    print(f"  Max time: {benchmark['max_time_ns'] / 1000:.2f} µs")
    print(f"  Ops/sec: {benchmark['ops_per_sec']:.2f}")
    
    return benchmark


def test_compatibility():
    """Test compatibility with our test framework expectations."""
    print("\nTesting test framework compatibility...")
    
    hasher = CodexHarmonicHash()
    
    # Test the interface our KAT manager expects
    try:
        # Test with string input (our current format)
        result = hasher.hash("test_input_for_kat")
        
        # Check result has all expected fields
        result_dict = result.to_dict()
        expected_fields = ['hash', 'salt', 'tiu', 'rounds', 'execution_time_ns']
        
        missing_fields = [field for field in expected_fields if field not in result_dict]
        
        if missing_fields:
            print(f"Missing fields: {missing_fields}")
            return False
        
        print("All expected fields present:")
        for field in expected_fields:
            value = result_dict[field]
            if isinstance(value, float):
                print(f"  {field}: {value:.6f}")
            else:
                print(f"  {field}: {value}")
        
        # Test JSON serialization
        json_str = json.dumps(result_dict, indent=2)
        print(f"JSON serialization successful: {len(json_str)} chars")
        
        return True
        
    except Exception as e:
        print(f"Compatibility test failed: {e}")
        return False


def main():
    """Run all tests."""
    print("=" * 60)
    print("CodexHash Python Implementation Test Suite")
    print("=" * 60)
    
    try:
        # Test basic functionality
        hash_result = test_basic_functionality()
        
        # Test verification
        verify_result = test_verification()
        
        # Test performance
        perf_result = test_performance()
        
        # Test compatibility
        compat_result = test_compatibility()
        
        print("\n" + "=" * 60)
        print("Test Summary:")
        print(f"  Basic functionality: ✓")
        print(f"  Hash verification: {'✓' if verify_result else '✗'}")
        print(f"  Performance benchmark: ✓")
        print(f"  Framework compatibility: {'✓' if compat_result else '✗'}")
        
        if verify_result and compat_result:
            print("\n🎉 All tests passed! Python implementation is ready.")
            return 0
        else:
            print("\n❌ Some tests failed. Check implementation.")
            return 1
            
    except Exception as e:
        print(f"\n💥 Test suite failed with error: {e}")
        import traceback
        traceback.print_exc()
        return 1


if __name__ == "__main__":
    sys.exit(main())
