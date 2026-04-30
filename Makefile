# CodexHash Test & Benchmark Makefile

.PHONY: all setup test benchmark quick full clean install-deps

# Default target
all: setup test quick

# Setup environment
setup:
	@echo "🔧 Setting up CodexHash test environment..."
	cd ../NPMPackages/codexhash && npm install && npm run build
	pip3 install -r benchmarks/requirements.txt
	chmod +x scripts/testing/run_tests.py
	chmod +x tests/kat_manager.py
	chmod +x benchmarks/harness.py
	chmod +x benchmarks/scripts/codex_hash_bridge.js

# Install Python dependencies
install-deps:
	@echo "📦 Installing Python dependencies..."
	pip3 install -r benchmarks/requirements.txt

# Generate and validate Known Answer Tests
test:
	@echo "🧪 Running Known Answer Tests..."
	python3 tests/kat_manager.py generate
	python3 tests/kat_manager.py validate

# Quick benchmark (reduced trials and sizes)
quick:
	@echo "⚡ Running quick benchmark..."
	python3 benchmarks/harness.py --quick --output-dir benchmarks/reports/quick

# Full benchmark (all tests, may take a while)
full:
	@echo "🏁 Running full benchmark suite..."
	python3 benchmarks/harness.py --output-dir benchmarks/reports/full

# Performance-only tests (skip cryptographic tests for speed)
perf:
	@echo "📊 Running performance-only tests..."
	python3 benchmarks/harness.py --quick --output-dir benchmarks/reports/perf

# Run everything
benchmark: test quick

# Generate new test vectors
generate-vectors:
	@echo "🔄 Generating new test vectors..."
	python3 tests/kat_manager.py generate

# Validate existing vectors
validate-vectors:
	@echo "✅ Validating test vectors..."
	python3 tests/kat_manager.py validate

# Export vectors for other implementations
export-vectors:
	@echo "📤 Exporting test vectors..."
	python3 tests/kat_manager.py export --output tests/vectors/codex_hash_reference_vectors.json

# Clean up generated files
clean:
	@echo "🧹 Cleaning up..."
	rm -rf benchmarks/reports/*
	rm -rf tests/vectors/codex_hash_reference_vectors.json

# View latest results
results:
	@echo "📈 Latest benchmark results:"
	@find benchmarks/reports -name "*.json" -exec ls -la {} \; | tail -5
	@echo ""
	@find benchmarks/reports -name "*.csv" -exec ls -la {} \; | tail -5

# Help
help:
	@echo "CodexHash Test & Benchmark Targets:"
	@echo ""
	@echo "  setup          - Setup environment and build dependencies"
	@echo "  test           - Run Known Answer Tests (KATs)"
	@echo "  quick          - Run quick benchmark (reduced scope)"
	@echo "  full           - Run full benchmark suite"
	@echo "  perf           - Run performance-only tests"
	@echo "  benchmark      - Run tests + quick benchmark"
	@echo "  all            - Run setup + test + quick (default)"
	@echo ""
	@echo "  generate-vectors  - Generate new test vectors"
	@echo "  validate-vectors  - Validate existing vectors"
	@echo "  export-vectors    - Export vectors for other implementations"
	@echo ""
	@echo "  install-deps   - Install Python dependencies"
	@echo "  clean          - Clean up generated files"
	@echo "  results        - Show latest result files"
	@echo "  help           - Show this help"
	@echo ""
	@echo "Examples:"
	@echo "  make setup     # First time setup"
	@echo "  make test      # Run correctness tests"
	@echo "  make quick     # Run quick performance tests"
	@echo "  make full      # Run comprehensive benchmark"
