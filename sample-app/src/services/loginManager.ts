import { LocalTokenStorage, SyncLoginManager } from "@leancode/login-manager";

const authEndpoint = "https://api.fc.test.lncd.pl/auth";
const client = "future-collars.student";
const secret = "secret"; // unused anyway
const scopes = "openid offline_access future-collars.api";

const tokenStorage = new LocalTokenStorage();
export default new SyncLoginManager(tokenStorage, authEndpoint, secret, client, scopes);
