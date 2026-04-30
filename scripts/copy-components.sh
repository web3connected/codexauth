#!/bin/bash
# Publish web3codex-components SDK to src/components/codex/
# Run this from the consuming site root: bash scripts/copy-components.sh
# Always does a clean copy — safe to re-run to restore a corrupted codex/ folder

SOURCE_DIR="/home/web3codex/projects/SDK/web3codex-components/src/components/shared"
TARGET_DIR="./src/components/codex/shared"

echo "📦 Publishing web3codex-components (shared only)..."

# Clean existing shared folder
rm -rf "$TARGET_DIR"
mkdir -p "$TARGET_DIR"

# Copy shared components only
cp -r "$SOURCE_DIR"/. "$TARGET_DIR/"

echo "✅ Published successfully to $TARGET_DIR"
echo "   Contents:"
ls -1 "$TARGET_DIR"
