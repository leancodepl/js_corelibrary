import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { loginRoute, settingsRoute, signUpRoute } from "../../../app/routes";

export function PageLayout() {
    const location = useLocation();

    return (
        <Tabs isLazy index={pathnameToIndex[location.pathname] ?? 0}>
            <TabList>
                {tabs.map(({ label, href }) => (
                    <Tab key={href} as={Link} to={href}>
                        {label}
                    </Tab>
                ))}
            </TabList>
            <TabPanels>
                {tabs.map(({ href }) => (
                    <TabPanel key={href}>
                        <Outlet />
                    </TabPanel>
                ))}
            </TabPanels>
        </Tabs>
    );
}

const pathnameToIndex: Record<string, number> = {
    "/": 0,
    [loginRoute]: 1,
    [signUpRoute]: 2,
    [settingsRoute]: 3,
};

const tabs = [
    { label: "Session info", href: "/" },
    { label: "Sign In", href: loginRoute },
    { label: "Sign Up", href: signUpRoute },
    { label: "Settings", href: settingsRoute },
];
