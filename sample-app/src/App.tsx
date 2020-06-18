import A11yTest from "components/A11yTest";
import Container from "components/Container";
import { I18nProvider, Localize } from "i18n";
import React from "react";

const App: React.FunctionComponent = () => {
    return (
        <I18nProvider>
            <Container>
                <Localize id="header.title" />
                <A11yTest />
            </Container>
        </I18nProvider>
    );
};

export default App;
