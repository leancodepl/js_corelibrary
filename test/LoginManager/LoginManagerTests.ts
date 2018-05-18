import { LoginManager } from "@leancode/login-manager/LoginManager";
import { MemoryTokenStorage } from "@leancode/login-manager/MemoryTokenStorage";
import { expect } from "chai";

function createLoginManager() {
    return new LoginManager(new MemoryTokenStorage(), "", "", "", "");
}

describe("LoginManager", () => {
    it("should build signin request", () => {
        const loginManager = createLoginManager();

        const signInRequest = loginManager.buildSignInRequest("username", "password");

        expect(signInRequest.body).not.null;
    });
});
