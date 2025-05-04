import { fileURLToPath } from 'url';
import { resolve, normalize, join, isAbsolute } from 'path';
import { promises, createReadStream } from 'fs';
import { answer } from './answer.js';

const cat = async (name, currentDir) => {
    if (!name) {
        return;
    }

    const filePath = isAbsolute(name) ? normalize(name) : join(currentDir, name);

    await promises.access(filePath);
    const readStream = createReadStream(filePath);
    answer('File content:');

    return new Promise((resolve, reject) => {
        readStream.pipe(process.stdout);
        readStream.on('end', () => {
            process.stdout.write('\n');
            resolve();
        });
        readStream.on('error', reject);
    });
};

const add = async (name, currentDir) => {
    if (!name) {
        return;
    }

    const filePath = resolve(currentDir, normalize(name));

    try {
        await promises.access(filePath);
        answer('The file already exist');
        return;
    } catch (error) {
        if (error.code === 'ENOENT') {
            await promises.writeFile(filePath, '');
        }
    }
};

const mkdir = async (name, currentDir) => {
    if (!name) {
        return;
    }

    const newDir = resolve(currentDir, normalize(name));
    await promises.mkdir(newDir);
};

const rn = async (oldName, name, currentDir) => {
    if (!oldName || !name) {
        return;
    }

    const filePath = join(currentDir, oldName);
    const renameFilePath = join(currentDir, name);

    try {
        await promises.access(renameFilePath);
        throw new Error('FS operation failed, already exist');
    } catch (error) {
        if (error.code !== 'ENOENT') {
            if (error.message === 'FS operation failed, unexpected') {
                throw error;
            }
            throw new Error('FS operation failed, unexpected');
        }
    }

    await promises.access(filePath);
    await promises.rename(filePath, renameFilePath);
};

//не реализована
const cp = async () => {
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const srcDir = join(__dirname, 'files');
    const destDir = join(__dirname, 'files_copy');

    try {
        await promises.access(srcDir);

        try {
            await promises.access(destDir);
            throw new Error('FS operation failed');
        } catch (error) {
            if (error.code !== 'ENOENT') {
                throw new Error('FS operation failed');
            }

            await promises.mkdir(destDir);
            const files = await promises.readdir(srcDir);

            for (const file of files) {
                await promises.copyFile(
                    join(srcDir, file),
                    join(destDir, file)
                );
            }
        }
    } catch (error) {
        throw new Error('FS operation failed');
    }
};
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