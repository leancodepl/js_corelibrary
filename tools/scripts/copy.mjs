/**
 * This is a small script for copying directory from one place to another
 */

import { cpSync } from "fs"

function invariant(condition, message) {
    if (!condition) {
        console.error(message)
        process.exit(1)
    }
}

const [, , srcDirectory, destDirectory] = process.argv

invariant(srcDirectory, "No source directory was provided")
invariant(destDirectory, "No destination directory was provided")

cpSync(srcDirectory, destDirectory, {
    recursive: true,
    filter: src => !src.includes("node_modules"),
})
