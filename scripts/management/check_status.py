#!/usr/bin/env python3
"""
CodexHash Test Framework Status Check
Verify that all components are properly installed and configured
"""

import os
import sys
import subprocess
import json
from pathlib import Path

def check_command(cmd, description):
    """Check if a command is available"""
    try:
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
        return result.returncode == 0, result.stdout.strip()
    except Exception as e:
        return False, str(e)

def check_file(path, description):
    """Check if a file exists"""
    exists = Path(path).exists()
    return exists, "Found" if exists else "Missing"

def check_python_package(package):
    """Check if a Python package is available"""
    try:
        __import__(package)
        return True, "Available"
    except ImportError:
        return False, "Missing"

def main():
    print("🔍 CodexHash Test Framework Status Check")
    print("=" * 60)
    
    all_good = True
    
    # Check basic tools
    checks = [
        ("node --version", "Node.js"),
        ("python3 --version", "Python 3"),
        ("npm --version", "npm")
    ]
    
    print("\n📦 Basic Tools:")
    for cmd, desc in checks:
        status, output = check_command(cmd, desc)
        icon = "✅" if status else "❌"
        print(f"  {icon} {desc}: {output}")
        if not status:
            all_good = False
    
    # Check project structure
    print("\n📁 Project Structure:")
    files = [
        ("benchmarks/harness.py", "Main benchmark harness"),
        ("tests/kat_manager.py", "KAT manager"),
        ("benchmarks/scripts/codex_hash_bridge.js", "Node.js bridge"),
        ("tests/vectors/known_answer_tests.json", "Test vectors"),
        ("benchmarks/config.json", "Benchmark config"),
        ("Makefile", "Makefile")
    ]
    
    for file_path, desc in files:
        status, msg = check_file(file_path, desc)
        icon = "✅" if status else "❌"
        print(f"  {icon} {desc}: {msg}")
        if not status:
            all_good = False
    
    # Check Python dependencies
    print("\n🐍 Python Dependencies:")
    packages = [
        ("numpy", "NumPy"),
        ("json", "JSON (built-in)"),
        ("subprocess", "Subprocess (built-in)"),
    ]
    
    for package, desc in packages:
        status, msg = check_python_package(package)
        icon = "✅" if status else "❌"
        print(f"  {icon} {desc}: {msg}")
        if not status:
            all_good = False
    
    # Check optional dependencies
    print("\n🎨 Optional Dependencies:")
    optional_packages = [
        ("blake3", "BLAKE3 (for comparison)"),
        ("matplotlib", "Matplotlib (for plots)"),
        ("seaborn", "Seaborn (for plots)")
    ]
    
    for package, desc in optional_packages:
        status, msg = check_python_package(package)
        icon = "✅" if status else "⚠️"
        print(f"  {icon} {desc}: {msg}")
    
    # Check CodexHash package
    print("\n🔗 CodexHash Package:")
    codex_package_dir = Path("../NPMPackages/codexhash")
    
    if codex_package_dir.exists():
        print("  ✅ CodexHash package directory found")
        
        # Check if built
        dist_dir = codex_package_dir / "dist"
        if dist_dir.exists():
            print("  ✅ CodexHash package built (dist/ exists)")
        else:
            print("  ⚠️  CodexHash package not built (run: npm run build)")
            
        # Try to test the bridge
        bridge_script = Path("benchmarks/scripts/codex_hash_bridge.js")
        if bridge_script.exists():
            print("  ✅ Node.js bridge script found")
            
            # Test with simple input ("abc" in hex)
            try:
                result = subprocess.run([
                    'node', str(bridge_script), '616263'
                ], capture_output=True, text=True, timeout=10)
                
                if result.returncode == 0:
                    print("  ✅ CodexHash bridge working")
                else:
                    print(f"  ❌ CodexHash bridge failed: {result.stderr}")
                    all_good = False
            except Exception as e:
                print(f"  ❌ CodexHash bridge test failed: {e}")
                all_good = False
        else:
            print("  ❌ Node.js bridge script missing")
            all_good = False
    else:
        print("  ❌ CodexHash package directory not found")
        all_good = False
    
    # Check executable permissions
    print("\n🔧 File Permissions:")
    executables = [
        "run_tests.py",
        "tests/kat_manager.py", 
        "benchmarks/harness.py",
        "benchmarks/scripts/codex_hash_bridge.js"
    ]
    
    for exe in executables:
        if Path(exe).exists():
            is_executable = os.access(exe, os.X_OK)
            icon = "✅" if is_executable else "⚠️"
            status = "executable" if is_executable else "not executable (run: chmod +x)"
            print(f"  {icon} {exe}: {status}")
        else:
            print(f"  ❌ {exe}: missing")
    
    # Summary
    print("\n" + "=" * 60)
    if all_good:
        print("🎉 ALL SYSTEMS GO!")
        print("\nYou can now run:")
        print("  make quick      # Quick test")
        print("  make test       # Correctness tests")
        print("  make full       # Full benchmark")
        print("  python3 run_tests.py  # Simple runner")
    else:
        print("💥 ISSUES FOUND!")
        print("\nSetup steps:")
        print("  1. Install missing dependencies:")
        print("     pip3 install numpy blake3 matplotlib seaborn")
        print("  2. Build CodexHash package:")
        print("     cd ../NPMPackages/codexhash && npm install && npm run build")
        print("  3. Make files executable:")
        print("     chmod +x run_tests.py tests/kat_manager.py benchmarks/harness.py")
        print("  4. Or run: make setup")
    
    print("=" * 60)
    return 0 if all_good else 1

if __name__ == "__main__":
    sys.exit(main())
