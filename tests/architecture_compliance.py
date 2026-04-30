#!/usr/bin/env python3
"""
🏗️ CODEX ARCHITECTURE COMPLIANCE CHECKER
=========================================

Quick validation against the specification:
- Pure-Python reference + drop-in bridge
- MCP server (JSON-RPC 2.0) 
- REST fallback (FastAPI)
- PHP Laravel client compatibility
- Proper repo layout and interfaces
"""

import json
import time
import requests
import subprocess
from pathlib import Path
from typing import Dict, Any

class ArchitectureComplianceChecker:
    """Check compliance with the detailed architecture specification"""
    
    def __init__(self):
        self.base_path = Path("/home/web3codex/projects")
        self.compliance_score = 0
        self.total_checks = 0
        
    def check_repo_layout(self) -> Dict[str, Any]:
        """Check if current layout matches spec requirements"""
        results = {"component": "Repository Layout", "checks": {}}
        
        # Check current structure
        codex_hash_path = self.base_path / "codex_hash"
        
        expected_structure = {
            "src/codex_hash/__init__.py": "Python package initialization",
            "src/codex_hash/core.py": "Unified interface implementation", 
            "tests/": "Test directory",
            "benchmarks/": "Benchmark harness",
            "mcp-servers/codex-hash-mcp/": "MCP server implementation"
        }
        
        for path, description in expected_structure.items():
            full_path = codex_hash_path / path if not path.startswith("mcp-") else self.base_path / path
            exists = full_path.exists()
            results["checks"][path] = {
                "exists": exists,
                "description": description,
                "status": "✅ PASS" if exists else "❌ MISSING"
            }
            if exists:
                self.compliance_score += 1
            self.total_checks += 1
                
        return results
    
    def check_core_interface(self) -> Dict[str, Any]:
        """Check if CodexHasher matches specification interface"""
        results = {"component": "Core Interface Compliance", "checks": {}}
        
        try:
            import sys
            sys.path.insert(0, str(self.base_path / "codex_hash" / "src"))
            from codex_hash import CodexHarmonicHash
            
            hasher = CodexHarmonicHash()
            
            # Check if basic methods exist (approximating spec interface)
            methods_to_check = {
                "hash": "Main hashing method",
                "__init__": "Constructor"
            }
            
            for method, description in methods_to_check.items():
                has_method = hasattr(hasher, method)
                results["checks"][method] = {
                    "exists": has_method,
                    "description": description,
                    "status": "✅ PASS" if has_method else "❌ MISSING"
                }
                if has_method:
                    self.compliance_score += 1
                self.total_checks += 1
            
            # Test basic functionality
            try:
                test_result = hasher.hash("test_data")
                results["checks"]["basic_functionality"] = {
                    "works": True,
                    "sample_hash": str(test_result)[:32] + "...",
                    "status": "✅ PASS"
                }
                self.compliance_score += 1
            except Exception as e:
                results["checks"]["basic_functionality"] = {
                    "works": False,
                    "error": str(e),
                    "status": "❌ FAIL"
                }
            self.total_checks += 1
            
        except ImportError as e:
            results["checks"]["import"] = {
                "works": False,
                "error": str(e),
                "status": "❌ FAIL"
            }
            self.total_checks += 1
            
        return results
    
    def check_mcp_service(self) -> Dict[str, Any]:
        """Check MCP server compliance"""
        results = {"component": "MCP Service Compliance", "checks": {}}
        
        # Check if MCP server is running
        try:
            response = requests.get("http://localhost:3046/health", timeout=3)
            if response.status_code == 200:
                results["checks"]["mcp_server_health"] = {
                    "status": "✅ RUNNING",
                    "response": response.json() if 'json' in response.headers.get('content-type', '') else response.text
                }
                self.compliance_score += 1
            else:
                results["checks"]["mcp_server_health"] = {
                    "status": f"❌ UNHEALTHY ({response.status_code})"
                }
        except Exception as e:
            results["checks"]["mcp_server_health"] = {
                "status": f"❌ OFFLINE ({str(e)})"
            }
        self.total_checks += 1
        
        return results
    
    def check_rest_fallback(self) -> Dict[str, Any]:
        """Check REST API (FastAPI) compliance"""
        results = {"component": "REST API Compliance", "checks": {}}
        
        # Check FastAPI bridge server
        try:
            response = requests.get("http://localhost:3048/health", timeout=3)
            if response.status_code == 200:
                results["checks"]["rest_health"] = {
                    "status": "✅ RUNNING",
                    "response": response.json() if 'json' in response.headers.get('content-type', '') else response.text
                }
                self.compliance_score += 1
            else:
                results["checks"]["rest_health"] = {
                    "status": f"❌ UNHEALTHY ({response.status_code})"
                }
        except Exception as e:
            results["checks"]["rest_health"] = {
                "status": f"❌ OFFLINE ({str(e)})"
            }
        self.total_checks += 1
        
        # Test hash endpoint
        try:
            hash_response = requests.post(
                "http://localhost:3048/hash",
                json={"input_data": "architecture_test", "mode": "deterministic"},
                timeout=5
            )
            if hash_response.status_code == 200:
                results["checks"]["hash_endpoint"] = {
                    "status": "✅ FUNCTIONAL",
                    "sample_response": str(hash_response.json())[:100] + "..."
                }
                self.compliance_score += 1
            else:
                results["checks"]["hash_endpoint"] = {
                    "status": f"❌ FAILED ({hash_response.status_code})"
                }
        except Exception as e:
            results["checks"]["hash_endpoint"] = {
                "status": f"❌ ERROR ({str(e)})"
            }
        self.total_checks += 1
        
        return results
    
    def check_test_framework(self) -> Dict[str, Any]:
        """Check test framework compliance"""
        results = {"component": "Test Framework", "checks": {}}
        
        test_files = {
            "tests/kat_manager.py": "KAT (Known Answer Tests)",
            "tests/multi_service_testbed.py": "Multi-service integration tests",
            "benchmarks/harness.py": "Benchmark harness"
        }
        
        for test_file, description in test_files.items():
            file_path = self.base_path / "codex_hash" / test_file
            exists = file_path.exists()
            results["checks"][test_file] = {
                "exists": exists,
                "description": description,
                "status": "✅ PRESENT" if exists else "❌ MISSING"
            }
            if exists:
                self.compliance_score += 1
            self.total_checks += 1
            
        return results
    
    def generate_compliance_report(self) -> Dict[str, Any]:
        """Generate complete architecture compliance report"""
        
        report = {
            "architecture_spec": "Pure-Python reference + drop-in bridge",
            "timestamp": time.time(),
            "compliance_checks": {}
        }
        
        print("🏗️ CODEX ARCHITECTURE COMPLIANCE CHECKER")
        print("=" * 45)
        print("Validating against specification requirements...\n")
        
        # Run all compliance checks
        checks = [
            ("repo_layout", self.check_repo_layout),
            ("core_interface", self.check_core_interface), 
            ("mcp_service", self.check_mcp_service),
            ("rest_fallback", self.check_rest_fallback),
            ("test_framework", self.check_test_framework)
        ]
        
        for check_name, check_function in checks:
            print(f"Checking {check_name.replace('_', ' ').title()}...")
            report["compliance_checks"][check_name] = check_function()
            print()
        
        # Calculate compliance score
        compliance_percentage = (self.compliance_score / self.total_checks) * 100 if self.total_checks > 0 else 0
        
        report["summary"] = {
            "total_checks": self.total_checks,
            "passed_checks": self.compliance_score,
            "compliance_percentage": round(compliance_percentage, 1),
            "overall_status": "✅ COMPLIANT" if compliance_percentage >= 80 else 
                             "⚠️ PARTIAL" if compliance_percentage >= 60 else "❌ NON-COMPLIANT"
        }
        
        return report

def main():
    """Run architecture compliance check"""
    checker = ArchitectureComplianceChecker()
    report = checker.generate_compliance_report()
    
    # Save report
    report_path = Path("/home/web3codex/projects/codex_hash/tests/reports")
    report_path.mkdir(exist_ok=True)
    
    timestamp = int(time.time())
    report_file = report_path / f"architecture_compliance_{timestamp}.json"
    
    with open(report_file, 'w') as f:
        json.dump(report, f, indent=2)
    
    # Print summary
    print("📊 COMPLIANCE SUMMARY")
    print("-" * 25)
    for key, value in report["summary"].items():
        print(f"{key}: {value}")
    
    print(f"\n📄 Report saved: {report_file}")
    
    return report

if __name__ == "__main__":
    main()
