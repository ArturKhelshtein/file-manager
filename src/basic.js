import { fileURLToPath } from 'url';
import { resolve, normalize, join, isAbsolute, extname, basename } from 'path';
import { promises, createReadStream, createWriteStream } from 'fs';
import { answer } from './answer.js';

const cat = async (name, currentDir) => {
    if (!name) {
        answer('Invalid input');
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
        answer('Invalid input');
        return;
    }

    const filePath = resolve(currentDir, normalize(name));

    try {
        await promises.access(filePath);
        answer('Invalid input, the file already exist');
        return;
    } catch (error) {
        if (error.code === 'ENOENT') {
            await promises.writeFile(filePath, '');
        }
    }
};

const mkdir = async (name, currentDir) => {
    if (!name) {
        answer('Invalid input');
        return;
    }

    const newDir = resolve(currentDir, normalize(name));
    await promises.mkdir(newDir);
};

const rn = async (oldName, name, currentDir) => {
    if (!oldName || !name) {
        answer('Invalid input');
        return;
    }

    const filePath = join(currentDir, oldName);
    const renameFilePath = join(currentDir, name);

    try {
        await promises.access(renameFilePath);
        throw new Error('Invalid input, already exist');
    } catch (error) {
        if (error.code !== 'ENOENT') {
            throw new Error(error);
        }
    }

    await promises.access(filePath);
    await promises.rename(filePath, renameFilePath);
};

const cp = async (sourceFile, targetDir, currentDir) => {
    if (!sourceFile || !targetDir) {
        answer('Invalid input');
        return;
    }

    const sourcePath = isAbsolute(sourceFile) ? sourceFile : join(currentDir, sourceFile);

    try {
        const stats = await promises.stat(sourcePath);
        if (!stats.isFile()) {
            throw new Error('Invalid input, source path is not a file');
        }
    } catch (error) {
        throw new Error('Invalid input, source file does not exist');
    }

    try {
        const stats = await promises.stat(normalize(targetDir));
        if (!stats.isDirectory()) {
            throw new Error('Invalid input, target path is not a directory');
        }
    } catch (error) {
        throw new Error('Invalid input, target directory does not exist');
    }

    let targetPath;

    try {
        await promises.access(normalize(targetDir));
        const ext = extname(sourceFile);
        const baseName = basename(sourceFile, ext);
        let copyIndex = 0;

        do {
            targetPath = isAbsolute(targetDir)
                ? join(targetDir, `${baseName} - copy${copyIndex > 0 ? copyIndex : ''}${ext}`)
                : join(currentDir, targetDir, `${baseName} - copy${copyIndex > 0 ? copyIndex : ''}${ext}`);
            copyIndex++;
        } while (await promises.access(targetPath).then(() => true).catch(() => false));
    } catch (error) {
        if (error.code !== 'ENOENT') {
            throw new Error(error);
        }
    }

    const readStream = createReadStream(sourcePath);
    const writeStream = createWriteStream(targetPath);

    return new Promise((resolve, reject) => {
        readStream.pipe(writeStream);
        readStream.on('error', reject);
        writeStream.on('finish', resolve);
    });
};

const mv = async (sourceFile, targetDir, currentDir) => {
    if (!sourceFile || !targetDir) {
        answer('Invalid input');
        return;
    }

    const sourcePath = isAbsolute(sourceFile) ? sourceFile : join(currentDir, sourceFile);

    try {
        const stats = await promises.stat(sourcePath);
        if (!stats.isFile()) {
            throw new Error('Invalid input, source path is not a file');
        }
    } catch (error) {
        throw new Error('Invalid input, source file does not exist');
    }

    try {
        const stats = await promises.stat(normalize(targetDir));
        if (!stats.isDirectory()) {
            throw new Error('Invalid input, target path is not a directory');
        }
    } catch (error) {
        throw new Error('Invalid input, target directory does not exist');
    }

    const targetPath = isAbsolute(targetDir) ? join(targetDir, sourceFile) : join(currentDir, targetDir, sourceFile);

    if (sourcePath === targetPath) {
        answer('Invalid input');
        return;
    }

    const readStream = createReadStream(sourcePath);
    const writeStream = createWriteStream(targetPath);

    return new Promise((resolve, reject) => {
        readStream.pipe(writeStream);
        readStream.on('error', reject);
        writeStream.on('finish', async () => {
            await promises.unlink(sourcePath)
            resolve();
        });
    });
};

//не реализована
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