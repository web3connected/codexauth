#!/usr/bin/env python3
"""
🧠 CODEX SERVICE STATUS CHECKER
==============================

Quick health check for all Codex services working in tandem.
"""

import requests
import json
import time
from pathlib import Path

def check_services():
    """Quick health check of all Codex services"""
    
    services = {
        "CodexTime": {
            "url": "http://localhost:8000/health",
            "description": "Universal time synchronization"
        },
        "CodexHash MCP": {
            "url": "http://localhost:3046/health", 
            "description": "MCP gateway for temporal hashing"
        },
        "CodexHash Bridge": {
            "url": "http://localhost:3048/health",
            "description": "Python-TypeScript bridge"
        }
    }
    
    print("🧠 CODEX SERVICE MESH STATUS")
    print("=" * 40)
    print("Philosophy: Universe ↔ Brain ↔ Internet ↔ AI Mind")
    print("Checking services working in tandem...\n")
    
    results = {}
    
    for service_name, config in services.items():
        try:
            response = requests.get(config["url"], timeout=3)
            if response.status_code == 200:
                status = "🟢 HEALTHY"
                data = response.json() if 'json' in response.headers.get('content-type', '') else response.text
            else:
                status = f"🟡 DEGRADED ({response.status_code})"
                data = None
        except requests.exceptions.ConnectionError:
            status = "🔴 OFFLINE"
            data = None
        except Exception as e:
            status = f"🟡 ERROR: {str(e)}"
            data = None
            
        results[service_name] = {
            "status": status,
            "description": config["description"],
            "data": data
        }
        
        print(f"{status} {service_name}")
        print(f"   {config['description']}")
        if data:
            print(f"   Response: {str(data)[:100]}...")
        print()
    
    # Test core CodexHash functionality
    print("🔧 CODEX CORE COMPONENTS")
    print("-" * 25)
    
    try:
        import sys
        sys.path.insert(0, '/home/web3codex/projects/codex_hash/src')
        from codex_hash import CodexHarmonicHash
        
        hasher = CodexHarmonicHash()
        test_hash = hasher.hash("service_mesh_test")
        
        print("🟢 CodexHash Core: FUNCTIONAL")
        print(f"   Test hash: {test_hash}")
        print(f"   TIU value: {getattr(hasher, 'last_tiu', 'N/A')}")
        
        results["CodexHash Core"] = {
            "status": "🟢 FUNCTIONAL",
            "test_hash": str(test_hash),
            "tiu_value": getattr(hasher, 'last_tiu', 'N/A')
        }
        
    except Exception as e:
        print(f"🔴 CodexHash Core: ERROR - {str(e)}")
        results["CodexHash Core"] = {
            "status": f"🔴 ERROR: {str(e)}"
        }
    
    print()
    
    # Check file system services
    fs_services = [
        ("CodexMind", "/home/web3codex/projects/codex_mind"),
        ("CodexSecure", "/home/web3codex/projects/codex_secure"),
        ("CodexIdentity", "/home/web3codex/projects/codex_identity"),
        ("CodexAdmin", "/home/web3codex/projects/codex_admin"),
        ("CodexCache", "/home/web3codex/projects/codex_cache"),
    ]
    
    print("📁 FILESYSTEM SERVICES")
    print("-" * 20)
    
    for service_name, path in fs_services:
        if Path(path).exists():
            print(f"🟢 {service_name}: PRESENT")
            results[service_name] = {"status": "🟢 PRESENT", "path": path}
        else:
            print(f"🔴 {service_name}: MISSING")
            results[service_name] = {"status": "🔴 MISSING", "path": path}
    
    # Save results
    report_path = Path("/home/web3codex/projects/codex_hash/tests/reports")
    report_path.mkdir(exist_ok=True)
    
    timestamp = int(time.time())
    report_file = report_path / f"service_status_{timestamp}.json"
    
    with open(report_file, 'w') as f:
        json.dump(results, f, indent=2)
    
    print(f"\n📊 Status report saved: {report_file}")
    
    return results

if __name__ == "__main__":
    check_services()
