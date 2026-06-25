const path = require("node:path")

const quote = file => `'${file.replace(/'/g, "'\\''")}'`

const getRelativeFiles = files => files.map(file => quote(path.relative(process.cwd(), file)))

module.exports = {
  "*": files => {
    const filesArgument = getRelativeFiles(files).join(" ")

    return [`nx format:write --files ${filesArgument}`, `nx affected -t lint --files ${filesArgument}`]
  },
}
