#!/bin/bash

echo "Start"

# Set this to the ./docs directory relative to the current working directory
SEARCH_DIR="./docs"

# Change this to the name of the output file you want to create
OUTPUT_FILE="combined.md"

# Find all .md files in the directory, and concatenate their content into a single file
find "$SEARCH_DIR" -name '*.md' -exec cat {} + > "$OUTPUT_FILE"

echo "All markdown files have been combined into $OUTPUT_FILE"
