import { StrictMode } from "react";
import { IntlProvider } from "react-intl";
import { BrowserRouter } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import * as ReactDOM from "react-dom/client";
import { KratosComponents, KratosContextProvider } from "@leancodepl/kratos";
import App from "./app/app";
import { NodeButton } from "./auth/ui/node/nodeButton";
import { NodeCheckbox } from "./auth/ui/node/nodeCheckbox";
import { NodeInput } from "./auth/ui/node/nodeInput";
import { useHandleFlowError } from "./auth/useHandleFlowError";

const components: Partial<KratosComponents> = {
    Input: NodeInput,
    Button: NodeButton,
    Checkbox: NodeCheckbox,
};

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
    <StrictMode>
        <BrowserRouter>
            <IntlProvider locale="en">
                <KratosContextProvider components={components} useHandleFlowError={useHandleFlowError}>
                    <ChakraProvider>
                        <App />
                    </ChakraProvider>
                </KratosContextProvider>
            </IntlProvider>
        </BrowserRouter>
    </StrictMode>,
);
