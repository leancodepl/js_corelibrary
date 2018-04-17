"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const LoginManager_1 = require("@leancode/login-manager/LoginManager");
const MemoryTokenStorage_1 = require("@leancode/login-manager/MemoryTokenStorage");
const CQRS_1 = require("@leancode/cqrs-client/CQRS");
const authEndpoint = "https://localhost:5000/auth";
const apiEndpoint = "https://localhost:5000/api";
const client = "skylevel/web";
const secret = "secret"; // unused anyway
const scopes = "openid offline_access api/skylevel";
const lm = new LoginManager_1.LoginManager(new MemoryTokenStorage_1.MemoryTokenStorage(), authEndpoint, secret, client, scopes);
const cqrsClient = new CQRS_1.CQRS(apiEndpoint, lm);
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
function delay(timeoutInMs) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise(resolve => setTimeout(resolve, timeoutInMs));
    });
}
(function () {
    return __awaiter(this, void 0, void 0, function* () {
        if (!(yield lm.trySignIn("sebastian@leancode.pl", "qwerty"))) {
            console.error("Couldn't login properly. Check settings and credentials.");
        }
        console.log("Logged in successfully. Waiting for token to expire.");
        yield delay(1000 * 30);
        const result = yield Promise.all(new Array(500).fill(0).map((_, i) => delay(i).then(() => cqrsClient.executeQuery("SkyLevel.Core.Contracts.Users.GetUserInfo", {}))));
        console.log(result.every(r => r.FirstName === "Sebastian"));
        // console.log(result);
        // const token = await lm.getToken();
        // console.log(token);
        // if (!await lm.tryRefreshToken()) {
        //     console.error("First token refresh failed");
        // }
        // console.log("Successfully refreshed token");
    });
})();
