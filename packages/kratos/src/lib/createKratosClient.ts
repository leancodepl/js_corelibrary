import { Configuration, ConfigurationParameters, FrontendApi } from "./kratos"

export function createKratosClient(configuration: ConfigurationParameters) {
    return new FrontendApi(new Configuration(configuration))
}
