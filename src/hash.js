import { createHash } from 'crypto';
import { createReadStream, promises } from 'fs';
import { pipeline } from 'stream/promises';
import { answer } from './answer.js';

const handleHash = async (path) => {
    try {
        await promises.access(path);
        try {
            const hash = createHash('sha256');

            await pipeline(createReadStream(path), hash);
            const hexHash = hash.digest('hex');

            return hexHash;
        } catch (error) {
            answer(error);
        }
    } catch (error) {
        answer(error);
    }
}

export { handleHash };