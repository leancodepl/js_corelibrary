declare class Facebook {
    private facebookAppId;
    private facebookPermissions;
    isSignedIn?: boolean;
    private token;
    constructor(facebookAppId: string, facebookPermissions: string);
    readonly accessToken: string;
    setup(loginCallback?: (accessToken: string) => Promise<void>): void;
    login(callback?: (accessToken: string) => Promise<void>): void;
    private getLoginStatus(callback?);
    private initializeSDK();
}
