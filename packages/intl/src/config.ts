import { config } from "dotenv"
import { existsSync } from "fs"
import { join } from "path"

function findProjectRoot(startDir: string): string | null {
  let currentDir = startDir

  while (currentDir !== "/") {
    const packageJsonPath = join(currentDir, "package.json")
    if (existsSync(packageJsonPath)) {
      return currentDir
    }
    currentDir = join(currentDir, "..")
  }

  return null
}

function loadEnvFiles(projectRoot: string, nodeEnv?: string): void {
  const env = nodeEnv || process.env["NODE_ENV"] || "development"

  // Standard .env file loading order based on Next.js and other frameworks:
  // 1. .env.$(NODE_ENV).local (highest priority)
  // 2. .env.local (not loaded when NODE_ENV=test)
  // 3. .env.$(NODE_ENV)
  // 4. .env (lowest priority)
  const envFiles = [`.env.${env}.local`, env !== "test" ? ".env.local" : null, `.env.${env}`, ".env"].filter(
    Boolean,
  ) as string[]

  // Load in reverse order so higher priority files override lower priority ones
  for (let i = envFiles.length - 1; i >= 0; i--) {
    const envFile = envFiles[i]
    const envPath = join(projectRoot, envFile)

    if (existsSync(envPath)) {
      config({ path: envPath, override: false })
    }
  }
}

export function mergeWithEnv<T extends { poeditorApiToken?: string; poeditorProjectId?: number }>(
  options: T,
): T & { poeditorApiToken?: string; poeditorProjectId?: number } {
  // Find the project root by looking for package.json
  const projectRoot = findProjectRoot(process.cwd()) || findProjectRoot(__dirname) || process.cwd()

  // Load environment files using standard conventions
  loadEnvFiles(projectRoot)

  // Also try loading from current working directory as fallback
  config({ override: false })

  const poeditorApiToken = options.poeditorApiToken || process.env["POEDITOR_API_TOKEN"]
  const poeditorProjectId =
    options.poeditorProjectId ||
    (process.env["POEDITOR_PROJECT_ID"] ? parseInt(process.env["POEDITOR_PROJECT_ID"], 10) : undefined)

  return {
    ...options,
    poeditorApiToken,
    poeditorProjectId,
  }
}
