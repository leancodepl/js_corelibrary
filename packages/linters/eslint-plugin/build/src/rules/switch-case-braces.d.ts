import type { TSESLint } from "@typescript-eslint/utils";
type MessageIds = keyof typeof messages;
type Rule = TSESLint.RuleModule<MessageIds>;
declare const messages: {
    unexpectedLexical: string;
    addBraces: string;
    unexpectedBracesWithNoLexical: string;
    removeBraces: string;
};
export declare const switchCaseBracesRules: Rule;
export {};
