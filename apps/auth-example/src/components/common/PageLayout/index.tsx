import { Tabs, TabList, Tab, TabPanels, TabPanel } from "@chakra-ui/react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { mfaSettingsRoute, settingsRoute, signInRoute, signUpRoute } from "../../../app/routes";

const pathnameToIndex: Record<string, number> = {
    "/": 0,
    [signInRoute]: 1,
    [signUpRoute]: 2,
    [settingsRoute]: 3,
    [mfaSettingsRoute]: 4,
};

const tabs = [
    { label: "Session info", href: "/" },
    { label: "Sign In", href: signInRoute },
    { label: "Sign Up", href: signUpRoute },
    { label: "Settings", href: settingsRoute },
    { label: "MFA", href: mfaSettingsRoute },
];

export default function PageLayout() {
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
