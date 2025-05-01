import * as readline from 'node:readline/promises';
import { exit, stdin, stdout } from 'node:process';
import os from 'os';
import { handleOS } from './src/os.js';
import { answer } from './src/answer.js';
import { handleHash } from './src/hash.js';

const userName = getName();
const welcome = `Welcome to the File Manager, ${userName}`;
const goodbye = `Thank you for using File Manager, ${userName}, goodbye!`;
const invalidInput = 'Invalid input';
const operationFailed = 'Operation failed'
let currentDir = os.homedir()

const rl = readline.createInterface({
    input: stdin,
    output: stdout,
    prompt: '> '
});
answer(welcome);
answer(`You are currently in ${currentDir}`);
rl.prompt();

rl.on('line', async (line) => {
    const input = line.trim();

    try {
        if (input === '.exit') {
            answer(goodbye);
            exit(0);
        }

        if (input.startsWith('os')) {
            return answer(handleOS(input.slice(5)));
        }

        if (input.startsWith('hash')) {
            const hash = await handleHash(input.slice(5));
            if (hash) {
                return answer(hash);
            } else {
                return answer(invalidInput)
            }
        }

        answer(operationFailed)
    } catch (error) {
        answer(`Error ${error}`);
    } finally {
        answer(`You are currently in ${currentDir}`);
        rl.prompt();
    }
});

rl.on('SIGINT', () => {
    answer(goodbye);
    exit(0);
});

function getName() {
    const result = process.argv.slice(2)
        .map((arg) => {
            if (arg.startsWith('--')) {
                return arg.slice(2);
            }
        }).filter(Boolean)[0];

    return result || 'user';
};