import { ESLint } from "eslint";
import { mkdirSync, writeFile as _writeFile } from "fs";
import { dirname } from "path";
import { DuplexOptions, Writable } from "stream";
import { promisify } from "util";

const writeFile = promisify(_writeFile);

const eslint = new ESLint({
    fix: true,
});

class SaveFormattedFileStream extends Writable {
    private file: string = "";

    constructor(private path: string, opts?: DuplexOptions) {
        super(opts);
    }

    _write(chunk: any, encoding: BufferEncoding, callback: (error?: Error | null) => void) {
        this.file += chunk;

        callback();
    }

    async _final(callback: (error?: Error | null) => void) {
        const [result] = await eslint.lintText(this.file, { filePath: this.path });

        await writeFile(this.path, result?.output ?? this.file);

        callback();
    }
}

export default function writeProcessor(path: string): Writable {
    mkdirSync(dirname(path), { recursive: true });

    return new SaveFormattedFileStream(path);
}
