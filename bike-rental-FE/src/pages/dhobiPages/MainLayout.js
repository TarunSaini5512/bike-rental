import React from "react";
import { Button, Layout, Menu, Typography } from "antd";
import {
    DashboardOutlined,
    UserOutlined,
    FileTextOutlined,
    CreditCardOutlined,
    BellOutlined,
    CustomerServiceOutlined,
    LogoutOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";

const { Sider, Header } = Layout;
const { Title } = Typography;

const MainLayout = ({ children }) => {
    const navigate = useNavigate();
    const { logout } = useAuthStore();

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Sider width={250} style={{ background: "#fff" }}>
                <div style={{ padding: 20, textAlign: "center" }}>
                    <Title level={3}>Dashboard</Title>
                </div>
                <Menu mode="inline" defaultSelectedKeys={["dashboard"]}>
                    <Menu.Item key="dashboard" onClick={() => navigate("/dashboard/dhobi")} icon={<DashboardOutlined />}>
                        Dashboard
                    </Menu.Item>
                    <Menu.SubMenu key="profile" icon={<UserOutlined />} title="Profile Management">
                        <Menu.Item key="edit-profile" onClick={() => navigate("/dashboard/dhobi/profile-management/edit-details")}>Edit Details</Menu.Item>
                        <Menu.Item key="upload-docs">Upload Documents</Menu.Item>
                        <Menu.Item key="service-locality">Service Locality</Menu.Item>
                    </Menu.SubMenu>
                    <Menu.SubMenu key="orders" icon={<FileTextOutlined />} title="Order Management">
                        <Menu.Item key="view-orders">View, Accept, Decline Orders</Menu.Item>
                        <Menu.Item key="update-status">Update Order Status</Menu.Item>
                    </Menu.SubMenu>
                    <Menu.Item key="payments" icon={<CreditCardOutlined />}>
                        Track Payments & Earnings
                    </Menu.Item>
                    <Menu.Item key="notifications" icon={<BellOutlined />}>
                        New Order Alert
                    </Menu.Item>
                    <Menu.Item key="support" icon={<CustomerServiceOutlined />}>
                        QA Support
                    </Menu.Item>
                </Menu>
            </Sider>
            <Layout>
                <Header style={{ background: "#fff", padding: "10px 20px", display: "flex", justifyContent: "flex-end" }}>
                    <Button type="primary" icon={<LogoutOutlined />} onClick={logout}>
                        Logout
                    </Button>
                </Header>
                {children}
            </Layout>
        </Layout>
    );
};

export default MainLayout;
