// The bucket barrel re-exports a grandchild, so `util` is a cohesive member of
// the bucket reached through this barrel — it must be suggested as a barrel
// re-export, not a move, even though the barrel sits two levels above it.
export * from "./deep/util"
