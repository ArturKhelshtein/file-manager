import * as readline from 'node:readline/promises';
import { exit, stdin, stdout } from 'node:process';

const userName = getName();
const welcome = `Welcome to the File Manager, ${userName}`;
const goodbye = `Thank you for using File Manager, ${userName}, goodbye!`;

const rl = readline.createInterface({
    input: stdin,
    output: stdout,
    prompt: '> '
});

console.log(welcome);
rl.prompt();

rl.on('line', (line) => {
    rl.prompt();
    const input = line.trim();

    if (input === '.exit') {
        console.log(goodbye);
        exit(0);
    }
});

rl.on('SIGINT', () => {
    console.log(goodbye);
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