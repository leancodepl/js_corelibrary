import Container from "components/Container";
import SplitComponent from "components/SplitComponent";
import { I18nProvider, Localize } from "i18n";
import React from "react";

const App: React.FunctionComponent = () => {
    return (
        <I18nProvider>
            <Container>
                <Localize id="header.title" />
            </Container>
            <SplitComponent>
                <SplitComponent.A sampleProp="sample">A implementation</SplitComponent.A>
                <SplitComponent.B>B implementation</SplitComponent.B>
                <SplitComponent.C>C implementation</SplitComponent.C>
            </SplitComponent>
        </I18nProvider>
    );
};

export default App;
