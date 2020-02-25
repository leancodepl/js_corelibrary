import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import React, { useState } from "react";
import mkI18n from "../src";

function createLocale<TLocale extends string, TTerm extends string>(locale: TLocale, messages: Record<TTerm, string>) {
    return {
        [locale]: () => Promise.resolve(messages),
    } as Record<TLocale, () => Promise<Record<TTerm, string>>>;
}

const X = () => {
    useState("siema");

    return null;
};

describe("i18n", () => {
    it("should build signin request", () => {
        const { Provider } = mkI18n(
            {
                ...createLocale("pl", { test: "test" }),
            },
            "pl",
        );

        // const { getByTestId } = render(
        //     <Provider>
        //         <div data-test-id="test">halko</div>
        //     </Provider>,
        // );

        const { getByTestId } = render(() => <X />);

        console.warn(getByTestId("tst"));
    });
});
