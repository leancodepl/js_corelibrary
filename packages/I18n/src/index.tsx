import React, { ReactNode, useEffect, useRef, useState } from "react";
import { FormatXMLElementFn, PrimitiveType } from "intl-messageformat";
import { createIntl, createIntlCache, FormattedMessage, IntlShape, RawIntlProvider, useIntl } from "react-intl";

const localeChangedEvent = "LocaleChanged";

export function getDefaultLocale<TSupportedLocale extends string, TFallbackLocale extends TSupportedLocale>(
    supportedLocales: TSupportedLocale[],
    fallbackLocale?: TFallbackLocale,
): TSupportedLocale;
export function getDefaultLocale(): string;
export function getDefaultLocale(supportedLocales?: string[], fallbackLocale?: string) {
    const navigatorLocale = navigator.language.split("-")[0].toLowerCase();

    if (supportedLocales) {
        if (supportedLocales.includes(navigatorLocale)) {
            return navigatorLocale;
        }

        if (fallbackLocale) {
            return fallbackLocale;
        }

        throw new Error(`Navigator locale (${navigatorLocale}) is not supported`);
    }

    return navigatorLocale;
}

declare global {
    interface Window {
        currentLocale?: string;
    }
}

export default function mkI18n<
    TSupportedLocale extends string,
    TTerm extends string,
    TDefaultLocale extends TSupportedLocale = TSupportedLocale,
>(locales: Record<TSupportedLocale, () => Promise<Record<TTerm, string>>>, defaultLocale: TDefaultLocale) {
    type StronglyTypedMessageDescriptor = {
        id?: TTerm | number;
        description?: string;
        defaultMessage?: string;
    };

    type StronglyTypedIntlShape = Omit<IntlShape, "formatMessage" | "formatHTMLMessage" | "messages"> & {
        messages: Record<TTerm, string>;
        formatMessage(descriptor: StronglyTypedMessageDescriptor, values?: Record<string, PrimitiveType>): string;
        formatMessage(
            descriptor: StronglyTypedMessageDescriptor,
            values?: Record<
                string,
                PrimitiveType | React.ReactElement | FormatXMLElementFn<React.ReactNode, ReactNode>
            >,
        ): string | React.ReactNodeArray;
        formatHTMLMessage(
            descriptor: StronglyTypedMessageDescriptor,
            values?: Record<string, PrimitiveType>,
        ): React.ReactNode;
    };

    type StronglyTypedFormattedMessageProps<V extends Record<string, any> = Record<string, React.ReactNode>> = {
        values?: V;
        tagName?: React.ElementType<any>;
        children?(...nodes: React.ReactNodeArray): React.ReactNode;
    } & StronglyTypedMessageDescriptor;

    window.currentLocale = defaultLocale;

    const cache = createIntlCache();

    const messagesCache: Partial<{ [TKey in TSupportedLocale]: Record<TTerm, string> }> = {};

    const intlInstance: { current?: StronglyTypedIntlShape } = {};

    return {
        Localize: FormattedMessage as unknown as React.ComponentClass<StronglyTypedFormattedMessageProps>,
        useIntl: useIntl as () => StronglyTypedIntlShape,
        intl: intlInstance,
        Provider({ children }: { children?: ReactNode }) {
            const [currentLocale, setCurrentLocale] = useState<TSupportedLocale>(
                () => window.currentLocale! as TSupportedLocale, // eslint-disable-line @typescript-eslint/no-non-null-assertion
            );

            const currentLocaleRef = useRef(currentLocale);

            const [intl, setIntl] = useState<StronglyTypedIntlShape>();

            useEffect(() => {
                const handler = () => {
                    setCurrentLocale(window.currentLocale as TSupportedLocale);
                    currentLocaleRef.current = window.currentLocale as TSupportedLocale;
                };

                window.addEventListener(localeChangedEvent, handler);

                return () => window.removeEventListener(localeChangedEvent, handler);
            }, []);

            useEffect(() => {
                const cachedMessages = messagesCache[currentLocale];

                if (cachedMessages) {
                    intlInstance.current = createIntl(
                        {
                            locale: currentLocale,
                            defaultLocale: defaultLocale,
                            messages: cachedMessages,
                        },
                        cache,
                    ) as StronglyTypedIntlShape;
                    setIntl(intlInstance.current);
                    return;
                }

                (async () => {
                    const messages = await locales[currentLocale]();

                    messagesCache[currentLocale] = messages;

                    if (currentLocaleRef.current === currentLocale) {
                        intlInstance.current = createIntl(
                            {
                                locale: currentLocale,
                                defaultLocale: defaultLocale,
                                messages: messages,
                            },
                            cache,
                        ) as StronglyTypedIntlShape;
                        setIntl(intlInstance.current);
                    }
                })();
            }, [currentLocale]);

            if (!intl) {
                return null;
            }

            return <RawIntlProvider value={intl}>{children}</RawIntlProvider>;
        },
        changeLocale(locale: TSupportedLocale) {
            window.currentLocale = locale;
            window.dispatchEvent(new Event(localeChangedEvent));
        },
    };
}
