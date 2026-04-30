# CodexHash Test & Benchmark Framework

A comprehensive, scientific testing framework for CodexHash that measures **correctness**, **performance**, and **cryptographic properties** with no-BS methodology.

## 🎯 What We Measure (And Why)

### 1. **Correctness** 
- **Determinism**: Same input → same output, always
- **Known Answer Tests (KATs)**: Fixed test vectors validated on every build/platform
- **Platform Consistency**: Identical outputs across operating systems and architectures

### 2. **Performance**
- **Throughput (MB/s)**: How fast can we hash large amounts of data
- **Latency (µs/op)**: Per-operation timing for small inputs
- **Scalability**: Performance scaling across multiple threads (1,2,4,8,16)
- **Memory Usage**: Peak RSS and buffer requirements
- **Energy Efficiency**: µJ per hash operation (where measurable)

### 3. **Cryptographic Properties**
- **Bit Balance**: Each output bit is ~50% ones across many samples
- **Avalanche Effect (SAC)**: Single bit flip → ~50% output bits change
- **Bit Independence (BIC)**: Output bit changes are uncorrelated
- **Uniformity**: Chi-square test on byte distribution
- **Serial Correlation**: Sequential bytes are uncorrelated
- **Collision Resistance**: Stress testing (not proof, but sanity check)

## 🚀 Quick Start

### Prerequisites
```bash
# Node.js (for CodexHash)
node --version  # 16.x, 18.x, or 20.x

# Python 3.7+
python3 --version

# Install Python dependencies
pip3 install numpy blake3 matplotlib seaborn
```

### One-Command Testing
```bash
# Setup and run quick tests
make setup && make quick

# Or run everything manually
python3 run_tests.py
```

### Available Commands
```bash
# Quick tests (1-2 minutes)
make quick

# Full benchmark suite (10-30 minutes)
make full

# Just correctness tests
make test

# Generate plots from results
python3 benchmarks/plot_results.py benchmarks/reports/latest_results.json
```

## 📊 Test Matrix

| Size   | Trials | What We Measure |
|--------|-------:|-----------------|
| 32 B   | 100K   | Latency, SAC, bit balance |
| 1 KB   | 100K   | Throughput, latency |
| 1 MB   | 10K    | Throughput, memory |
| 100 MB | 1K     | Sustained throughput |
| 1 GB   | 100    | Stability, thermal limits |

**Platforms Tested**: Linux x86_64, ARM64, macOS, Windows  
**Thread Counts**: 1, 2, 4, 8, 16  
**Comparisons**: SHA-256, SHA-512, BLAKE3

## 🎯 Acceptance Criteria (Ship/No-Ship Gates)

### 🚨 **BLOCKERS** (Must Pass)
- **Determinism**: 100% pass rate across all platforms
- **Avalanche Effect**: 0.50 ± 0.02 average bit flip ratio
- **Bit Balance**: Each bit in [0.49, 0.51] range over 1M+ samples

### ⚠️ **WARNINGS** (Should Pass)
- **Performance**: Within 2-3× of BLAKE3 on same hardware
- **Uniformity**: Chi-square p-value not extreme (0.01-0.99)
- **Thread Scaling**: Linear-ish scaling up to CPU core count

## 📁 Framework Structure

```
codex_hash/
├── tests/
│   ├── vectors/
│   │   └── known_answer_tests.json    # Fixed test vectors (KATs)
│   └── kat_manager.py                 # KAT generator/validator
├── benchmarks/
│   ├── harness.py                     # Main benchmark engine
│   ├── scripts/
│   │   └── codex_hash_bridge.js       # Node.js ↔ Python bridge
│   ├── config.json                    # Test configurations
│   ├── plot_results.py                # Visualization
│   └── reports/                       # Output directory
├── Makefile                           # Easy commands
└── run_tests.py                       # Simple entry point
```

## 🔧 Detailed Usage

### Known Answer Tests (KATs)
```bash
# Generate test vectors (first time)
python3 tests/kat_manager.py generate

# Validate existing vectors
python3 tests/kat_manager.py validate

# Add new test vector
python3 tests/kat_manager.py add --id "test_case" --description "Description" --input "data"
```

### Custom Benchmarks
```bash
# Quick development test
python3 benchmarks/harness.py --quick --output-dir reports/dev

# Custom sizes and trials
python3 benchmarks/harness.py --sizes 32 1024 --trials 10000 --duration 2.0

# Specific thread counts
python3 benchmarks/harness.py --threads 1 2 4 --format csv

# Reference implementations only
python3 benchmarks/harness.py --compare-only
```

### Visualization
```bash
# Generate all plots
python3 benchmarks/plot_results.py reports/benchmark_results_*.json

# Specific plot types
python3 benchmarks/plot_results.py results.json --plot throughput
python3 benchmarks/plot_results.py results.json --plot avalanche
```

## 📈 Output Formats

### JSON Results
Complete benchmark data with all metrics, system info, and raw measurements.

### CSV Summary  
Key metrics in spreadsheet format:
- Hash function, status, hash size
- Correctness pass/fail flags
- Performance numbers (latency, throughput)
- Cryptographic test results

### Plots
- **Throughput vs Message Size**: Performance scaling
- **Latency Distribution**: Per-operation timing histograms  
- **Thread Scalability**: Speedup with multiple threads
- **Avalanche Effect**: Bit flip ratio distribution
- **Bit Balance**: Per-bit bias analysis

## 🔬 Scientific Rigor

### Reproducibility
- **Fixed RNG seeds** for consistent statistical tests
- **Versioned test vectors** in JSON format
- **System information** captured (CPU, OS, compiler)
- **Exact command line** arguments recorded

### Statistical Validity
- **Large sample sizes** (100K+ trials for crypto tests)
- **Proper statistical tests** (chi-square, correlation)
- **Confidence intervals** and standard deviations
- **Multiple runs** to verify consistency

### Honest Reporting
- **Raw data available** in addition to summaries
- **No cherry-picking** of favorable results
- **Clear limitations** of collision testing
- **Comparison context** with established algorithms

## 🏗️ Implementation Details

### Python-Node.js Bridge
The framework calls CodexHash via a Node.js bridge script since the implementation is in TypeScript. This allows comprehensive testing while maintaining the original codebase.

### Threading Model
Uses Python's `ThreadPoolExecutor` for scalability testing. Each thread runs independent hash operations for the specified duration.

### Memory Management
Measures peak RSS where available. For detailed memory profiling, consider running under tools like `valgrind` or `perf`.

### Energy Measurement
Attempts to use Intel RAPL or ARM energy counters where available. Falls back gracefully on systems without energy monitoring.

## 🚨 Troubleshooting

### Common Issues

**"CodexHash not available"**
```bash
cd ../NPMPackages/codexhash
npm install && npm run build
```

**"BLAKE3 not available"**  
```bash
pip3 install blake3
```

**Plots not generating**
```bash
pip3 install matplotlib seaborn
```

**Permission denied**
```bash
chmod +x run_tests.py benchmarks/harness.py tests/kat_manager.py
```

### Performance Issues
- Use `--quick` flag for development
- Reduce `--trials` for faster crypto tests  
- Skip large sizes with custom `--sizes`
- Monitor CPU thermal throttling on long runs

## 📚 References

This framework implements testing methodology based on:
- NIST cryptographic algorithm validation principles
- Academic hash function evaluation standards  
- Industry best practices for performance benchmarking
- Open source testing frameworks (BLAKE3, SHA-3 competition)

## 🤝 Contributing

1. **Add test vectors**: Use `kat_manager.py add` for edge cases
2. **Extend metrics**: Modify `harness.py` for new measurements
3. **Platform support**: Test on new architectures/OS combinations
4. **Visualization**: Add new plot types in `plot_results.py`

## 📋 TODO/Roadmap

- [ ] **SIMD optimization detection** (AVX2, AVX-512, NEON)
- [ ] **Streaming interface testing** for large files
- [ ] **Side-channel resistance** basic timing analysis
- [ ] **Fuzzing integration** with AFL++ or similar
- [ ] **CI/CD integration** with GitHub Actions
- [ ] **Formal verification** integration with CBMC
- [ ] **Cross-platform binary testing** (WASM, embedded)

---

*This framework provides the foundation for **honest, reproducible, and scientifically rigorous** evaluation of CodexHash. The numbers will speak for themselves.*
