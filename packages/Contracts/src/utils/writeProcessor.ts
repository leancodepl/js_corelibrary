import { ESLint } from "eslint";
import { createWriteStream, mkdirSync } from "fs";
import { dirname } from "path";
import { Duplex, DuplexOptions, Writable } from "stream";

const eslint = new ESLint({
    fix: true,
});

class FormatFileStream extends Duplex {
    private file: string = "";

    constructor(private path: string, opts?: DuplexOptions) {
        super(opts);
    }

    _write(chunk: any, encoding: BufferEncoding, callback: (error?: Error | null) => void) {
        this.file += chunk;

        callback();
    }

    async _final(callback: (error?: Error | null) => void) {
        const [result] = await eslint.lintText(this.path, { filePath: this.path });

        callback();

        this.push(result.output ?? this.file);
    }

    _read() {}
}

export default function writeProcessor(path: string): Writable {
    mkdirSync(dirname(path), { recursive: true });

    return new FormatFileStream(path).pipe(createWriteStream(path));
}
