module.exports = {
  "*": ["nx format:write --files", "nx affected -t lint --files"],
};
