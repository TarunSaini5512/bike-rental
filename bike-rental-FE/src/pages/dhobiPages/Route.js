import { Route, Routes } from "react-router-dom";
import Dashboard from "./Dashboard";
import ProtectedRoute from "../ProtectedRoute";
import EditDetails from "./profile-management/EditDetails";
import MainLayout from "./MainLayout";

function DhobiRoutes() {
    return (
        <ProtectedRoute>
            <MainLayout>
                <Routes>
                    <Route path="*" element={<Dashboard />} />
                    <Route path="/profile-management/edit-details" element={<EditDetails />} />
                </Routes>
            </MainLayout>
        </ProtectedRoute>
    );
}

export default DhobiRoutes;
