import React, { useState } from "react";
import { Input, Button, Form, message, Card, Typography, Divider } from "antd";
import { LockOutlined, MailOutlined, PhoneOutlined } from "@ant-design/icons";
import useAuthStore from "../store/authStore";
import { Link, useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const AuthForm = ({ type }) => {
    const authStore = useAuthStore();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    // Custom validation for signin (require at least one: email or phone)
    const validateEmailOrPhone = (_, value) => {
        if (type === "signin") {
            const email = form.getFieldValue("email");
            const phone = form.getFieldValue("phone");

            if (!email && !phone) {
                return Promise.reject("Either Email or Phone is required!");
            }
        }
        return Promise.resolve();
    };

    const onFinish = async (values) => {
        setLoading(true);

        const result =
            type === "signup"
                ? await authStore.signup(values)
                : await authStore.login({ password: values?.password, identifier: values?.phone || values?.email });

        if (result.success) {
            message.success(
                type === "signup" ? "Signup successful! Verify OTP." : "Login successful!"
            );
            navigate(type === "signup" ? "/verify-otp" : "/dashboard");
        } else {
            message.error(result.message);
        }

        setLoading(false);
    };

    return (
        <div style={styles.container}>
            <Card style={styles.card}>
                <Title level={3}>{type === "signup" ? "Create an Account" : "Sign In"}</Title>
                <Text type="secondary">
                    {type === "signup" ? "Join us today!" : "Access your dashboard"}
                </Text>

                <Form form={form} onFinish={onFinish} layout="vertical" style={{ marginTop: 20 }}>
                    {/* Email Field */}
                    <Form.Item
                        name="email"
                        rules={[
                            { type: "email", message: "Please enter a valid email!" },
                            ...(type === "signup"
                                ? [{ required: true, message: "Email is required for signup!" }]
                                : [{ validator: validateEmailOrPhone }]),
                        ]}
                    >
                        <Input prefix={<MailOutlined />} placeholder="Email" />
                    </Form.Item>

                    {type !== "signup" && (<Divider variant="dotted" style={{ borderColor: '#7cb305' }}>
                        OR
                    </Divider>)}

                    {/* Phone Number Field */}
                    <Form.Item
                        name="phone"
                        rules={[
                            { pattern: /^[0-9]{10}$/, message: "Enter a valid 10-digit phone number!" },
                            ...(type === "signup"
                                ? [{ required: true, message: "Phone number is required for signup!" }]
                                : [{ validator: validateEmailOrPhone }]),
                        ]}
                    >
                        <Input prefix={<PhoneOutlined />} placeholder="Phone" maxLength={10} />
                    </Form.Item>

                    {/* Password Field */}
                    <Form.Item name="password" rules={[{ required: true, message: "Please enter your password!" }]}>
                        <Input.Password prefix={<LockOutlined />} placeholder="Password" />
                    </Form.Item>

                    {/* Submit Button */}
                    <Button type="primary" htmlType="submit" loading={loading} block>
                        {type === "signup" ? "Sign Up" : "Sign In"}
                    </Button>
                </Form>

                {/* Signup/Signin Toggle */}
                <Text>
                    {type === "signup" ? "Already have an account? " : "Don't have an account? "}
                    <Link to={type === "signup" ? "/signin" : "/signup"}>
                        {type === "signup" ? "Sign In" : "Sign Up"}
                    </Link>
                </Text>
            </Card>
        </div>
    );
};

// Styles
const styles = {
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "#f5f5f5",
    },
    card: {
        width: 400,
        textAlign: "center",
        padding: 24,
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        borderRadius: 8,
    },
};

export default AuthForm;
