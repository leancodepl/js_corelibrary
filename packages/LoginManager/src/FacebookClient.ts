class Facebook {
    public isSignedIn?: boolean;
    private token: string;

    constructor(
        private facebookAppId: string,
        private facebookPermissions: string
    ) {
        this.isSignedIn = undefined;
        this.token = "";
    }

    public get accessToken(): string {
        return this.token;
    }

    public setup(loginCallback?: (accessToken: string) => Promise<void>): void {
        let js, ref = document.getElementsByTagName("script")[0];
        let id = "facebook-jssdk";

        if (document.getElementById(id)) {
            this.initializeSDK();
            this.getLoginStatus(loginCallback);
            return;
        }

        js = document.createElement("script");
        js.id = id;
        js.async = true;
        js.src = "//connect.facebook.net/pl_PL/sdk.js";
        if (ref.parentNode != null) {
            ref.parentNode.insertBefore(js, ref);
        }
        js.onload = () => {
            this.initializeSDK();
            this.getLoginStatus(loginCallback);
        };
    }

    public login(callback?: (accessToken: string) => Promise<void>) {
        FB.login((response) => {
            if (response.status === "connected") {
                this.isSignedIn = true;
                this.token = response.authResponse.accessToken;
                if (callback) {
                    callback(response.authResponse.accessToken);
                }
            } else {
                this.isSignedIn = false;
            }
        }, { scope: this.facebookPermissions });
    }

    private getLoginStatus(callback?: (accessToken: string) => Promise<void>) {
        FB.getLoginStatus((response) => {
            if (response.status === "connected") {
                this.isSignedIn = true;
                this.token = response.authResponse.accessToken;
                if (callback) {
                    callback(response.authResponse.accessToken);
                }
            } else {
                this.isSignedIn = false;
            }
        });
    }

    private initializeSDK() {
        FB.init({
            appId: this.facebookAppId,
            xfbml: true,
            version: "v2.9"
        });
    }
}
