import { LoginManager } from "@leancode/login-manager/LoginManager";
import { MemoryTokenStorage } from "@leancode/login-manager/MemoryTokenStorage";
import { CQRS } from "@leancode/cqrs-client/CQRS";

const authEndpoint = "https://localhost:5000/auth";
const apiEndpoint = "https://localhost:5000/api";
const client = "";
const secret = "";
const scopes = "";

const username = "";
const password = "";

const lm = new LoginManager(new MemoryTokenStorage(), authEndpoint, secret, client, scopes);
const cqrsClient = new CQRS(apiEndpoint, lm);

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

async function delay(timeoutInMs: number) {
    return new Promise(resolve => setTimeout(resolve, timeoutInMs));
}

(async function () {
    if (!await lm.trySignIn(username, password)) {
        console.error("Couldn't login properly. Check settings and credentials.");
    }

    console.log("Logged in successfully. Waiting for token to expire.");

    await delay(1000 * 30);

    // const result: any[] = await Promise.all(
    //     new Array(500).fill(0).map((_, i) =>
    //         delay(i).then(() => cqrsClient.executeQuery("", {}))
    //     )
    // );

    // console.log(result.every(r => r.FirstName === "Sebastian"));
})();

