import Container from "components/Container";
import SplitComponent from "components/SplitComponent";
import { I18nProvider, Localize } from "i18n";
import React from "react";
import { BrowserRouter, Link, Route, Switch } from "react-router-dom";
import routes from "routes";

const App: React.FunctionComponent = () => (
    <BrowserRouter>
        <Switch>
            <Route exact path={routes.home.pattern}>
                <Link to={routes.splitComponent({}, {})}>SplitComponent</Link>
                <Link to={routes.test()}>Test Link</Link>
            </Route>
            <Route exact path={routes.splitComponent.pattern}>
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
        </Switch>
    </BrowserRouter>
);

export default App;
