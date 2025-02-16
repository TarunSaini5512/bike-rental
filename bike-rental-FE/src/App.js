import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AuthForm from "./components/AuthForm";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./pages/ProtectedRoute";
import VerifyOtp from "./pages/VerifyOtp";
import useAuthStore from "./store/authStore";

function App() {
    const { token } = useAuthStore();

    return (
        <Router>
            <Routes>
                <Route path="/" element={token ? <Navigate to="/dashboard" /> : <Navigate to="/signin" />} />
                <Route path="/signup" element={<AuthForm type="signup" />} />
                <Route path="/signin" element={<AuthForm type="signin" />} />
                <Route path="/verify-otp" element={<VerifyOtp />} />
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            </Routes>
        </Router>
    );
}

export default App;
