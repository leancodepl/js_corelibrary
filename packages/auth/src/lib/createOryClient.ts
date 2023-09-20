import { Configuration, ConfigurationParameters, FrontendApi } from "@ory/kratos-client";
import axios from "axios";

export function createOryClient(configuration: ConfigurationParameters) {
    return new FrontendApi(
        new Configuration(configuration),
        undefined,
        axios.create({
            withCredentials: true,
        }),
    );
}
