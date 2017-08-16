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
import { CannotRefreshToken } from "@leancode/login-manager/LoginManager";
import "isomorphic-fetch";
var MalformedRequest = (function (_super) {
    __extends(MalformedRequest, _super);
    function MalformedRequest() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return MalformedRequest;
}(Error));
export { MalformedRequest };
var UnauthorizedRequest = (function (_super) {
    __extends(UnauthorizedRequest, _super);
    function UnauthorizedRequest() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return UnauthorizedRequest;
}(Error));
export { UnauthorizedRequest };
var CommandQueryNotFound = (function (_super) {
    __extends(CommandQueryNotFound, _super);
    function CommandQueryNotFound() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return CommandQueryNotFound;
}(Error));
export { CommandQueryNotFound };
var CommandQueryExecutionFailed = (function (_super) {
    __extends(CommandQueryExecutionFailed, _super);
    function CommandQueryExecutionFailed() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return CommandQueryExecutionFailed;
}(Error));
export { CommandQueryExecutionFailed };
var CQRS = (function () {
    function CQRS(cqrsEndpoint, loginManager) {
        this.cqrsEndpoint = cqrsEndpoint;
        this.loginManager = loginManager;
    }
    CQRS.prototype.executeQuery = function (type, dto) {
        var path = this.cqrsEndpoint + "/query/" + type;
        return this.makeRequest(path, dto, true);
    };
    CQRS.prototype.executeCommand = function (type, dto) {
        var path = this.cqrsEndpoint + "/command/" + type;
        return this.makeRequest(path, dto, true);
    };
    CQRS.prototype.makeRequest = function (url, dto, firstRequest) {
        return __awaiter(this, void 0, void 0, function () {
            var init, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prepareRequest(dto)];
                    case 1:
                        init = _a.sent();
                        return [4 /*yield*/, fetch(url, init)];
                    case 2:
                        result = _a.sent();
                        if (!(!result.ok && result.status !== 422)) return [3 /*break*/, 9];
                        if (result.status === 400) {
                            console.error("The request was malformed");
                            throw new MalformedRequest("The request was malformed");
                        }
                        if (!(result.status === 401)) return [3 /*break*/, 8];
                        if (!this.loginManager) return [3 /*break*/, 7];
                        if (!firstRequest) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.loginManager.tryRefreshToken()];
                    case 3:
                        if (!(_a.sent())) {
                            throw new CannotRefreshToken("Cannot refresh access token after the server returned 401 Unauthorized");
                        }
                        return [4 /*yield*/, this.makeRequest(url, dto, false)];
                    case 4: return [2 /*return*/, _a.sent()];
                    case 5: throw new UnauthorizedRequest("The request has not been authorized and token refresh did not help");
                    case 6: return [3 /*break*/, 8];
                    case 7: throw new UnauthorizedRequest("User need to be authenticated to execute the command/query");
                    case 8:
                        if (result.status === 403) {
                            throw new UnauthorizedRequest("User is not authorized to execute the command/query");
                        }
                        if (result.status === 404) {
                            throw new CommandQueryNotFound("Command/query not found");
                        }
                        throw new CommandQueryExecutionFailed("Cannot execute command/query, server returned a " + result.status + " code");
                    case 9: return [4 /*yield*/, result.json()];
                    case 10: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    CQRS.prototype.prepareRequest = function (dto) {
        return __awaiter(this, void 0, void 0, function () {
            var headers, token;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        headers = new Headers();
                        headers.append("Content-Type", "application/json");
                        if (!(this.loginManager && this.loginManager)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.loginManager.getToken()];
                    case 1:
                        token = _a.sent();
                        headers.append("Authorization", "Bearer " + token);
                        _a.label = 2;
                    case 2: return [2 /*return*/, {
                            method: "POST",
                            body: JSON.stringify(dto),
                            headers: headers
                        }];
                }
            });
        });
    };
    return CQRS;
}());
export { CQRS };
