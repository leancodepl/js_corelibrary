import { createKratosClient } from "@leancodepl/auth";
import environment from "../environments/environment";

export const kratosClient = createKratosClient({
    basePath: environment.authUrl,
});
