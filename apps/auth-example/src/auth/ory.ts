import { createOryClient } from "@leancodepl/auth";
import environment from "../environments/environment";

export const kratosClient = createOryClient({
    basePath: environment.authUrl,
});
