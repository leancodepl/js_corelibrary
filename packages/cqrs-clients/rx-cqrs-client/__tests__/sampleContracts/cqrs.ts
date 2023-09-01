import { mkCqrsClient } from "../../src/lib/mkCqrsClient";

export type CQRS = ReturnType<typeof mkCqrsClient>;
