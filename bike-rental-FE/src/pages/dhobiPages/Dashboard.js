import React from "react";
import { Layout, Typography } from "antd";

const { Content } = Layout;
const { Title } = Typography;

const Dashboard = () => {
    return (
        <Content style={{ margin: 20, background: "#fff", padding: 20, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div>
                <Title level={4}>Welcome to DHOBI Dashboard</Title>
                <p>Select a menu item to manage your account.</p>
            </div>
        </Content>
    );
};

export default Dashboard;
