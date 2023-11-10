import { Route, Routes } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { loginRoute, settingsRoute, signInRoute, signUpRoute, verificationRoute } from "./routes";
import { PageLayout } from "../components/common/PageLayout";
import { HomePage } from "../pages/home";
import { RefreshSessionPage } from "../pages/login";
import { SettingsPage } from "../pages/settings";
import { SignInPage } from "../pages/signin";
import { SignUpPage } from "../pages/signup";
import { VerificationPage } from "../pages/verification";

export function App() {
    return (
        <div>
            <Routes>
                <Route element={<PageLayout />}>
                    <Route element={<HomePage />} path="/" />
                    <Route element={<SignInPage />} path={signInRoute} />
                    <Route element={<SignUpPage />} path={signUpRoute} />
                    <Route element={<SettingsPage />} path={settingsRoute} />
                    <Route element={<VerificationPage />} path={verificationRoute} />
                    <Route element={<RefreshSessionPage />} path={loginRoute} />
                </Route>
            </Routes>
        </div>
    );
}

export default App;
