import { Writable } from "stream";

export type GenerateFileOptions = {
    eslintExclusions?: string[] | "disable";
    writer: Writable;
};
