"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const switch_case_braces_js_1 = tslib_1.__importDefault(require("./rules/switch-case-braces.js"));
const leancodePlugin = {
    meta: { name: "leancode" },
    rules: { "switch-case-braces": switch_case_braces_js_1.default },
};
exports.default = leancodePlugin;
//# sourceMappingURL=leancode-plugin.js.map