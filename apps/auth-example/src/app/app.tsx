import { Route, Routes } from "react-router-dom"
import { PageLayout } from "../components/common/PageLayout"
import { HomePage } from "../pages/home"
import { LoginPage } from "../pages/login"
import { RegisterPage } from "../pages/register"
import { SettingsPage } from "../pages/settings"
import { VerificationPage } from "../pages/verification"
import { loginRoute, registerRoute, settingsRoute, verificationRoute } from "./routes"
import "react-toastify/dist/ReactToastify.css"

export function App() {
    return (
        <div>
            <Routes>
                <Route element={<PageLayout />}>
                    <Route element={<HomePage />} path="/" />
                    <Route element={<LoginPage />} path={loginRoute} />
                    <Route element={<RegisterPage />} path={registerRoute} />
                    <Route element={<SettingsPage />} path={settingsRoute} />
                    <Route element={<VerificationPage />} path={verificationRoute} />
                </Route>
            </Routes>
        </div>
    )
}

export default App
