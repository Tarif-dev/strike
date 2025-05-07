#!/usr/bin/env node

// Integration test for the fantasy points system
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

console.log('=== Fantasy Points System - Integration Test ===');

// Read the test output files to verify results
const checkOutputFile = (filePath, expectedPlayers) => {
  try {
    console.log(`\nChecking output file: ${filePath}`);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    // Check for key players we want to validate
    const playersToValidate = {
      'Rohit Sharma': 113,
      'Virat Kohli': 128,
      'Glenn Maxwell': 158,
      'Mohammed Shami': 58
    };
    
    let validated = 0;
    
    for (const [player, expectedPoints] of Object.entries(playersToValidate)) {
      if (fileContent.includes(`${player}`)) {
        // Extract the actual points using regex
        const regex = new RegExp(`${player}[^\\d]+(\\d+)\\s+points`);
        const match = fileContent.match(regex);
        
        if (match && match[1]) {
          const actualPoints = parseInt(match[1], 10);
          if (actualPoints === expectedPoints) {
            console.log(`✅ ${player}: ${actualPoints} points - CORRECT`);
            validated++;
          } else {
            console.log(`❌ ${player}: Expected ${expectedPoints}, got ${actualPoints} - INCORRECT`);
          }
        } else {
          console.log(`❓ ${player}: Points not found in output`);
        }
      } else {
        console.log(`❓ ${player} not found in output`);
      }
    }
    
    console.log(`\nValidation summary: ${validated}/${Object.keys(playersToValidate).length} players correctly validated`);
    
    return validated === Object.keys(playersToValidate).length;
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error.message);
    return false;
  }
};

// Run all our test scripts and validate their results
const runTest = async (command, description, outputFile = null) => {
  console.log(`\n=== ${description} ===`);
  
  // Execute the test
  try {
    const execSync = (await import('child_process')).execSync;
    console.log(`Running: ${command}`);
    execSync(command, { stdio: 'inherit' });
    console.log('✅ Test completed successfully');
    
    // Check output file if specified
    if (outputFile) {
      return checkOutputFile(outputFile, ['Rohit Sharma', 'Virat Kohli']);
    }
    
    return true;
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    return false;
  }
};

// Track overall test results
let allTestsPassed = true;

// Run the tests in sequence
const runAllTests = async () => {
  // Test 1: Rohit Sharma points calculation
  allTestsPassed = await runTest(
    'node /Users/mustafachaiwala/strike/calculate-points.js',
    'Individual Player Test (Rohit Sharma)',
    '/Users/mustafachaiwala/strike/fantasy-points-test.txt'
  ) && allTestsPassed;
  
  // Test 2: Full scorecard test
  allTestsPassed = await runTest(
    'node /Users/mustafachaiwala/strike/full-test.js',
    'Full Scorecard Test',
    '/Users/mustafachaiwala/strike/full-fantasy-points-test.txt'
  ) && allTestsPassed;
  
  // Test 3: Validation test
  allTestsPassed = await runTest(
    'node /Users/mustafachaiwala/strike/validate-fantasy-points.js',
    'Points Calculation Validation Test'
  ) && allTestsPassed;
  
  // Test 4: End-to-end workflow test
  allTestsPassed = await runTest(
    'node /Users/mustafachaiwala/strike/end-to-end-test.js',
    'End-to-End Workflow Test'
  ) && allTestsPassed;
  
  // Final results
  console.log('\n=== Integration Test Summary ===');
  if (allTestsPassed) {
    console.log('✅ SUCCESS: All fantasy points tests passed!');
  } else {
    console.log('❌ FAILURE: Some tests failed. See logs above for details.');
  }
  
  process.exit(allTestsPassed ? 0 : 1);
};

runAllTests().catch(error => {
  console.error('❌ Fatal error during tests:', error);
  process.exit(1);
});
