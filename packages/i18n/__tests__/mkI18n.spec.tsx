/**
 * @jest-environment jsdom
 */
import { ReactElement } from "react"
import { act, render, renderHook, waitFor } from "@testing-library/react"
import { mkI18n } from "../src"

function createLocale<TLocale extends string, TTerm extends string>(
    locale: TLocale,
    messages: Record<TTerm, string>,
): Record<TLocale, () => Promise<Record<TTerm, string>>> {
    return {
        [locale]: () => Promise.resolve(messages),
    } as any
}

describe("i18n", () => {
    it("renders localized message", async () => {
        const { Provider, Localize } = mkI18n(
            {
                ...createLocale("en", { "test.key": "I18n is awesome" }),
            },
            "en",
        )

        const { findByTestId } = render(
            <Provider>
                <div data-testid="test">
                    <Localize id="test.key" />
                </div>
            </Provider>,
        )

        const message = await findByTestId("test")

        expect(message.textContent).toBe("I18n is awesome")
    })

    it("renders localized message after language switch", async () => {
        const { Provider, Localize, changeLocale } = mkI18n(
            {
                ...createLocale("en", { "test.key": "I18n is awesome" }),
                ...createLocale("pl", { "test.key": "I18n jest super" }),
            },
            "en",
        )

        const { findByText } = render(
            <Provider>
                <Localize id="test.key" />
            </Provider>,
        )

        await findByText("I18n is awesome")

        act(() => changeLocale("pl"))

        await findByText("I18n jest super")
    })

    it("formats localized message using hooks", async () => {
        const { Provider, useIntl } = mkI18n(
            {
                ...createLocale("en", { "test.key": "I18n is awesome" }),
            },
            "en",
        )
        const wrapper = ({ children }: { children: ReactElement }) => <Provider>{children}</Provider>

        const { result } = renderHook(() => useIntl(), { wrapper })

        await waitFor(() => {
            if (!result.current) throw new Error()
        })

        const message = result.current.formatMessage({ id: "test.key" })

        expect(message).toBe("I18n is awesome")
    })

    it("provides localized message globally", async () => {
        const { intl, Provider } = mkI18n(
            {
                ...createLocale("en", { "test.key": "I18n is awesome" }),
            },
            "en",
        )

        render(<Provider />) // Provider needs to be mounted in order to manage localization

        await waitFor(() => {
            if (!intl.current) throw new Error()
        })

        const message = intl.current!.formatMessage({ id: "test.key" }) // eslint-disable-line @typescript-eslint/no-non-null-assertion

        expect(message).toBe("I18n is awesome")
    })
})
