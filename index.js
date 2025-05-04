import * as readline from 'node:readline/promises';
import { exit, stdin, stdout } from 'node:process';
import os from 'os';
import { answer } from './src/answer.js';
import { up, cd, ls } from './src/nwd.js';
import { cat, add, mkdir } from './src/basic.js';
import { handleOS } from './src/os.js';
import { handleHash } from './src/hash.js';

const userName = getName();
const welcome = `Welcome to the File Manager, ${userName}`;
const goodbye = `Thank you for using File Manager, ${userName}, goodbye!`;
const invalidInput = 'Invalid input';
const operationFailed = 'Operation failed';
let currentDir = os.homedir();

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

        if (input === 'up') {
            currentDir = up(currentDir);
            return;
        }

        if (input === 'ls') {
            const list = await ls(currentDir);
            answer(list);
            return;
        }

        if (input.startsWith('cd')) {
            const newDir = await cd(input.slice(3), currentDir);
            currentDir = newDir ? newDir : currentDir;
            return;
        }

        if (input.startsWith('cat')) {
            await cat(input.slice(4), currentDir);
            return;
        }

        if (input.startsWith('add')) {
            await add(input.slice(4), currentDir);
            return;
        }

        if (input.startsWith('mkdir')) {
            await mkdir(input.slice(6), currentDir);
            return;
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