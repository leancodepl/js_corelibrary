/// <reference path="../TokenStorage.d.ts" />
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var CannotRefreshToken = (function (_super) {
    __extends(CannotRefreshToken, _super);
    function CannotRefreshToken() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return CannotRefreshToken;
}(Error));
export { CannotRefreshToken };
var LoginManager = (function () {
    function LoginManager(storage, endpoint, secret, client, scopes) {
        this.storage = storage;
        this.endpoint = endpoint;
        this.secret = secret;
        this.client = client;
        this.scopes = scopes;
        this.callbacks = [];
    }
    LoginManager.prototype.signOut = function () {
        this.storage.token = null;
        this.storage.refreshToken = null;
        this.storage.expirationDate = null;
        this.notify();
    };
    Object.defineProperty(LoginManager.prototype, "isSigned", {
        get: function () {
            return this.storage.token !== null;
        },
        enumerable: true,
        configurable: true
    });
    LoginManager.prototype.getToken = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.storage.token) {
                            throw new Error("Not signed in");
                        }
                        if (!(this.storage.expirationDate && this.storage.expirationDate < new Date())) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.tryRefreshToken()];
                    case 1:
                        if (!(_a.sent())) {
                            throw new CannotRefreshToken("Cannot refresh access token after it has expired");
                        }
                        _a.label = 2;
                    case 2: return [2 /*return*/, this.storage.token];
                }
            });
        });
    };
    LoginManager.prototype.trySignIn = function (username, password) {
        return this.acquireToken(this.buildSignInRequest(username, password));
    };
    LoginManager.prototype.tryRefreshToken = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.acquireToken(this.buildRefreshRequest())];
            });
        });
    };
    LoginManager.prototype.onChange = function (callback) {
        this.callbacks.push(callback);
    };
    LoginManager.prototype.removeOnChange = function (callback) {
        var idx = this.callbacks.indexOf(callback);
        if (idx !== -1) {
            this.callbacks.splice(idx, 1);
        }
    };
    LoginManager.prototype.acquireToken = function (init) {
        return __awaiter(this, void 0, void 0, function () {
            var result, tokenResult, expDate, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, fetch(this.endpoint + "/connect/token", init)];
                    case 1:
                        result = _a.sent();
                        if (!result.ok) {
                            if (result.status === 400) {
                                console.warn("Cannot sign user in, invalid username or password/refresh token, user will need to sign-in again");
                                this.signOut();
                            }
                            else {
                                console.error("Auth server returned an unknown error: %d %s", result.status, result.statusText);
                            }
                            return [2 /*return*/, false];
                        }
                        return [4 /*yield*/, result.json()];
                    case 2:
                        tokenResult = _a.sent();
                        this.storage.token = tokenResult.access_token;
                        this.storage.refreshToken = tokenResult.refresh_token;
                        expDate = new Date();
                        expDate.setSeconds(new Date().getSeconds() + tokenResult.expires_in);
                        this.storage.expirationDate = expDate;
                        this.notify();
                        return [2 /*return*/, true];
                    case 3:
                        e_1 = _a.sent();
                        console.warn("Cannot call Auth server ", e_1);
                        return [2 /*return*/, false];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    LoginManager.prototype.buildSignInRequest = function (username, password) {
        var params = new URLSearchParams();
        params.append("grant_type", "password");
        params.append("scope", this.scopes);
        params.append("username", username);
        params.append("password", password);
        return {
            method: "POST",
            headers: this.prepareHeaders(),
            body: params
        };
    };
    LoginManager.prototype.buildRefreshRequest = function () {
        var params = new URLSearchParams();
        params.append("grant_type", "refresh_token");
        params.append("scope", this.scopes);
        params.append("refresh_token", this.storage.refreshToken || "");
        return {
            method: "POST",
            headers: this.prepareHeaders(),
            body: params
        };
    };
    LoginManager.prototype.prepareHeaders = function () {
        var headers = new Headers();
        var sec = btoa(this.client + ":" + this.secret);
        headers.append("Authorization", "Basic " + sec);
        return headers;
    };
    LoginManager.prototype.notify = function () {
        for (var _i = 0, _a = this.callbacks; _i < _a.length; _i++) {
            var c = _a[_i];
            c();
        }
    };
    return LoginManager;
}());
export { LoginManager };
