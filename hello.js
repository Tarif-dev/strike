// Basic test script
import fs from 'fs';

const output = [
  'Hello, world!',
  'This is a test script.',
  `Current time: ${new Date()}`
];

// Write output to a file
fs.writeFileSync('/Users/mustafachaiwala/strike/test-output.txt', output.join('\n'));
