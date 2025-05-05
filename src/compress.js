import { join, extname, basename } from 'path';
import { createReadStream, createWriteStream } from 'fs';
import { createBrotliCompress, createBrotliDecompress } from 'node:zlib';
import { pipeline } from 'node:stream/promises';
import { answer } from './answer.js';

const compress = async (name, currentDir) => {
    if (!name) {
        answer('Invalid input');
        return;
    }

    const srcPath = join(currentDir, name);
    const destPath = join(currentDir, `${name}.br`);

    const readStream = createReadStream(srcPath);
    const writeStream = createWriteStream(destPath);
    const brotli = createBrotliCompress();

    await pipeline(readStream, brotli, writeStream);
};

const decompress = async (name, currentDir) => {
    if (!name) {
        answer('Invalid input');
        return;
    }

    const srcPath = join(currentDir, name);
    const ext = extname(name);
    const baseName = basename(name, ext);
    const destPath = join(currentDir, baseName);

    try {
        const readStream = createReadStream(srcPath);
        const writeStream = createWriteStream(destPath);
        const brotli = createBrotliDecompress();

        await pipeline(readStream, brotli, writeStream);
    } catch (error) {
        answer(`Error during decompression: ${error.message}`);
    }
};

export { compress, decompress };