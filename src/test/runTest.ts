import * as core from '@actions/core';
import { exec } from '@actions/exec';
import * as fs from 'fs';
import path from 'path';

export async function runTest() {
  let output = '';
  let errorMessages = '';
  const options = {
    listeners: {
      stdout: (data: Buffer) => {
        output += data.toString();
      },
      stderr: (data: Buffer) => {
        errorMessages += data.toString();
      }
    }
  };
  const command = core.getInput('command') || 'test:ci';

  try {
    await exec('npm', ['run', command, '--silent', '2> /dev/null'], options);
    console.log('...', errorMessages);
  } catch (error) {
    console.log('!!!', error);
  }

  try {
    console.log('Writing test log to test_result/index.html');
    fs.mkdirSync('test_result');
    fs.writeFileSync(
      path.join('test_result', 'index.html'),
      `<html><body><pre><code>${output}</code></pre></body></html>`
    );
  } catch (error) {
    console.error(error);
    throw error;
  }
}
