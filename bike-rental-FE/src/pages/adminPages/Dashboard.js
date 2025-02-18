import { Card, Col, Row, Statistic, Table, Button, Layout } from "antd";
import { DollarOutlined, ShoppingCartOutlined, UserOutlined, BellOutlined } from "@ant-design/icons";

const Dashboard = () => {
    const { Content } = Layout;

    const recentOrders = [
        { key: "1", orderId: "#1234", customer: "John Doe", amount: "$50", status: "Completed" },
        { key: "2", orderId: "#1235", customer: "Jane Smith", amount: "$75", status: "Pending" },
        { key: "3", orderId: "#1236", customer: "Alice Brown", amount: "$30", status: "Cancelled" },
    ];

    const columns = [
        { title: "Order ID", dataIndex: "orderId", key: "orderId" },
        { title: "Customer", dataIndex: "customer", key: "customer" },
        { title: "Amount", dataIndex: "amount", key: "amount" },
        { title: "Status", dataIndex: "status", key: "status" },
    ];

    return (
        <Content style={{ margin: 20, background: "#fff", padding: 20, borderRadius: 8 }}>
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Total Earnings"
                            value={10245}
                            prefix="$"
                            suffix="USD"
                            valueStyle={{ color: "#3f8600" }}
                            icon={<DollarOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Total Orders"
                            value={256}
                            valueStyle={{ color: "#1890ff" }}
                            prefix={<ShoppingCartOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Total Dhobis"
                            value={189}
                            valueStyle={{ color: "#ff4d4f" }}
                            prefix={<UserOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Notifications"
                            value={12}
                            valueStyle={{ color: "#faad14" }}
                            prefix={<BellOutlined />}
                        />
                    </Card>
                </Col>
            </Row>
            <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
                <Col span={24}>
                    <Card title="Recent Orders" extra={<Button type="primary">View All</Button>}>
                        <Table dataSource={recentOrders} columns={columns} pagination={false} />
                    </Card>
                </Col>
            </Row>
        </Content>
    );
};

export default Dashboard;
