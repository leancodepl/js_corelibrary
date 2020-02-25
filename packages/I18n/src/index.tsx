import React, { ReactNode, useEffect, useRef, useState } from "react";
import { createIntl, createIntlCache, FormattedMessage, IntlShape, RawIntlProvider, useIntl } from "react-intl";

type FormattedMessageProps = import("react-intl/dist/components/message").Props;

const languageChangedEvent = "LanguageChanged";

export function getDefaultLanguage<TSupportedLanguage extends string>(
    supportedLanguages: TSupportedLanguage[],
    fallbackLanguage?: TSupportedLanguage,
): TSupportedLanguage;
export function getDefaultLanguage(): string;
export function getDefaultLanguage(supportedLanguages?: string[], fallbackLanguage?: string) {
    const navigatorLanguage = navigator.language.substr(0, 2).toLowerCase();

    if (supportedLanguages) {
        if (supportedLanguages.includes(navigatorLanguage)) {
            return navigatorLanguage;
        }

        if (fallbackLanguage) {
            return fallbackLanguage;
        }

        throw new Error(`Navigator language (${navigatorLanguage}) is not supported`);
    }

    return navigatorLanguage;
}

declare global {
    interface Window {
        currentLanguage?: string;
    }
}

export default function mkI18n<TSupportedLanguage extends string, TTerm extends string>(
    locales: {
        [TKey in TSupportedLanguage]: () => Promise<Record<TTerm, string>>;
    },
    defaultLanguage: TSupportedLanguage,
) {
    window.currentLanguage = defaultLanguage;

    const cache = createIntlCache();

    const messagesCache: Partial<{ [TKey in TSupportedLanguage]: Record<TTerm, string> }> = {};

    return {
        Localize: (props: FormattedMessageProps & { id: TTerm }) => <FormattedMessage {...props} />,
        useIntl: useIntl as () => IntlShape & { messages: TTerm[] },
        Provider({ children }: { children?: ReactNode }) {
            const [currentLanguage, setCurrentLanguage] = useState<TSupportedLanguage>(
                () => window.currentLanguage! as TSupportedLanguage,
            );

            const currentLanguageRef = useRef(currentLanguage);

            const [intl, setIntl] = useState(() =>
                createIntl(
                    {
                        locale: currentLanguage!,
                        messages: messagesCache[currentLanguage!],
                    },
                    cache,
                ),
            );

            useEffect(() => {
                const handler = () => {
                    setCurrentLanguage(window.currentLanguage as TSupportedLanguage);
                    currentLanguageRef.current = window.currentLanguage as TSupportedLanguage;
                };

                window.addEventListener(languageChangedEvent, handler);

                return () => window.removeEventListener(languageChangedEvent, handler);
            }, []);

            useEffect(() => {
                const cachedMessages = messagesCache[currentLanguage];

                if (cachedMessages) {
                    setIntl(
                        createIntl(
                            {
                                locale: currentLanguage!,
                                messages: cachedMessages,
                            },
                            cache,
                        ),
                    );
                }
                (async () => {
                    const messages = await locales[currentLanguage]();

                    messagesCache[currentLanguage] = messages;

                    if (currentLanguageRef.current === currentLanguage) {
                        setIntl(
                            createIntl(
                                {
                                    locale: currentLanguage!,
                                    messages,
                                },
                                cache,
                            ),
                        );
                    }
                })();
            }, [currentLanguage]);

            return <RawIntlProvider value={intl}>{children}</RawIntlProvider>;
        },
        changeLocale(language: TSupportedLanguage) {
            window.currentLanguage = language;
            window.dispatchEvent(new Event(languageChangedEvent));
        },
    };
}
