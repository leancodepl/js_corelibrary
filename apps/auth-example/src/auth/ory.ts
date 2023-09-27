import { createKratosClient } from "@leancodepl/kratos";
import environment from "../environments/environment";

export const kratosClient = createKratosClient({
    basePath: environment.authUrl,
});
