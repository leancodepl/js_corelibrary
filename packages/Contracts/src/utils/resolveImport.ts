import { posix } from "path";

const { dirname, extname, relative, resolve } = posix;

export default function resolveImport({
    baseDir,
    fileLocation,
    location,
}: {
    baseDir: string;
    fileLocation: string;
    location: string;
}) {
    let relativePath = relative(dirname(fileLocation), resolve(baseDir, location));

    if (!relativePath.startsWith(".")) {
        relativePath = "./" + relativePath;
    }

    const ext = extname(relativePath);

    return relativePath.slice(0, -ext.length);
}
