import { Route, Routes } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { signInRoute, signUpRoute, verificationRoute } from "./routes";
import PageLayout from "../components/common/PageLayout";
import HomePage from "../pages/home";
import SignInPage from "../pages/signin";
import SignUpPage from "../pages/signup";
import VerificationPage from "../pages/verification";

export function App() {
    return (
        <div>
            <Routes>
                <Route element={<PageLayout />}>
                    <Route element={<HomePage />} path="/" />
                    <Route element={<SignInPage />} path={signInRoute} />
                    <Route element={<SignUpPage />} path={signUpRoute} />
                    <Route element={<VerificationPage />} path={verificationRoute} />
                </Route>
            </Routes>
        </div>
    );
}

export default App;
