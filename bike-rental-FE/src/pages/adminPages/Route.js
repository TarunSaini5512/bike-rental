import { Route, Routes } from "react-router-dom";
import Dashboard from "./Dashboard";
import ProtectedRoute from "../ProtectedRoute";
import MainLayout from "./MainLayout";

function AdminRoutes() {
    return (
        <ProtectedRoute>
            <MainLayout>
                <Routes>
                    <Route path="*" element={<Dashboard />} />
                </Routes>
            </MainLayout>
        </ProtectedRoute>
    );
}

export default AdminRoutes;
