export interface Environment {
    apiUrl: string;
    authUrl: string;
}

const environment = new Proxy({} as Environment, {
    get: () => {
        throw new Error("You can't use unknown environment configuration. Please check you config.");
    },
});

export default environment;
