import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AuthForm from "./components/AuthForm";
import VerifyOtp from "./pages/VerifyOtp";
import useAuthStore from "./store/authStore";
import { jwtDecode } from "jwt-decode";
import AdminRoutes from "./pages/adminPages/Route";
import DhobiRoutes from "./pages/dhobiPages/Route";
import NotFound from "./pages/NotFound";

function App() {
    const { token } = useAuthStore();

    const getUserRole = (token) => {
        if (!token) return null;
        try {
            const decodedToken = jwtDecode(token);
            return decodedToken?.role;
        } catch (error) {
            console.error("Invalid token", error);
            return null;
        }
    };

    const userRole = getUserRole(token);

    if (userRole === 'ADMIN') {
        return (
            <Router>
                <Routes>
                    <Route path="/" element={token ? <Navigate to={'/dashboard/admin'} /> : <Navigate to="/signin" />} />
                    <Route path="/signup" element={<AuthForm type="signup" />} />
                    <Route path="/signin" element={<AuthForm type="signin" />} />
                    <Route path="/verify-otp" element={<VerifyOtp />} />
                    <Route path="/dashboard/admin/*" element={<AdminRoutes />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Router>
        );
    }

    return (
        <Router>
            <Routes>
                <Route path="/" element={token ? <Navigate to={`/dashboard/dhobi`} /> : <Navigate to="/signin" />} />
                <Route path="/signup" element={<AuthForm type="signup" />} />
                <Route path="/signin" element={<AuthForm type="signin" />} />
                <Route path="/verify-otp" element={<VerifyOtp />} />
                <Route path="/dashboard/dhobi/*" element={<DhobiRoutes />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
}

export default App;
