// Simple test script for checking JSON parsing
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get the scorecard file path
const scorecardPath = join(__dirname, 'src/samples/sample-scorecard.json');

console.log(`Reading scorecard from: ${scorecardPath}`);

try {
  // Read the file
  const fileContent = fs.readFileSync(scorecardPath, 'utf8');
  console.log('File content length:', fileContent.length);
  console.log('First 100 characters:', fileContent.substring(0, 100));
  
  // Parse JSON
  const data = JSON.parse(fileContent);
  
  // Print some stats
  console.log('Scorecard parsed successfully');
  console.log('Number of innings:', data.scorecard.length);
  
  // Print first batsman's details
  const firstBatsman = data.scorecard[0].batsman[0];
  console.log('First batsman:', firstBatsman.name, 'scored', firstBatsman.runs, 'runs');
  
  // Exit explicitly with success
  process.exit(0);
} catch (error) {
  console.error('Error:', error.message);
  // Exit with failure code
  process.exit(1);
}
