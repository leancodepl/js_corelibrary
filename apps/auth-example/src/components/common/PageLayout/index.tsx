import { Link, Outlet, useLocation } from "react-router-dom"
import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react"
import { loginRoute, registerRoute, settingsRoute } from "../../../app/routes"

export function PageLayout() {
    const location = useLocation()

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
    )
}

const pathnameToIndex: Record<string, number> = {
    "/": 0,
    [loginRoute]: 1,
    [registerRoute]: 2,
    [settingsRoute]: 3,
}

const tabs = [
    { label: "Session info", href: "/" },
    { label: "Sign In", href: loginRoute },
    { label: "Sign Up", href: registerRoute },
    { label: "Settings", href: settingsRoute },
]
