import { Configuration, ConfigurationParameters, FrontendApi } from "@ory/client";
import axios from "axios";

/**
 * Creates Ory Kratos FrontendApi client with axios and credentials configuration.
 * 
 * Initializes a Kratos client for browser-based applications with automatic
 * cookie handling and CORS support for authentication flows.
 * 
 * @param configuration - Kratos client configuration parameters
 * @returns Configured FrontendApi instance for Kratos operations
 * @example
 * ```typescript
 * import { createKratosClient } from '@leancodepl/kratos';
 * 
 * const kratosClient = createKratosClient({
 *   basePath: 'https://auth.example.com'
 * });
 * ```
 */
export function createKratosClient(configuration: ConfigurationParameters) {
    return new FrontendApi(
        new Configuration(configuration),
        undefined,
        axios.create({
            withCredentials: true,
        }),
    );
}
