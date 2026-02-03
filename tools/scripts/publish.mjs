/**
 * This is a minimal script to publish your package to "npm".
 * This is meant to be used as-is or customize as you see fit.
 *
 * This script is executed on "dist/path/to/library" as "cwd" by default.
 *
 * You might need to authenticate with NPM before running this script.
 */

import devkit from "@nx/devkit"
import { execSync } from "node:child_process"
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"

const { readCachedProjectGraph } = devkit

function invariant(condition, message) {
  if (!condition) {
    console.error(message)
    process.exit(1)
  }
}

function updatePackageJson(version) {
  // Updating the version in "package.json" before publishing
  try {
    const json = JSON.parse(readFileSync(`package.json`).toString())
    json.version = version
    writeFileSync(`package.json`, JSON.stringify(json, null, 2))
  } catch {
    console.error(`Error reading package.json file from library build output.`)
  }

  process.stdout.write(
    JSON.stringify(
      {
        outputPath: project.data?.targets?.build?.options?.outputPath,
        root: project.data?.root,
      },
      null,
      2,
    ),
  )
}

// Executing publish script: node path/to/publish.mjs {name} --version {version} --tag {tag}
// Default "tag" to "next" so we won't publish the "latest" tag by accident.
const [, , name, registry, version, tag = "next"] = process.argv

invariant(registry && registry !== "undefined", "No registry provided")

// A simple SemVer validation to validate the version
const validVersion = /^\d+\.\d+\.\d+(-\w+\.\d+)?/
invariant(
  version && validVersion.test(version),
  `No version provided or version did not match Semantic Versioning, expected: #.#.#-tag.# or #.#.#, got ${version}.`,
)

const graph = readCachedProjectGraph()
const project = graph.nodes[name]

invariant(project, `Could not find project "${name}" in the workspace. Is the project.json configured correctly?`)

// Try to get outputPath from explicit build target options first,
// otherwise derive from project root (for inferred targets like @nx/vite/plugin)
const outputPath = project.data?.targets?.build?.options?.outputPath
const root = project.data?.root

if (!outputPath && !root) {
  invariant(
    false,
    `Could not find "build.options.outputPath" or project root of project "${name}". Is project.json configured correctly?`,
  )
}

if (outputPath) {
  process.chdir(outputPath)
  updatePackageJson(version)
} else {
  process.chdir(root)

  const distPublishFolder = ".dist_publish"

  // Clean up previous publish folder if it exists
  if (existsSync(distPublishFolder)) {
    rmSync(distPublishFolder, { recursive: true })
  }
  mkdirSync(distPublishFolder, { recursive: true })

  // Get list of files that would be included in the npm package
  const packOutput = execSync("npm pack --dry-run --json", { encoding: "utf-8" })
  const packInfo = JSON.parse(packOutput)
  const files = packInfo[0].files.map(f => f.path)

  // Copy files to the .dist_publish folder
  for (const file of files) {
    const destPath = join(distPublishFolder, file)
    const destDir = dirname(destPath)

    if (!existsSync(destDir)) {
      mkdirSync(destDir, { recursive: true })
    }
    cpSync(file, destPath)
  }

  // Change to publish folder and update package.json
  process.chdir(distPublishFolder)
  updatePackageJson(version)
}

const registryParam = registry !== "npm" ? `--registry ${registry}` : ""

// Execute "npm publish" to publish
execSync(`npm publish --access public --tag ${tag} ${registryParam}`)
