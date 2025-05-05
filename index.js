import * as readline from 'node:readline/promises';
import { exit, stdin, stdout } from 'node:process';
import os from 'os';
import { answer } from './src/answer.js';
import { up, cd, ls } from './src/nwd.js';
import { cat, add, mkdir, rn, cp } from './src/basic.js';
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
    const [command, ...args] = line.match(/(?:[^\s"]+|"[^"]*")+/g) || [];
    const cleanedArgs = args.map(arg => arg.trim().replace(/^['"]|['"]$/g, ''));


    try {
        if (command === '.exit') {
            answer(goodbye);
            exit(0);
        }

        if (command === 'up') {
            currentDir = up(currentDir);
            return;
        }

        if (command === 'ls') {
            const list = await ls(currentDir);
            answer(list);
            return;
        }

        if (command.startsWith('cd')) {
            const newDir = await cd(cleanedArgs[0], currentDir);
            currentDir = newDir ? newDir : currentDir;
            return;
        }

        if (command.startsWith('cat')) {
            await cat(cleanedArgs[0], currentDir);
            return;
        }

        if (command.startsWith('add')) {
            await add(cleanedArgs[0], currentDir);
            return;
        }

        if (command.startsWith('mkdir')) {
            await mkdir(cleanedArgs[0], currentDir);
            return;
        }

        if (command.startsWith('rn')) {
            await rn(cleanedArgs[0], cleanedArgs[1], currentDir);
            return;
        }

        if (command.startsWith('cp')) {
            const cc = await cp(cleanedArgs[0], cleanedArgs[1], currentDir);
            console.log(cc)
            return;
        }

        if (command.startsWith('os')) {
            return answer(handleOS(cleanedArgs[0]));
        }

        if (command.startsWith('hash')) {
            const hash = await handleHash(cleanedArgs[0]);
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