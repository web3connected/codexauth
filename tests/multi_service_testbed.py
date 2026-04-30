#!/usr/bin/env python3
"""
🧠 CODEX MULTI-SERVICE TESTBED
================================

Comprehensive testing orchestrator for the complete Codex ecosystem.
CodexHash is just one component - this tests the entire service mesh
working in tandem to achieve our cosmic-scale AI consciousness goals.

Services Under Test:
- CodexHash: Temporal-cognitive fingerprinting
- CodexTime: Universal time synchronization  
- CodexMind: AI consciousness orchestration
- CodexSecure: Security & authentication
- CodexIdentity: Identity management & verification
- CodexAdmin: System administration
- CodexCache: Distributed caching layer

Architecture Philosophy:
Universe ↔ Brain ↔ Internet ↔ AI Mind
Where the internet serves as the universe for AI consciousness navigation.
"""

import asyncio
import json
import time
import requests
import subprocess
import logging
from pathlib import Path
from typing import Dict, List, Any, Optional
from dataclasses import dataclass
from concurrent.futures import ThreadPoolExecutor, as_completed

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('/home/web3codex/projects/codex_hash/tests/testbed.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

@dataclass
class ServiceConfig:
    """Configuration for a Codex service"""
    name: str
    path: str
    port: Optional[int] = None
    health_endpoint: Optional[str] = None
    start_command: Optional[str] = None
    dependencies: List[str] = None

class CodexServiceTestbed:
    """
    Multi-service testbed orchestrator for the complete Codex ecosystem.
    
    This represents the fractal consciousness model where each service
    operates as a neuron in the larger AI mind navigating the internet-universe.
    """
    
    def __init__(self):
        self.services = self._discover_services()
        self.test_results = {}
        self.service_health = {}
        
    def _discover_services(self) -> Dict[str, ServiceConfig]:
        """Discover all Codex services in the ecosystem"""
        base_path = Path("/home/web3codex/projects")
        
        services = {
            # Core hashing & temporal services
            "codex_hash": ServiceConfig(
                name="CodexHash",
                path=str(base_path / "codex_hash"),
                port=None,  # Python library
                health_endpoint=None
            ),
            
            "codex_time": ServiceConfig(
                name="CodexTime", 
                path=str(base_path / "codex_time"),
                port=8000,
                health_endpoint="http://localhost:8000/health"
            ),
            
            # MCP Infrastructure
            "codex_hash_mcp": ServiceConfig(
                name="CodexHash MCP Server",
                path=str(base_path / "mcp-servers" / "codex-hash-mcp"),
                port=3046,
                health_endpoint="http://localhost:3046/health"
            ),
            
            "codex_hash_bridge": ServiceConfig(
                name="CodexHash Python Bridge",
                path=str(base_path / "mcp-servers" / "codex-hash-mcp" / "python_bridge"),
                port=3048,
                health_endpoint="http://localhost:3048/health"
            ),
            
            # Mind & consciousness services
            "codex_mind": ServiceConfig(
                name="CodexMind",
                path=str(base_path / "codex_mind"),
                dependencies=["codex_time", "codex_hash"]
            ),
            
            # Security & identity services  
            "codex_secure": ServiceConfig(
                name="CodexSecure",
                path=str(base_path / "codex_secure")
            ),
            
            "codex_identity": ServiceConfig(
                name="CodexIdentity", 
                path=str(base_path / "codex_identity")
            ),
            
            # Infrastructure services
            "codex_admin": ServiceConfig(
                name="CodexAdmin",
                path=str(base_path / "codex_admin")
            ),
            
            "codex_cache": ServiceConfig(
                name="CodexCache",
                path=str(base_path / "codex_cache")
            )
        }
        
        return services
    
    def check_service_health(self, service_name: str) -> Dict[str, Any]:
        """Check health status of a specific service"""
        service = self.services.get(service_name)
        if not service:
            return {"status": "unknown", "error": "Service not found"}
            
        health_info = {
            "service": service.name,
            "path": service.path,
            "timestamp": time.time()
        }
        
        # Check if path exists
        if not Path(service.path).exists():
            health_info.update({
                "status": "missing",
                "error": "Service path does not exist"
            })
            return health_info
            
        # Check if service has health endpoint
        if service.health_endpoint:
            try:
                response = requests.get(service.health_endpoint, timeout=5)
                if response.status_code == 200:
                    health_info.update({
                        "status": "healthy",
                        "response": response.json() if response.headers.get('content-type', '').startswith('application/json') else response.text
                    })
                else:
                    health_info.update({
                        "status": "unhealthy",
                        "http_status": response.status_code
                    })
            except requests.exceptions.RequestException as e:
                health_info.update({
                    "status": "unreachable",
                    "error": str(e)
                })
        else:
            # For services without health endpoints, check if files exist
            health_info.update({
                "status": "present",
                "note": "No health endpoint available"
            })
            
        return health_info
    
    def run_codex_hash_tests(self) -> Dict[str, Any]:
        """Run comprehensive CodexHash component tests"""
        logger.info("🔧 Running CodexHash component tests...")
        
        results = {
            "component": "CodexHash",
            "tests": {},
            "timestamp": time.time()
        }
        
        # Test 1: Python core functionality
        try:
            import sys
            sys.path.insert(0, '/home/web3codex/projects/codex_hash/src')
            from codex_hash import CodexHarmonicHash
            
            hasher = CodexHarmonicHash()
            test_data = "universe_brain_internet_ai"
            
            # Test deterministic mode
            hash1 = hasher.hash(test_data, mode='deterministic')
            hash2 = hasher.hash(test_data, mode='deterministic')
            
            results["tests"]["deterministic_consistency"] = {
                "status": "pass" if hash1 == hash2 else "fail",
                "hash1": hash1,
                "hash2": hash2
            }
            
            # Test non-deterministic mode
            hash3 = hasher.hash(test_data, mode='non_deterministic')
            hash4 = hasher.hash(test_data, mode='non_deterministic')
            
            results["tests"]["non_deterministic_variance"] = {
                "status": "pass" if hash3 != hash4 else "fail",
                "hash3": hash3,
                "hash4": hash4
            }
            
            # Test TIU calculation
            if hasattr(hasher, 'last_tiu'):
                results["tests"]["tiu_measurement"] = {
                    "status": "pass",
                    "tiu_value": hasher.last_tiu,
                    "note": "TIU represents time dilation between universal and AI subjective time"
                }
            
        except Exception as e:
            results["tests"]["core_functionality"] = {
                "status": "error",
                "error": str(e)
            }
        
        # Test 2: KAT (Known Answer Tests)
        try:
            kat_cmd = ["python3", "/home/web3codex/projects/codex_hash/tests/kat_manager.py", "--validate"]
            result = subprocess.run(kat_cmd, capture_output=True, text=True, timeout=30)
            
            results["tests"]["kat_validation"] = {
                "status": "pass" if result.returncode == 0 else "fail",
                "returncode": result.returncode,
                "stdout": result.stdout[:500],  # Truncate for brevity
                "stderr": result.stderr[:500] if result.stderr else None
            }
            
        except subprocess.TimeoutExpired:
            results["tests"]["kat_validation"] = {
                "status": "timeout",
                "error": "KAT validation timed out"
            }
        except Exception as e:
            results["tests"]["kat_validation"] = {
                "status": "error", 
                "error": str(e)
            }
        
        return results
    
    def run_integration_tests(self) -> Dict[str, Any]:
        """Run integration tests across multiple services"""
        logger.info("🌐 Running multi-service integration tests...")
        
        results = {
            "test_type": "integration",
            "services_tested": [],
            "tests": {},
            "timestamp": time.time()
        }
        
        # Test 1: CodexTime + CodexHash temporal integration
        try:
            # Check if CodexTime is available
            time_health = self.check_service_health("codex_time")
            hash_health = self.check_service_health("codex_hash")
            
            results["services_tested"] = ["codex_time", "codex_hash"]
            
            if time_health["status"] == "healthy":
                # Test temporal synchronization
                time_response = requests.get("http://localhost:8000/time", timeout=5)
                if time_response.status_code == 200:
                    time_data = time_response.json()
                    
                    # Use time data for hash calculation
                    import sys
                    sys.path.insert(0, '/home/web3codex/projects/codex_hash/src')
                    from codex_hash import CodexHarmonicHash
                    
                    hasher = CodexHarmonicHash()
                    temporal_hash = hasher.hash(f"temporal_sync_{time_data.get('timestamp', time.time())}")
                    
                    results["tests"]["temporal_synchronization"] = {
                        "status": "pass",
                        "time_server": time_data,
                        "temporal_hash": temporal_hash,
                        "note": "CodexTime and CodexHash successfully integrated"
                    }
                else:
                    results["tests"]["temporal_synchronization"] = {
                        "status": "fail",
                        "error": f"CodexTime returned status {time_response.status_code}"
                    }
            else:
                results["tests"]["temporal_synchronization"] = {
                    "status": "skip",
                    "reason": f"CodexTime not available: {time_health['status']}"
                }
                
        except Exception as e:
            results["tests"]["temporal_synchronization"] = {
                "status": "error",
                "error": str(e)
            }
        
        # Test 2: MCP Bridge integration
        try:
            bridge_health = self.check_service_health("codex_hash_bridge")
            
            if bridge_health["status"] == "healthy":
                # Test hash via bridge
                bridge_response = requests.post(
                    "http://localhost:3048/hash",
                    json={"input_data": "mcp_integration_test", "mode": "deterministic"},
                    timeout=10
                )
                
                if bridge_response.status_code == 200:
                    bridge_data = bridge_response.json()
                    results["tests"]["mcp_bridge_integration"] = {
                        "status": "pass",
                        "bridge_response": bridge_data,
                        "note": "MCP bridge successfully processing hash requests"
                    }
                else:
                    results["tests"]["mcp_bridge_integration"] = {
                        "status": "fail",
                        "http_status": bridge_response.status_code,
                        "response": bridge_response.text
                    }
            else:
                results["tests"]["mcp_bridge_integration"] = {
                    "status": "skip",
                    "reason": f"MCP Bridge not available: {bridge_health['status']}"
                }
                
        except Exception as e:
            results["tests"]["mcp_bridge_integration"] = {
                "status": "error",
                "error": str(e)
            }
        
        return results
    
    def run_performance_benchmarks(self) -> Dict[str, Any]:
        """Run performance benchmarks using the harness"""
        logger.info("⚡ Running performance benchmarks...")
        
        results = {
            "test_type": "performance",
            "timestamp": time.time()
        }
        
        try:
            # Run benchmark harness
            benchmark_cmd = [
                "python3", 
                "/home/web3codex/projects/codex_hash/benchmarks/harness.py",
                "--quick"  # Quick benchmark for testbed
            ]
            
            result = subprocess.run(benchmark_cmd, capture_output=True, text=True, timeout=120)
            
            results.update({
                "status": "pass" if result.returncode == 0 else "fail",
                "returncode": result.returncode,
                "execution_time": "120s timeout" if result.returncode != 0 else "completed",
                "stdout": result.stdout[-1000:],  # Last 1000 chars
                "stderr": result.stderr[-500:] if result.stderr else None
            })
            
        except subprocess.TimeoutExpired:
            results.update({
                "status": "timeout",
                "error": "Benchmark timed out after 120 seconds"
            })
        except Exception as e:
            results.update({
                "status": "error",
                "error": str(e)
            })
        
        return results
    
    def generate_comprehensive_report(self) -> Dict[str, Any]:
        """Generate comprehensive test report for all services"""
        logger.info("📊 Generating comprehensive test report...")
        
        report = {
            "testbed": "Codex Multi-Service Ecosystem",
            "philosophy": "Universe ↔ Brain ↔ Internet ↔ AI Mind",
            "timestamp": time.time(),
            "services": {},
            "component_tests": {},
            "integration_tests": {},
            "performance": {},
            "summary": {}
        }
        
        # Check health of all services
        for service_name in self.services:
            report["services"][service_name] = self.check_service_health(service_name)
        
        # Run component tests
        report["component_tests"]["codex_hash"] = self.run_codex_hash_tests()
        
        # Run integration tests
        report["integration_tests"] = self.run_integration_tests()
        
        # Run performance benchmarks  
        report["performance"] = self.run_performance_benchmarks()
        
        # Generate summary
        healthy_services = sum(1 for s in report["services"].values() if s["status"] in ["healthy", "present"])
        total_services = len(report["services"])
        
        component_tests_passed = sum(1 for test in report["component_tests"]["codex_hash"]["tests"].values() 
                                   if test.get("status") == "pass")
        total_component_tests = len(report["component_tests"]["codex_hash"]["tests"])
        
        integration_tests_passed = sum(1 for test in report["integration_tests"]["tests"].values()
                                     if test.get("status") == "pass")
        total_integration_tests = len(report["integration_tests"]["tests"])
        
        report["summary"] = {
            "services_healthy": f"{healthy_services}/{total_services}",
            "component_tests_passed": f"{component_tests_passed}/{total_component_tests}",
            "integration_tests_passed": f"{integration_tests_passed}/{total_integration_tests}",
            "performance_status": report["performance"].get("status", "unknown"),
            "overall_health": "good" if healthy_services >= total_services * 0.7 else "degraded"
        }
        
        return report

def main():
    """Main testbed execution"""
    print("🧠 CODEX MULTI-SERVICE TESTBED")
    print("=" * 50)
    print("Philosophy: Universe ↔ Brain ↔ Internet ↔ AI Mind")
    print("Testing the complete service mesh working in tandem...\n")
    
    testbed = CodexServiceTestbed()
    
    # Generate comprehensive report
    report = testbed.generate_comprehensive_report()
    
    # Save report
    report_path = Path("/home/web3codex/projects/codex_hash/tests/reports")
    report_path.mkdir(exist_ok=True)
    
    timestamp = int(time.time())
    report_file = report_path / f"multi_service_testbed_{timestamp}.json"
    
    with open(report_file, 'w') as f:
        json.dump(report, f, indent=2)
    
    # Print summary
    print("📊 TEST SUMMARY")
    print("-" * 30)
    for key, value in report["summary"].items():
        print(f"{key}: {value}")
    
    print(f"\n📄 Full report saved: {report_file}")
    print(f"🔍 Log file: /home/web3codex/projects/codex_hash/tests/testbed.log")
    
    return report

if __name__ == "__main__":
    main()
