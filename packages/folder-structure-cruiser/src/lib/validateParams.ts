/**
 * Parameters shared by every validate command.
 */
export type ValidateParams = {
  /** Directory or file paths to analyze. Defaults to [".*"] when run from the CLI without `--directory`. */
  directories: string[]
  /**
   * Path to a folder-structure-cruiser config file. When omitted,
   * `folder-structure-cruiser.config.{json,mjs,js,cjs}` is looked up in the
   * working directory; with no config present the command runs with built-in
   * defaults.
   */
  configPath?: string
}
