#!/usr/bin/env bash

# Script to run all fantasy points tests

# Print header
echo "========================================"
echo "Cricket Fantasy Points - Test Suite"
echo "========================================"
echo

# Function to run a test with proper output formatting
run_test() {
  local test_name=$1
  local command=$2
  
  echo "Running test: $test_name"
  echo "Command: $command"
  echo "----------------------------------------"
  
  # Run the command
  if $command; then
    echo -e "\n✅ Test passed: $test_name"
    return 0
  else
    echo -e "\n❌ Test failed: $test_name"
    return 1
  fi
}

# Store the current directory
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

# Individual tests
echo "=== Individual Tests ==="
run_test "Calculate Points (Rohit Sharma)" "node $DIR/calculate-points.js"
echo
run_test "Full Scorecard Test" "node $DIR/full-test.js"
echo
run_test "Validation Test" "node $DIR/validate-fantasy-points.js"
echo
run_test "End-to-End Test" "node $DIR/end-to-end-test.js"
echo

# Integration test (runs all tests in sequence)
echo "=== Complete Integration Test ==="
run_test "Integration Test Suite" "node $DIR/integration-test.js"

echo
echo "========================================"
echo "Test Suite Execution Complete"
echo "========================================"
