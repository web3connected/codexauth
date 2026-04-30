#!/usr/bin/env python3
"""
🧠 CODEXHASH ARCHITECTURE TESTBED
==================================

Testing framework for the complete CodexHash architecture:
- Pure Python reference implementation
- MCP server with JSON-RPC 2.0
- REST fallback with FastAPI  
- PHP bridge compatibility
- Benchmark harness with golden vectors

Architecture:
PHP ➜ (MCP Gateway) ➜ codexhash_mcp ➜ Python core ➜ digest/meta
"""

import asyncio
import json
import time
import requests
import subprocess
import hashlib
import base64
import hmac
import os
from pathlib import Path
from typing import Dict, List, Any, Optional, Literal
from dataclasses import dataclass
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

Bits = Literal[256, 512, 1024]

@dataclass
class TestVector:
    """Golden test vector for cross-platform validation"""
    input_data: str
    input_encoding: str = "utf8"
    algo: str = "codex-v1"
    bits: int = 256
    salt: str = ""
    rounds: int = 1
    expected_hex: str = ""
    description: str = ""

@dataclass
class BenchResult:
    """Benchmark result structure"""
    algo: str
    size: int
    iters: int
    mean_ms: float
    p95_ms: float
    mbps: float

class CodexHashArchitectureTestbed:
    """
    Comprehensive testbed for the CodexHash architecture specification.
    Tests all components: Python core, MCP server, REST API, benchmarks.
    """
    
    def __init__(self):
        self.base_path = Path("/home/web3codex/projects")
        self.codex_hash_path = self.base_path / "codex_hash"
        self.mcp_path = self.base_path / "mcp-servers" / "codex-hash-mcp"
        self.test_results = {}
        self.golden_vectors = self._load_golden_vectors()
        
    def _load_golden_vectors(self) -> List[TestVector]:
        """Load golden test vectors for cross-platform validation"""
        return [
            TestVector(
                input_data="",
                description="Empty input",
                expected_hex=""  # TODO: Generate from PHP reference
            ),
            TestVector(
                input_data="hello",
                description="Short ASCII",
                expected_hex=""
            ),
            TestVector(
                input_data="The quick brown fox jumps over the lazy dog",
                description="Standard test phrase",
                expected_hex=""
            ),
            TestVector(
                input_data="🌟 Unicode test with emojis 🚀",
                description="UTF-8 multi-byte",
                expected_hex=""
            ),
            TestVector(
                input_data="a" * 1024,
                description="1KB repeated character",
                expected_hex=""
            ),
            TestVector(
                input_data="hello",
                salt="deadbeef",
                description="Salted hash",
                expected_hex=""
            ),
            TestVector(
                input_data="hello",
                rounds=3,
                description="Multi-round hash",
                expected_hex=""
            )
        ]
    
    def test_python_core_interface(self) -> Dict[str, Any]:
        """Test M1: Core parity - Python implementation"""
        logger.info("🔧 Testing Python core interface...")
        
        results = {
            "component": "Python Core",
            "tests": {},
            "timestamp": time.time()
        }
        
        try:
            import sys
            sys.path.insert(0, str(self.codex_hash_path / "src"))
            from codex_hash import CodexHarmonicHash
            
            hasher = CodexHarmonicHash()
            
            # Test 1: Basic functionality
            test_data = "architecture_test"
            result = hasher.hash(test_data)
            
            results["tests"]["basic_functionality"] = {
                "status": "pass",
                "input": test_data,
                "output_hex": result.hash_value,
                "bits": len(result.hash_value) * 4,  # hex chars to bits
                "execution_time_ms": result.execution_time_ns / 1_000_000,
                "tiu": result.tiu,
                "entropy": result.entropy_score
            }
            
            # Test 2: Deterministic consistency
            result1 = hasher.hash(test_data)
            result2 = hasher.hash(test_data)
            
            results["tests"]["deterministic_consistency"] = {
                "status": "pass" if result1.hash_value == result2.hash_value else "fail",
                "hash1": result1.hash_value,
                "hash2": result2.hash_value,
                "note": "Deterministic hashing should produce identical results"
            }
            
            # Test 3: Different bit lengths (if supported)
            try:
                # Test if we can get different output sizes
                short_result = hasher.hash("test_256")
                results["tests"]["bit_length_support"] = {
                    "status": "partial",
                    "current_bits": len(short_result.hash_value) * 4,
                    "note": "Currently fixed bit length, spec requires 256/512/1024"
                }
            except Exception as e:
                results["tests"]["bit_length_support"] = {
                    "status": "not_implemented",
                    "error": str(e)
                }
            
            # Test 4: Salt support
            try:
                base_result = hasher.hash("test")
                # TODO: Add salt parameter support
                results["tests"]["salt_support"] = {
                    "status": "not_implemented",
                    "note": "Salt parameter needs to be added to interface"
                }
            except Exception as e:
                results["tests"]["salt_support"] = {
                    "status": "error",
                    "error": str(e)
                }
            
        except Exception as e:
            results["tests"]["import_error"] = {
                "status": "error",
                "error": str(e)
            }
        
        return results
    
    def test_mcp_tools(self) -> Dict[str, Any]:
        """Test M2: MCP/REST tools implementation"""
        logger.info("🌐 Testing MCP tools (JSON-RPC 2.0)...")
        
        results = {
            "component": "MCP Tools",
            "tests": {},
            "timestamp": time.time()
        }
        
        # Test MCP Gateway (port 3046)
        try:
            mcp_health = requests.get("http://localhost:3046/health", timeout=5)
            if mcp_health.status_code == 200:
                results["tests"]["mcp_gateway_health"] = {
                    "status": "pass",
                    "response": mcp_health.json()
                }
                
                # TODO: Test actual MCP JSON-RPC calls
                # For now, we test the REST bridge
                
            else:
                results["tests"]["mcp_gateway_health"] = {
                    "status": "fail",
                    "http_status": mcp_health.status_code
                }
        except Exception as e:
            results["tests"]["mcp_gateway_health"] = {
                "status": "error",
                "error": str(e)
            }
        
        # Test REST fallback (port 3048)
        try:
            rest_health = requests.get("http://localhost:3048/health", timeout=5)
            if rest_health.status_code == 200:
                results["tests"]["rest_fallback_health"] = {
                    "status": "pass",
                    "response": rest_health.json()
                }
                
                # Test /hash endpoint
                hash_payload = {
                    "input_data": "mcp_test",
                    "mode": "deterministic"  # Current interface
                    # TODO: Update to spec interface:
                    # "input": "mcp_test",
                    # "input_encoding": "utf8",
                    # "algo": "codex-v1",
                    # "bits": 256
                }
                
                hash_response = requests.post(
                    "http://localhost:3048/hash",
                    json=hash_payload,
                    timeout=10
                )
                
                if hash_response.status_code == 200:
                    hash_data = hash_response.json()
                    results["tests"]["rest_hash_tool"] = {
                        "status": "pass",
                        "request": hash_payload,
                        "response": hash_data,
                        "note": "Interface needs update to match spec"
                    }
                else:
                    results["tests"]["rest_hash_tool"] = {
                        "status": "fail",
                        "http_status": hash_response.status_code,
                        "response": hash_response.text
                    }
                    
            else:
                results["tests"]["rest_fallback_health"] = {
                    "status": "fail",
                    "http_status": rest_health.status_code
                }
                
        except Exception as e:
            results["tests"]["rest_fallback_health"] = {
                "status": "error",
                "error": str(e)
            }
        
        return results
    
    def test_specification_compliance(self) -> Dict[str, Any]:
        """Test compliance with the architecture specification"""
        logger.info("📋 Testing specification compliance...")
        
        results = {
            "component": "Specification Compliance",
            "tests": {},
            "timestamp": time.time()
        }
        
        # Check required directory structure
        required_structure = [
            "src/codex_hash/core.py",  # Current
            "src/codex_hash/algorithms/",  # Missing
            "tests/",  # Present
            "benchmarks/",  # Present
        ]
        
        structure_compliance = {}
        for path in required_structure:
            full_path = self.codex_hash_path / path
            structure_compliance[path] = {
                "exists": full_path.exists(),
                "type": "directory" if full_path.is_dir() else "file" if full_path.exists() else "missing"
            }
        
        results["tests"]["directory_structure"] = {
            "status": "partial",
            "structure": structure_compliance,
            "note": "Some spec directories missing (algorithms/, proper layout)"
        }
        
        # Check interface compliance
        try:
            import sys
            sys.path.insert(0, str(self.codex_hash_path / "src"))
            from codex_hash import CodexHarmonicHash
            
            hasher = CodexHarmonicHash()
            interface_compliance = {
                "has_hash_method": hasattr(hasher, 'hash'),
                "has_verify_method": hasattr(hasher, 'verify'),
                "supports_bits_param": False,  # TODO: Check if bits parameter exists
                "supports_salt_param": False,  # TODO: Check if salt parameter exists
                "supports_rounds_param": False,  # TODO: Check if rounds parameter exists
            }
            
            results["tests"]["interface_compliance"] = {
                "status": "partial",
                "compliance": interface_compliance,
                "note": "Core methods exist but spec parameters missing"
            }
            
        except Exception as e:
            results["tests"]["interface_compliance"] = {
                "status": "error",
                "error": str(e)
            }
        
        # Check MCP tools compliance
        required_tools = ["hash", "verify", "bench", "info"]
        tools_compliance = {}
        
        for tool in required_tools:
            # TODO: Test actual MCP JSON-RPC tool calls
            tools_compliance[tool] = {
                "implemented": False,  # Placeholder
                "note": "MCP JSON-RPC tools not yet implemented per spec"
            }
        
        results["tests"]["mcp_tools_compliance"] = {
            "status": "not_implemented",
            "tools": tools_compliance,
            "note": "Need to implement JSON-RPC 2.0 tools: hash, verify, bench, info"
        }
        
        return results
    
    def test_benchmarks(self) -> Dict[str, Any]:
        """Test M3: Benchmark harness"""
        logger.info("⚡ Testing benchmark harness...")
        
        results = {
            "component": "Benchmark Harness",
            "tests": {},
            "timestamp": time.time()
        }
        
        # Test if benchmark harness exists
        benchmark_harness = self.codex_hash_path / "benchmarks" / "harness.py"
        
        if benchmark_harness.exists():
            results["tests"]["harness_exists"] = {
                "status": "pass",
                "path": str(benchmark_harness)
            }
            
            # Try to run a quick benchmark
            try:
                benchmark_cmd = [
                    "python3", 
                    str(benchmark_harness),
                    "--quick"
                ]
                
                # Short timeout for test
                result = subprocess.run(
                    benchmark_cmd, 
                    capture_output=True, 
                    text=True, 
                    timeout=30,
                    cwd=str(self.codex_hash_path)
                )
                
                results["tests"]["harness_execution"] = {
                    "status": "pass" if result.returncode == 0 else "fail",
                    "returncode": result.returncode,
                    "stdout_preview": result.stdout[-500:] if result.stdout else "",
                    "stderr_preview": result.stderr[-200:] if result.stderr else ""
                }
                
            except subprocess.TimeoutExpired:
                results["tests"]["harness_execution"] = {
                    "status": "timeout",
                    "note": "Benchmark timed out (30s limit for test)"
                }
            except Exception as e:
                results["tests"]["harness_execution"] = {
                    "status": "error",
                    "error": str(e)
                }
        else:
            results["tests"]["harness_exists"] = {
                "status": "fail",
                "expected_path": str(benchmark_harness)
            }
        
        return results
    
    def generate_architecture_report(self) -> Dict[str, Any]:
        """Generate comprehensive architecture compliance report"""
        logger.info("📊 Generating architecture compliance report...")
        
        report = {
            "specification": "CodexHash Architecture",
            "version": "M0-M4 Milestones",
            "timestamp": time.time(),
            "test_components": {},
            "compliance_summary": {},
            "next_actions": []
        }
        
        # Run all component tests
        report["test_components"]["python_core"] = self.test_python_core_interface()
        report["test_components"]["mcp_tools"] = self.test_mcp_tools()
        report["test_components"]["specification"] = self.test_specification_compliance()
        report["test_components"]["benchmarks"] = self.test_benchmarks()
        
        # Generate compliance summary
        total_tests = 0
        passed_tests = 0
        
        for component, results in report["test_components"].items():
            for test_name, test_result in results.get("tests", {}).items():
                total_tests += 1
                if test_result.get("status") == "pass":
                    passed_tests += 1
        
        report["compliance_summary"] = {
            "tests_passed": f"{passed_tests}/{total_tests}",
            "pass_rate": f"{(passed_tests/total_tests*100):.1f}%" if total_tests > 0 else "0%",
            "current_milestone": "M0-M1 (Partial)",
            "overall_status": "In Development"
        }
        
        # Generate next actions based on test results
        next_actions = [
            "Implement spec-compliant interface: hash_bytes(), hash_hex(), verify()",
            "Add support for bits parameter (256/512/1024)",
            "Add salt and rounds parameters",
            "Implement MCP JSON-RPC 2.0 tools: hash, verify, bench, info",
            "Add HMAC authentication for REST endpoints",
            "Create proper directory structure per spec",
            "Generate golden test vectors for PHP equivalence",
            "Implement streaming variant for large inputs",
            "Add constant-time verify() method"
        ]
        
        report["next_actions"] = next_actions
        
        return report

def main():
    """Main testbed execution for architecture compliance"""
    print("🧠 CODEXHASH ARCHITECTURE TESTBED")
    print("=" * 50)
    print("Testing compliance with the complete specification:")
    print("- Pure Python reference + MCP bridge")
    print("- JSON-RPC 2.0 tools + REST fallback") 
    print("- PHP compatibility + benchmark harness")
    print()
    
    testbed = CodexHashArchitectureTestbed()
    
    # Generate comprehensive report
    report = testbed.generate_architecture_report()
    
    # Save report
    report_path = Path("/home/web3codex/projects/codex_hash/tests/reports")
    report_path.mkdir(exist_ok=True)
    
    timestamp = int(time.time())
    report_file = report_path / f"architecture_compliance_{timestamp}.json"
    
    with open(report_file, 'w') as f:
        json.dump(report, f, indent=2)
    
    # Print summary
    print("📊 ARCHITECTURE COMPLIANCE SUMMARY")
    print("-" * 40)
    print(f"Tests passed: {report['compliance_summary']['tests_passed']}")
    print(f"Pass rate: {report['compliance_summary']['pass_rate']}")
    print(f"Current milestone: {report['compliance_summary']['current_milestone']}")
    print(f"Overall status: {report['compliance_summary']['overall_status']}")
    
    print("\n🔧 NEXT ACTIONS:")
    for i, action in enumerate(report["next_actions"][:5], 1):
        print(f"{i}. {action}")
    
    print(f"\n📄 Full report saved: {report_file}")
    
    return report

if __name__ == "__main__":
    main()
