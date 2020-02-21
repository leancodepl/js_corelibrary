import React, { createElement, ReactNode } from "react";
import { FormattedMessage } from "react-intl";
type FormattedMessageProps = import("react-intl/dist/components/message").Props;

type Pl = typeof import("./locales/pl.json");
type En = typeof import("./locales/en.json");

// type LanguageEquity = AssertNever<UnionEqual<keyof Pl, keyof En>>;

export type Term = keyof Pl | keyof En;

export const supportedLanguages = ["pl", "en"] as const;
export type SupportedLanguages = typeof supportedLanguages[number];

export default function mkI18n<TSupportedLanguages extends string>(
    locales: {
        [TSupportedLanguage in TSupportedLanguages]: any;
    },
) {
    return {
        Localize: (props: FormattedMessageProps & { id: Term }) => <FormattedMessage {...props} />,
        Provider: 
    };
}

const defaultAllowedRichTextFlags = ["ul", "li", "p", "b", "i"] as (keyof JSX.IntrinsicElements)[];
export const renderDefaultRichTextTags = (allowedTags: (keyof JSX.IntrinsicElements)[] = defaultAllowedRichTextFlags) =>
    Object.fromEntries(
        allowedTags.map(tag => [
            tag,
            (() => {
                const renderTag = (...children: ReactNode[]) => createElement(tag, {}, ...children);
                return renderTag;
            })(),
        ]),
    );
