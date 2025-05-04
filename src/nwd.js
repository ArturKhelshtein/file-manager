import { sep, resolve, normalize, isAbsolute } from 'path';
import { readdir, access, stat } from 'fs/promises';
import { answer } from './answer.js';

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
    let result ='Files and folders in current directory\n'
    result += '(index) | Name                 | Type \n';
    result += '--------------------------------------\n';

    const data = await readdir(inputDir);
    const directories = [];
    const files = [];

    for (const file of data) {
        const fileDir = resolve(inputDir, file);
        const stats = await stat(fileDir);
        if (stats.isDirectory()) {
            directories.push(file);
        } else {
            files.push(file);
        }
    }

    for (const [index, dir] of directories.entries()) {
        const slicedName = dir.length > 20 ? dir.slice(0, 17) + '...' : dir;
        result += `${index.toString().padEnd(7)} | ${slicedName.padEnd(20)} | directory\n`;
    }

    for (const [index, file] of files.entries()) {
        const slicedName = file.length > 20 ? file.slice(0, 17) + '...' : file;
        result += `${(directories.length + index).toString().padEnd(7)} | ${slicedName.padEnd(20)} | file\n`;
    }

    return result;
};

export { up, cd, ls };