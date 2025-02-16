import React, { useState } from "react";
import { Input, Button, Form, message, Card, Typography } from "antd";
import { LockOutlined, MailOutlined, PhoneOutlined } from "@ant-design/icons";
import useAuthStore from "../store/authStore";
import { Link, useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const AuthForm = ({ type }) => {
    const authStore = useAuthStore();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const onFinish = async (values) => {
        setLoading(true);
        const result = type === "signup" ? await authStore.signup(values) : await authStore.login(values);

        if (result.success) {
            message.success(type === "signup" ? "Signup successful! Verify OTP." : "Login successful!");
            navigate(type === "signup" ? "/verify-otp" : "/dashboard");
        } else {
            message.error(result.message);
        }

        setLoading(false);
    };

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#f5f5f5" }}>
            <Card style={{ width: 400, textAlign: "center" }}>
                <Title level={3}>{type === "signup" ? "Create an Account" : "Sign In"}</Title>
                <Text type="secondary">{type === "signup" ? "Join us today!" : "Access your dashboard"}</Text>
                <Form onFinish={onFinish} layout="vertical" style={{ marginTop: 20 }}>
                    <Form.Item name="email" rules={[{ required: true, type: "email", message: "Please enter a valid email!" }]}>
                        <Input prefix={<MailOutlined />} placeholder="Email" />
                    </Form.Item>
                    {type === "signup" && (
                        <Form.Item name="phone" rules={[{ required: true, message: "Please enter your phone number!" }]}>
                            <Input prefix={<PhoneOutlined />} placeholder="Phone" />
                        </Form.Item>
                    )}
                    <Form.Item name="password" rules={[{ required: true, message: "Please enter your password!" }]}>
                        <Input.Password prefix={<LockOutlined />} placeholder="Password" />
                    </Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} block>
                        {type === "signup" ? "Sign Up" : "Sign In"}
                    </Button>
                </Form>
                <Text>
                    {type === "signup" ? "Already have an account? " : "Don't have an account? "}
                    <Link to={type === "signup" ? "/signin" : "/signup"}>{type === "signup" ? "Sign In" : "Sign Up"}</Link>
                </Text>
            </Card>
        </div>
    );
};

export default AuthForm;
