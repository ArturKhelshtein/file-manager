import { sep, resolve, normalize, isAbsolute } from 'path';
import { readdir, access, stat } from 'fs/promises';
import { answer } from './answer.js';
import { homedir } from 'os';

const up = (inputDir) => {
    if (inputDir.split(sep).length > 1) {
        const upPath = inputDir.split(sep).slice(0, -1).join(sep);
        return upPath;
    }

    return inputDir;
}

const cd = async (inputDirRaw, currentDir) => {
    if (!inputDirRaw) {
        return;
    }

    let  inputDir = inputDirRaw.trim().replace(/^['"]|['"]$/g, '')
    inputDir = normalize(inputDir)
    let rawDir;

    if (inputDir === '..') {
        rawDir = up(currentDir);
    } else if (isAbsolute(inputDir)) {
        rawDir = inputDir;
    } else {
        rawDir = resolve(currentDir, inputDir);
    }

    const normalizedDir = normalize(rawDir);

    try {
        const stats = await stat(normalizedDir);
        if (stats.isDirectory()) {
            await access(normalizedDir);
            return normalizedDir;
        }
      } catch (error) {
        answer(error);
      }
}

const ls = async (inputDir) => {
    let result = '';

    const files = await readdir(inputDir);
    for (const file of files) {
        result += file + '\n'
    }

    return result;
};

export { up, cd, ls };