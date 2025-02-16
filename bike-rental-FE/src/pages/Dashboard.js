import React from "react";
import { Layout, Menu, Button, Typography } from "antd";
import {
    DashboardOutlined,
    UserOutlined,
    FileTextOutlined,
    CreditCardOutlined,
    BellOutlined,
    CustomerServiceOutlined,
    LogoutOutlined,
} from "@ant-design/icons";
import useAuthStore from "../store/authStore";

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

const Dashboard = () => {
    const { logout } = useAuthStore();

    return (
        <Layout style={{ minHeight: "100vh" }}>
            {/* Sidebar */}
            <Sider width={250} style={{ background: "#fff" }}>
                <div style={{ padding: 20, textAlign: "center" }}>
                    <Title level={3}>Dashboard</Title>
                </div>
                <Menu mode="inline" defaultSelectedKeys={["dashboard"]}>
                    <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
                        Dashboard
                    </Menu.Item>
                    <Menu.SubMenu key="profile" icon={<UserOutlined />} title="Profile Management">
                        <Menu.Item key="edit-profile">Edit Details</Menu.Item>
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

            {/* Main Content */}
            <Layout>
                <Header style={{ background: "#fff", padding: "0 20px", display: "flex", justifyContent: "flex-end" }}>
                    <Button type="primary" icon={<LogoutOutlined />} onClick={logout}>
                        Logout
                    </Button>
                </Header>
                <Content style={{ margin: 20, background: "#fff", padding: 20, borderRadius: 8 }}>
                    <Title level={4}>Welcome to Your Dashboard</Title>
                    <p>Select a menu item to manage your account.</p>
                </Content>
            </Layout>
        </Layout>
    );
};

export default Dashboard;
