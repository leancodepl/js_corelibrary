import React from "react";
import Container from "components/Container";
import SplitComponent from "components/SplitComponent";
import { I18nProvider, Localize } from "i18n";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import routes from "routes";

const App: React.FunctionComponent = () => (
    <BrowserRouter>
        <Routes>
            <Route path={routes.home.pattern}>
                <Link to={routes.splitComponent({}, {})}>SplitComponent</Link>
                <Link to={routes.test()}>Test Link</Link>
            </Route>
            <Route path={routes.splitComponent.pattern}>
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
            </Route>
        </Routes>
    </BrowserRouter>
);

export default App;
