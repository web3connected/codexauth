# CodexHash Scripts Directory

This directory contains all the helper scripts for the CodexHash project, organized by category.

## Directory Structure

### `/deployment/`
Scripts for deploying the CodexHash application:
- `deploy-simple.sh` - Simple deployment script
- `deploy_production.sh` - Production deployment with full configuration
- `forge-deploy.sh` - Foundry/Forge deployment for smart contracts
- `setup-github-secrets.sh` - GitHub Actions secrets configuration

### `/testing/`
Scripts for testing and validation:
- `run_tests.py` - Main test runner for the project
- `test_python_implementation.py` - Python implementation tests
- `test_site.sh` - Site functionality testing script

### `/management/`
Scripts for managing the running application:
- `start_codexhash.sh` - Start the CodexHash services
- `stop_codexhash.sh` - Stop the CodexHash services
- `check_status.py` - Check the status of running services
- `ecosystem.config.js` - PM2 process management configuration

### `/build/` (existing)
Build-related scripts and configurations

### `/deploy/` (existing)
Additional deployment utilities

### `/utils/` (existing)
General utility scripts

## Usage

All scripts maintain their original functionality but are now organized for better project structure. Update any references to these scripts to use their new paths:

```bash
# Old way
./deploy-simple.sh

# New way
./scripts/deployment/deploy-simple.sh
```

## Permissions

All executable scripts maintain their permissions. If you need to make a script executable:

```bash
chmod +x scripts/category/script-name.sh
```