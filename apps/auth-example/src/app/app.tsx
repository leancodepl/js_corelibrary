import { Route, Routes } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { loginRoute, settingsRoute, signUpRoute, verificationRoute } from "./routes";
import { PageLayout } from "../components/common/PageLayout";
import { HomePage } from "../pages/home";
import { LoginPage } from "../pages/login";
import { SettingsPage } from "../pages/settings";
import { SignUpPage } from "../pages/signup";
import { VerificationPage } from "../pages/verification";

export function App() {
    return (
        <div>
            <Routes>
                <Route element={<PageLayout />}>
                    <Route element={<HomePage />} path="/" />
                    <Route element={<LoginPage />} path={loginRoute} />
                    <Route element={<SignUpPage />} path={signUpRoute} />
                    <Route element={<SettingsPage />} path={settingsRoute} />
                    <Route element={<VerificationPage />} path={verificationRoute} />
                </Route>
            </Routes>
        </div>
    );
}

export default App;
