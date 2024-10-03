import { ComponentClass, ElementType, ReactNode, useEffect, useRef, useState } from "react"
import {
    createIntl,
    createIntlCache,
    FormattedMessage,
    IntlShape,
    MessageFormatElement,
    RawIntlProvider,
    useIntl,
} from "react-intl"
import type { FormatXMLElementFn, Options as IntlMessageFormatOptions, PrimitiveType } from "intl-messageformat"

const localeChangedEvent = "LocaleChanged"

declare global {
    interface Window {
        currentLocale?: string
    }
}

export function mkI18n<
    TSupportedLocale extends string,
    TTerm extends string,
    TDefaultLocale extends TSupportedLocale = TSupportedLocale,
>(locales: Record<TSupportedLocale, () => Promise<Record<TTerm, string>>>, defaultLocale: TDefaultLocale) {
    type StronglyTypedMessageDescriptor = {
        id?: TTerm
        description?: string
        defaultMessage?: string
    }

    type StronglyTypedIntlShape = {
        messages: Record<TTerm, MessageFormatElement[]> | Record<TTerm, string>
        formatMessage(
            descriptor: StronglyTypedMessageDescriptor,
            values?: Record<string, FormatXMLElementFn<string, string> | PrimitiveType>,
            opts?: IntlMessageFormatOptions,
        ): string
        formatMessage(
            descriptor: StronglyTypedMessageDescriptor,
            values?: Record<string, FormatXMLElementFn<ReactNode, ReactNode> | PrimitiveType | ReactNode>,
            opts?: IntlMessageFormatOptions,
        ): ReactNode
        $t(
            descriptor: StronglyTypedMessageDescriptor,
            values?: Record<string, FormatXMLElementFn<string, string> | PrimitiveType>,
            opts?: IntlMessageFormatOptions,
        ): string
        $t(
            descriptor: StronglyTypedMessageDescriptor,
            values?: Record<string, FormatXMLElementFn<ReactNode, ReactNode> | PrimitiveType | ReactNode>,
            opts?: IntlMessageFormatOptions,
        ): ReactNode
    } & Omit<IntlShape, "formatHTMLMessage" | "formatMessage" | "messages">

    type StronglyTypedFormattedMessageProps<
        V extends Record<string, any> = Record<
            string,
            FormatXMLElementFn<React.ReactNode, React.ReactNode> | ReactNode
        >,
    > = {
        values?: V
        tagName?: ElementType<any>
        children?(...nodes: ReactNode[]): ReactNode
    } & StronglyTypedMessageDescriptor

    window.currentLocale = defaultLocale

    const cache = createIntlCache()

    const messagesCache: Partial<{ [TKey in TSupportedLocale]: Record<TTerm, string> }> = {}

    const intlInstance: { current?: StronglyTypedIntlShape } = {}

    return {
        Localize: FormattedMessage as unknown as ComponentClass<StronglyTypedFormattedMessageProps>,
        useIntl: useIntl as () => StronglyTypedIntlShape,
        intl: intlInstance,
        Provider({ children }: { children?: ReactNode }) {
            const [currentLocale, setCurrentLocale] = useState<TSupportedLocale>(
                () => window.currentLocale! as TSupportedLocale, // eslint-disable-line @typescript-eslint/no-non-null-assertion
            )

            const currentLocaleRef = useRef(currentLocale)

            const [intl, setIntl] = useState<StronglyTypedIntlShape>()

            useEffect(() => {
                const handler = () => {
                    setCurrentLocale(window.currentLocale as TSupportedLocale)
                    currentLocaleRef.current = window.currentLocale as TSupportedLocale
                }

                window.addEventListener(localeChangedEvent, handler)

                return () => window.removeEventListener(localeChangedEvent, handler)
            }, [])

            useEffect(() => {
                const cachedMessages = messagesCache[currentLocale]

                if (cachedMessages) {
                    intlInstance.current = createIntl(
                        {
                            locale: currentLocale,
                            defaultLocale: defaultLocale,
                            messages: cachedMessages,
                        },
                        cache,
                    ) as StronglyTypedIntlShape
                    setIntl(intlInstance.current)
                    return
                }

                ;(async () => {
                    const messages = await locales[currentLocale]()

                    messagesCache[currentLocale] = messages

                    if (currentLocaleRef.current === currentLocale) {
                        intlInstance.current = createIntl(
                            {
                                locale: currentLocale,
                                defaultLocale: defaultLocale,
                                messages: messages,
                            },
                            cache,
                        ) as StronglyTypedIntlShape
                        setIntl(intlInstance.current)
                    }
                })()
            }, [currentLocale])

            if (!intl) {
                return null
            }

            return <RawIntlProvider value={intl}>{children}</RawIntlProvider>
        },
        changeLocale(locale: TSupportedLocale) {
            window.currentLocale = locale
            window.dispatchEvent(new Event(localeChangedEvent))
        },
    }
}
