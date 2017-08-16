/// <reference path="../TokenStorage.d.ts" />
var SessionTokenStorage = (function () {
    function SessionTokenStorage(tokenKey, refreshKey, expiryKey) {
        if (tokenKey === void 0) { tokenKey = "token"; }
        if (refreshKey === void 0) { refreshKey = "refresh_token"; }
        if (expiryKey === void 0) { expiryKey = "expiration_date"; }
        this.tokenKey = tokenKey;
        this.refreshKey = refreshKey;
        this.expiryKey = expiryKey;
    }
    Object.defineProperty(SessionTokenStorage.prototype, "token", {
        get: function () {
            return sessionStorage.getItem(this.tokenKey);
        },
        set: function (val) {
            this.setOrClearVar(this.tokenKey, val);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SessionTokenStorage.prototype, "refreshToken", {
        get: function () {
            return sessionStorage.getItem(this.refreshKey);
        },
        set: function (val) {
            this.setOrClearVar(this.refreshKey, val);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SessionTokenStorage.prototype, "expirationDate", {
        get: function () {
            var exp = sessionStorage.getItem(this.expiryKey);
            return exp ? new Date(exp) : null;
        },
        set: function (val) {
            var exp = val ? val.getTime().toString() : null;
            this.setOrClearVar(this.expiryKey, exp);
        },
        enumerable: true,
        configurable: true
    });
    SessionTokenStorage.prototype.setOrClearVar = function (key, val) {
        if (val) {
            sessionStorage.setItem(key, val);
        }
        else {
            sessionStorage.removeItem(key);
        }
    };
    return SessionTokenStorage;
}());
export { SessionTokenStorage };
