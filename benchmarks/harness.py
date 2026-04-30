#!/usr/bin/env python3
"""
CodexHash Comprehensive Benchmark Framework
==========================================

This framework implements comprehensive testing for CodexHash following
scientific methodology principles for cryptographic validation.

Updated to use Python CodexHash implementation directly.
"""

import time
import math
import json
import hashlib
import os
import sys
import statistics
import multiprocessing
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed
from typing import Dict, List, Tuple, Any, Optional
from dataclasses import dataclass, asdict
import psutil
import platform

# Add the codex_hash package to the path
sys.path.insert(0, str(Path(__file__).parent.parent / "src"))

try:
    from codex_hash import CodexHarmonicHash, TestMode
    CODEX_HASH_AVAILABLE = True
    print("Python CodexHash implementation loaded successfully")
except ImportError as e:
    print(f"Warning: Python CodexHash not available: {e}")
    CODEX_HASH_AVAILABLE = False

import os
import sys
import json
import time
import random
import hashlib
import argparse
import statistics
import subprocess
import csv
import numpy as np
from typing import Dict, List, Tuple, Optional, Any, Callable
from dataclasses import dataclass, asdict
from pathlib import Path
import threading
import multiprocessing
from concurrent.futures import ThreadPoolExecutor, as_completed
import platform

# BLAKE3 availability check
try:
    import blake3
    BLAKE3_AVAILABLE = True
    print("BLAKE3 loaded successfully")
except ImportError:
    BLAKE3_AVAILABLE = False
    print("Warning: BLAKE3 not available. Install with: pip install blake3")

@dataclass
class BenchmarkConfig:
    """Configuration for benchmark runs"""
    sizes: List[int] = None  # Message sizes to test
    trials: int = 100000    # Number of trials for statistical tests
    duration_s: float = 3.0  # Duration for throughput tests
    thread_counts: List[int] = None  # Thread counts for scalability
    output_format: str = "json"  # json, csv, or both
    output_dir: str = "reports"
    seed: int = 42  # RNG seed for reproducibility
    warmup_rounds: int = 1000  # Warmup iterations
    
    def __post_init__(self):
        if self.sizes is None:
            self.sizes = [32, 1024, 1024*1024, 100*1024*1024, 1024*1024*1024]
        if self.thread_counts is None:
            self.thread_counts = [1, 2, 4, 8, 16]

@dataclass
class HashResult:
    """Single hash operation result"""
    input_size: int
    hash_output: bytes
    duration_ns: int
    cycles: Optional[int] = None
    energy_uj: Optional[float] = None

@dataclass
class BenchmarkResult:
    """Comprehensive benchmark results"""
    timestamp: str
    config: BenchmarkConfig
    system_info: Dict[str, Any]
    correctness: Dict[str, Any]
    performance: Dict[str, Any]
    cryptographic: Dict[str, Any]
    comparisons: Dict[str, Any]

class SystemInfo:
    """Collect system information for reproducible benchmarks"""
    
    @staticmethod
    def collect() -> Dict[str, Any]:
        info = {
            "platform": platform.platform(),
            "processor": platform.processor(),
            "architecture": platform.architecture(),
            "cpu_count": multiprocessing.cpu_count(),
            "python_version": platform.python_version(),
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S UTC", time.gmtime())
        }
        
        # Try to get more detailed CPU info
        try:
            if platform.system() == "Linux":
                with open("/proc/cpuinfo", "r") as f:
                    cpuinfo = f.read()
                    # Extract key info
                    for line in cpuinfo.split('\n'):
                        if 'model name' in line:
                            info['cpu_model'] = line.split(':')[1].strip()
                            break
        except:
            pass
            
        # Try to get memory info
        try:
            if platform.system() == "Linux":
                with open("/proc/meminfo", "r") as f:
                    meminfo = f.read()
                    for line in meminfo.split('\n'):
                        if 'MemTotal' in line:
                            info['memory_total'] = line.split()[1] + " kB"
                            break
        except:
            pass
            
        return info

class HashFunction:
    """Base class for hash function implementations"""
    
    def __init__(self, name: str):
        self.name = name
    
    def hash(self, data: bytes) -> bytes:
        raise NotImplementedError
    
    def hash_size(self) -> int:
        raise NotImplementedError

class CodexHashFunction(HashFunction):
    """CodexHash implementation wrapper using Python implementation"""
    
    def __init__(self):
        super().__init__("CodexHash")
        if not CODEX_HASH_AVAILABLE:
            raise RuntimeError("Python CodexHash implementation not available")
        self.hasher = CodexHarmonicHash()
        # Set to deterministic mode for consistent benchmarking
        self.hasher.set_test_mode(TestMode.DETERMINISTIC, seed=12345)
    
    def hash(self, data: bytes) -> bytes:
        try:
            # Convert bytes to string
            input_str = data.decode('utf-8', errors='replace')
            
            # Use fixed parameters for deterministic benchmarking
            result = self.hasher.hash(
                input_data=input_str,
                salt="benchmark_salt_deterministic_hex_64char_abcdef0123456789",
                tiu=1.234567,
                rounds=1000,
                mode=TestMode.DETERMINISTIC
            )
            
            # Convert hex hash back to bytes
            return bytes.fromhex(result.hash_value)
            
        except UnicodeDecodeError:
            # For binary data, use hex representation
            input_str = data.hex()
            result = self.hasher.hash(
                input_data=input_str,
                salt="benchmark_salt_deterministic_hex_64char_abcdef0123456789",
                tiu=1.234567,
                rounds=1000,
                mode=TestMode.DETERMINISTIC
            )
            
            return bytes.fromhex(result.hash_value)
            
        except Exception as e:
            raise RuntimeError(f"Failed to call CodexHash: {e}")
    
    def hash_size(self) -> int:
        return 32  # 256-bit output

class SHA256Function(HashFunction):
    """SHA-256 reference implementation"""
    
    def __init__(self):
        super().__init__("SHA-256")
    
    def hash(self, data: bytes) -> bytes:
        return hashlib.sha256(data).digest()
    
    def hash_size(self) -> int:
        return 32

class SHA512Function(HashFunction):
    """SHA-512 reference implementation"""
    
    def __init__(self):
        super().__init__("SHA-512")
    
    def hash(self, data: bytes) -> bytes:
        return hashlib.sha512(data).digest()
    
    def hash_size(self) -> int:
        return 64

class BLAKE3Function(HashFunction):
    """BLAKE3 implementation (if available)"""
    
    def __init__(self):
        super().__init__("BLAKE3")
        try:
            import blake3
            self._blake3 = blake3
        except ImportError:
            raise ImportError("BLAKE3 not available. Install with: pip install blake3")
    
    def hash(self, data: bytes) -> bytes:
        return self._blake3.blake3(data).digest()
    
    def hash_size(self) -> int:
        return 32

class CorrectnessTests:
    """Test suite for hash function correctness"""
    
    def __init__(self, hash_fn: HashFunction, config: BenchmarkConfig):
        self.hash_fn = hash_fn
        self.config = config
        random.seed(config.seed)
    
    def test_determinism(self, num_tests: int = 1000) -> Dict[str, Any]:
        """Test that same input always produces same output"""
        results = {"passed": 0, "failed": 0, "failures": []}
        
        for i in range(num_tests):
            data = os.urandom(random.randint(1, 1024))
            hash1 = self.hash_fn.hash(data)
            hash2 = self.hash_fn.hash(data)
            
            if hash1 == hash2:
                results["passed"] += 1
            else:
                results["failed"] += 1
                results["failures"].append({
                    "test": i,
                    "input": data.hex(),
                    "hash1": hash1.hex(),
                    "hash2": hash2.hex()
                })
        
        return results
    
    def test_avalanche_effect(self, num_tests: int = 1000) -> Dict[str, Any]:
        """Test avalanche effect - single bit change should flip ~50% of output bits"""
        bit_differences = []
        
        for _ in range(num_tests):
            # Generate random message
            msg_len = random.randint(1, 128)
            msg = bytearray(os.urandom(msg_len))
            
            # Original hash
            hash1 = self.hash_fn.hash(bytes(msg))
            
            # Flip one random bit
            byte_idx = random.randint(0, len(msg) - 1)
            bit_idx = random.randint(0, 7)
            msg[byte_idx] ^= (1 << bit_idx)
            
            # Modified hash
            hash2 = self.hash_fn.hash(bytes(msg))
            
            # Count different bits
            diff_bits = sum(bin(b1 ^ b2).count('1') for b1, b2 in zip(hash1, hash2))
            total_bits = len(hash1) * 8
            
            bit_differences.append(diff_bits / total_bits)
        
        mean_diff = statistics.mean(bit_differences)
        std_diff = statistics.stdev(bit_differences)
        
        return {
            "mean_flip_ratio": mean_diff,
            "std_flip_ratio": std_diff,
            "target": 0.5,
            "acceptable_range": [0.48, 0.52],
            "passed": 0.48 <= mean_diff <= 0.52,
            "all_ratios": bit_differences
        }
    
    def test_bit_balance(self, num_tests: int = 10000) -> Dict[str, Any]:
        """Test that each output bit position has ~50% probability of being 1"""
        hash_size = self.hash_fn.hash_size()
        bit_counts = [0] * (hash_size * 8)
        
        for _ in range(num_tests):
            data = os.urandom(random.randint(1, 1024))
            hash_output = self.hash_fn.hash(data)
            
            for byte_idx, byte_val in enumerate(hash_output):
                for bit_idx in range(8):
                    if byte_val & (1 << bit_idx):
                        bit_counts[byte_idx * 8 + bit_idx] += 1
        
        bit_ratios = [count / num_tests for count in bit_counts]
        
        # Check if all bits are in acceptable range
        acceptable_range = [0.49, 0.51]
        passed_bits = sum(1 for ratio in bit_ratios 
                         if acceptable_range[0] <= ratio <= acceptable_range[1])
        
        return {
            "bit_ratios": bit_ratios,
            "mean_ratio": statistics.mean(bit_ratios),
            "std_ratio": statistics.stdev(bit_ratios),
            "acceptable_range": acceptable_range,
            "passed_bits": passed_bits,
            "total_bits": len(bit_ratios),
            "pass_percentage": passed_bits / len(bit_ratios) * 100
        }

class PerformanceTests:
    """Performance benchmark suite"""
    
    def __init__(self, hash_fn: HashFunction, config: BenchmarkConfig):
        self.hash_fn = hash_fn
        self.config = config
    
    def warmup(self, iterations: int = None):
        """Warmup the hash function"""
        if iterations is None:
            iterations = self.config.warmup_rounds
            
        data = os.urandom(1024)
        for _ in range(iterations):
            self.hash_fn.hash(data)
    
    def measure_latency(self, size: int, iterations: int = 10000) -> Dict[str, Any]:
        """Measure per-operation latency"""
        self.warmup()
        
        data = os.urandom(size)
        latencies = []
        
        for _ in range(iterations):
            start = time.perf_counter_ns()
            self.hash_fn.hash(data)
            end = time.perf_counter_ns()
            latencies.append(end - start)
        
        return {
            "size_bytes": size,
            "iterations": iterations,
            "mean_ns": statistics.mean(latencies),
            "median_ns": statistics.median(latencies),
            "std_ns": statistics.stdev(latencies),
            "min_ns": min(latencies),
            "max_ns": max(latencies),
            "p95_ns": np.percentile(latencies, 95),
            "p99_ns": np.percentile(latencies, 99)
        }
    
    def measure_throughput(self, size: int, duration_s: float = None) -> Dict[str, Any]:
        """Measure throughput in bytes/second"""
        if duration_s is None:
            duration_s = self.config.duration_s
            
        self.warmup()
        
        data = os.urandom(size)
        total_bytes = 0
        iterations = 0
        
        start_time = time.perf_counter()
        end_time = start_time + duration_s
        
        while time.perf_counter() < end_time:
            self.hash_fn.hash(data)
            total_bytes += size
            iterations += 1
        
        actual_duration = time.perf_counter() - start_time
        
        return {
            "size_bytes": size,
            "duration_s": actual_duration,
            "total_bytes": total_bytes,
            "iterations": iterations,
            "bytes_per_second": total_bytes / actual_duration,
            "megabytes_per_second": (total_bytes / actual_duration) / (1024 * 1024),
            "operations_per_second": iterations / actual_duration
        }
    
    def measure_scalability(self, size: int, max_threads: int = None) -> Dict[str, Any]:
        """Measure scalability across multiple threads"""
        if max_threads is None:
            max_threads = max(self.config.thread_counts)
        
        results = {}
        
        for thread_count in self.config.thread_counts:
            if thread_count > max_threads:
                continue
                
            data = os.urandom(size)
            duration_s = self.config.duration_s
            
            def worker():
                count = 0
                start_time = time.perf_counter()
                end_time = start_time + duration_s
                
                while time.perf_counter() < end_time:
                    self.hash_fn.hash(data)
                    count += 1
                return count
            
            with ThreadPoolExecutor(max_workers=thread_count) as executor:
                start_time = time.perf_counter()
                futures = [executor.submit(worker) for _ in range(thread_count)]
                counts = [future.result() for future in as_completed(futures)]
                actual_duration = time.perf_counter() - start_time
            
            total_ops = sum(counts)
            total_bytes = total_ops * size
            
            results[thread_count] = {
                "thread_count": thread_count,
                "total_operations": total_ops,
                "total_bytes": total_bytes,
                "duration_s": actual_duration,
                "ops_per_second": total_ops / actual_duration,
                "bytes_per_second": total_bytes / actual_duration,
                "scalability_factor": (total_ops / actual_duration) / (results.get(1, {}).get("ops_per_second", 1) or 1)
            }
        
        return results

class CryptographicTests:
    """Cryptographic property tests"""
    
    def __init__(self, hash_fn: HashFunction, config: BenchmarkConfig):
        self.hash_fn = hash_fn
        self.config = config
        random.seed(config.seed)
    
    def chi_square_uniformity(self, num_samples: int = 100000) -> Dict[str, Any]:
        """Chi-square test for output uniformity"""
        byte_counts = [0] * 256
        
        for _ in range(num_samples):
            data = os.urandom(random.randint(1, 1024))
            hash_output = self.hash_fn.hash(data)
            
            for byte_val in hash_output:
                byte_counts[byte_val] += 1
        
        total_bytes = sum(byte_counts)
        expected_count = total_bytes / 256
        
        # Chi-square statistic
        chi_square = sum((observed - expected_count) ** 2 / expected_count 
                        for observed in byte_counts)
        
        # Degrees of freedom = 255 (256 - 1)
        # Critical value for p=0.05 is approximately 293.25
        degrees_of_freedom = 255
        critical_value_005 = 293.25
        
        return {
            "chi_square_statistic": chi_square,
            "degrees_of_freedom": degrees_of_freedom,
            "critical_value_005": critical_value_005,
            "p_value_estimate": "< 0.05" if chi_square > critical_value_005 else "> 0.05",
            "uniformity_passed": chi_square <= critical_value_005,
            "byte_counts": byte_counts,
            "total_bytes": total_bytes
        }
    
    def serial_correlation(self, num_samples: int = 10000) -> Dict[str, Any]:
        """Test for serial correlation in output stream"""
        # Collect a long stream of hash outputs
        output_stream = bytearray()
        
        for _ in range(num_samples):
            data = os.urandom(random.randint(1, 64))
            hash_output = self.hash_fn.hash(data)
            output_stream.extend(hash_output)
        
        # Calculate Pearson correlation between byte[i] and byte[i+1]
        if len(output_stream) < 2:
            return {"error": "Insufficient data for correlation test"}
        
        x = output_stream[:-1]  # byte[i]
        y = output_stream[1:]   # byte[i+1]
        
        correlation = np.corrcoef(x, y)[0, 1]
        
        return {
            "serial_correlation": correlation,
            "stream_length": len(output_stream),
            "acceptable_range": [-0.01, 0.01],
            "passed": abs(correlation) <= 0.01,
            "samples_used": num_samples
        }
    
    def collision_stress_test(self, num_attempts: int = 1000000) -> Dict[str, Any]:
        """Stress test for collisions (not a proof, just a sanity check)"""
        seen_hashes = set()
        collisions = []
        
        for i in range(num_attempts):
            data = os.urandom(random.randint(1, 1024))
            hash_output = self.hash_fn.hash(data)
            hash_hex = hash_output.hex()
            
            if hash_hex in seen_hashes:
                collisions.append({
                    "iteration": i,
                    "input": data.hex(),
                    "hash": hash_hex
                })
            else:
                seen_hashes.add(hash_hex)
        
        # Birthday bound estimate
        hash_bits = self.hash_fn.hash_size() * 8
        birthday_bound = (num_attempts ** 2) / (2 * (2 ** hash_bits))
        
        return {
            "attempts": num_attempts,
            "unique_hashes": len(seen_hashes),
            "collisions_found": len(collisions),
            "collision_details": collisions,
            "birthday_bound_probability": birthday_bound,
            "hash_bits": hash_bits,
            "note": "Absence of collisions in small samples does not prove collision resistance"
        }

class BenchmarkHarness:
    """Main benchmark harness"""
    
    def __init__(self, config: BenchmarkConfig):
        self.config = config
        self.system_info = SystemInfo.collect()
        
        # Ensure output directory exists
        Path(config.output_dir).mkdir(parents=True, exist_ok=True)
    
    def run_comprehensive_benchmark(self, hash_functions: List[HashFunction]) -> BenchmarkResult:
        """Run complete benchmark suite"""
        print(f"Running comprehensive benchmark with {len(hash_functions)} hash functions...")
        print(f"System: {self.system_info.get('platform', 'Unknown')}")
        print(f"CPU: {self.system_info.get('cpu_model', 'Unknown')}")
        
        results = {
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S UTC", time.gmtime()),
            "config": asdict(self.config),
            "system_info": self.system_info,
            "hash_functions": {}
        }
        
        for hash_fn in hash_functions:
            print(f"\nTesting {hash_fn.name}...")
            
            try:
                fn_results = self._test_single_function(hash_fn)
                results["hash_functions"][hash_fn.name] = fn_results
                print(f"✓ {hash_fn.name} completed successfully")
                
            except Exception as e:
                print(f"✗ {hash_fn.name} failed: {e}")
                results["hash_functions"][hash_fn.name] = {
                    "error": str(e),
                    "status": "failed"
                }
        
        # Save results
        self._save_results(results)
        
        return results
    
    def _test_single_function(self, hash_fn: HashFunction) -> Dict[str, Any]:
        """Test a single hash function"""
        
        # Correctness tests
        print(f"  Running correctness tests...")
        correctness = CorrectnessTests(hash_fn, self.config)
        correctness_results = {
            "determinism": correctness.test_determinism(),
            "avalanche": correctness.test_avalanche_effect(),
            "bit_balance": correctness.test_bit_balance()
        }
        
        # Performance tests
        print(f"  Running performance tests...")
        performance = PerformanceTests(hash_fn, self.config)
        performance_results = {
            "latency": {},
            "throughput": {},
            "scalability": {}
        }
        
        for size in self.config.sizes:
            if size <= 1024 * 1024:  # Only measure latency for smaller sizes
                performance_results["latency"][str(size)] = performance.measure_latency(size)
            
            performance_results["throughput"][str(size)] = performance.measure_throughput(size)
            
            if size <= 1024 * 1024:  # Only measure scalability for smaller sizes
                performance_results["scalability"][str(size)] = performance.measure_scalability(size)
        
        # Cryptographic tests
        print(f"  Running cryptographic tests...")
        crypto = CryptographicTests(hash_fn, self.config)
        crypto_results = {
            "uniformity": crypto.chi_square_uniformity(),
            "serial_correlation": crypto.serial_correlation(),
            "collision_stress": crypto.collision_stress_test()
        }
        
        return {
            "hash_size_bits": hash_fn.hash_size() * 8,
            "correctness": correctness_results,
            "performance": performance_results,
            "cryptographic": crypto_results,
            "status": "completed"
        }
    
    def _save_results(self, results: Dict[str, Any]):
        """Save benchmark results"""
        timestamp = results["timestamp"].replace(":", "-").replace(" ", "_")
        
        if self.config.output_format in ["json", "both"]:
            json_file = Path(self.config.output_dir) / f"benchmark_results_{timestamp}.json"
            with open(json_file, 'w') as f:
                json.dump(results, f, indent=2, default=str)
            print(f"\nResults saved to: {json_file}")
        
        if self.config.output_format in ["csv", "both"]:
            csv_file = Path(self.config.output_dir) / f"benchmark_summary_{timestamp}.csv"
            self._save_csv_summary(results, csv_file)
            print(f"Summary saved to: {csv_file}")
    
    def _save_csv_summary(self, results: Dict[str, Any], csv_file: Path):
        """Save a CSV summary of key metrics"""
        with open(csv_file, 'w', newline='') as f:
            writer = csv.writer(f)
            
            # Header
            writer.writerow([
                "Hash Function", "Status", "Hash Size (bits)",
                "Determinism Pass", "Avalanche Mean", "Avalanche Pass",
                "Bit Balance Pass %", "Uniformity Pass", "Serial Correlation",
                "Collisions Found", "Latency 32B (µs)", "Latency 1KB (µs)",
                "Throughput 1KB (MB/s)", "Throughput 1MB (MB/s)"
            ])
            
            # Data rows
            for fn_name, fn_data in results.get("hash_functions", {}).items():
                if fn_data.get("status") != "completed":
                    writer.writerow([fn_name, "FAILED", "", "", "", "", "", "", "", "", "", "", "", ""])
                    continue
                
                row = [fn_name, "PASS", fn_data.get("hash_size_bits", "")]
                
                # Correctness
                det = fn_data.get("correctness", {}).get("determinism", {})
                row.append("PASS" if det.get("failed", 1) == 0 else "FAIL")
                
                avalanche = fn_data.get("correctness", {}).get("avalanche", {})
                row.append(f"{avalanche.get('mean_flip_ratio', 0):.4f}")
                row.append("PASS" if avalanche.get("passed", False) else "FAIL")
                
                bit_balance = fn_data.get("correctness", {}).get("bit_balance", {})
                row.append(f"{bit_balance.get('pass_percentage', 0):.1f}")
                
                # Cryptographic
                uniformity = fn_data.get("cryptographic", {}).get("uniformity", {})
                row.append("PASS" if uniformity.get("uniformity_passed", False) else "FAIL")
                
                correlation = fn_data.get("cryptographic", {}).get("serial_correlation", {})
                row.append(f"{correlation.get('serial_correlation', 0):.6f}")
                
                collisions = fn_data.get("cryptographic", {}).get("collision_stress", {})
                row.append(collisions.get("collisions_found", "N/A"))
                
                # Performance
                perf = fn_data.get("performance", {})
                
                # Latencies
                lat_32 = perf.get("latency", {}).get("32", {})
                row.append(f"{lat_32.get('mean_ns', 0) / 1000:.2f}")  # Convert to µs
                
                lat_1k = perf.get("latency", {}).get("1024", {})
                row.append(f"{lat_1k.get('mean_ns', 0) / 1000:.2f}")  # Convert to µs
                
                # Throughputs
                tp_1k = perf.get("throughput", {}).get("1024", {})
                row.append(f"{tp_1k.get('megabytes_per_second', 0):.2f}")
                
                tp_1m = perf.get("throughput", {}).get("1048576", {})
                row.append(f"{tp_1m.get('megabytes_per_second', 0):.2f}")
                
                writer.writerow(row)

def main():
    parser = argparse.ArgumentParser(description="CodexHash Benchmark Harness")
    parser.add_argument("--output-dir", default="reports", help="Output directory for results")
    parser.add_argument("--format", choices=["json", "csv", "both"], default="both", help="Output format")
    parser.add_argument("--trials", type=int, default=100000, help="Number of trials for statistical tests")
    parser.add_argument("--duration", type=float, default=3.0, help="Duration for throughput tests (seconds)")
    parser.add_argument("--sizes", nargs="+", type=int, help="Custom message sizes to test")
    parser.add_argument("--threads", nargs="+", type=int, help="Custom thread counts for scalability")
    parser.add_argument("--seed", type=int, default=42, help="Random seed for reproducibility")
    parser.add_argument("--quick", action="store_true", help="Run quick tests (reduced trials/sizes)")
    parser.add_argument("--compare-only", action="store_true", help="Only test reference implementations")
    
    args = parser.parse_args()
    
    # Build configuration
    config = BenchmarkConfig(
        output_dir=args.output_dir,
        output_format=args.format,
        trials=args.trials if not args.quick else 1000,
        duration_s=args.duration if not args.quick else 1.0,
        seed=args.seed
    )
    
    if args.sizes:
        config.sizes = args.sizes
    elif args.quick:
        config.sizes = [32, 1024, 1024*1024]
    
    if args.threads:
        config.thread_counts = args.threads
    elif args.quick:
        config.thread_counts = [1, 2, 4]
    
    # Build hash function list
    hash_functions = []
    
    if not args.compare_only:
        try:
            hash_functions.append(CodexHashFunction())
        except Exception as e:
            print(f"Warning: Could not initialize CodexHash: {e}")
    
    # Reference implementations
    hash_functions.append(SHA256Function())
    hash_functions.append(SHA512Function())
    
    try:
        hash_functions.append(BLAKE3Function())
    except ImportError:
        print("Warning: BLAKE3 not available. Install with: pip install blake3")
    
    if not hash_functions:
        print("Error: No hash functions available for testing")
        return 1
    
    # Run benchmark
    harness = BenchmarkHarness(config)
    results = harness.run_comprehensive_benchmark(hash_functions)
    
    print(f"\nBenchmark completed! Results saved to {config.output_dir}/")
    return 0

if __name__ == "__main__":
    sys.exit(main())
