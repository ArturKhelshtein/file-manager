import path from 'path';
import { fileURLToPath } from 'url';
import { normalize, isAbsolute } from 'path';
import { promises, createReadStream } from 'fs';
import { answer } from './answer.js';

const cat = async (fileName, currentDir) => {
    if (!fileName) {
        return;
    }

    const filePath = isAbsolute(fileName) ? path.normalize(fileName) : path.join(currentDir, fileName);

    await promises.access(filePath);
    const readStream = createReadStream(filePath);
    answer('File content:');

    return new Promise((resolve, reject) => {
        readStream.pipe(process.stdout);
        readStream.on('end', () => {
            process.stdout.write('\n');
            resolve();
        } );
        readStream.on('error', reject);
    });
};

const add = () => { };
const mkdir = () => { };
const rn = () => { };
const cp = () => { };
const mv = () => { };


const rm = async () => {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const filePath = path.join(__dirname, 'files', 'wrongFilename.txt');
    const renameFilePath = path.join(__dirname, 'files', 'properFilename.md');

    try {
        await promises.access(renameFilePath);
        throw new Error('FS operation failed, already exist');
    } catch (error) {
        if (error.code !== 'ENOENT') {
            if (error.message === 'FS operation failed, already exist') {
                throw error;
            }
            throw new Error('FS operation failed, unexpected');
        }
    }

    try {
        await promises.access(filePath);
        await promises.rename(filePath, renameFilePath);
    } catch (error) {
        throw new Error('FS operation failed, source file missed');
    }
};

export { cat, add, mkdir, rn, cp, mv, rm };