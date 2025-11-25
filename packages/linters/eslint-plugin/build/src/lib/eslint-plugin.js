"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.leancodePlugin = void 0;
const switch_case_braces_js_1 = require("../rules/switch-case-braces.js");
exports.leancodePlugin = {
    meta: { name: "leancode", version: "0.0.1" },
    rules: { "switch-case-braces": switch_case_braces_js_1.switchCaseBracesRules },
};
//# sourceMappingURL=eslint-plugin.js.map