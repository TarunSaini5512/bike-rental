import React, { useState } from "react";
import { Input, Button, Form, message } from "antd";
import useAuthStore from "../store/authStore";
import { useNavigate } from "react-router-dom";

const VerifyOtp = () => {
    const authStore = useAuthStore();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const onFinish = async (values) => {
        setLoading(true);
        const result = await authStore.verifyOtp(values);

        if (result.success) {
            message.success("Account verified! Please sign in.");
            navigate("/signin");
        } else {
            message.error(result.message);
        }

        setLoading(false);
    };

    return (
        <Form onFinish={onFinish} layout="vertical">
            <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}>
                <Input />
            </Form.Item>
            <Form.Item name="otp" label="OTP" rules={[{ required: true }]}>
                <Input />
            </Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
                Verify OTP
            </Button>
        </Form>
    );
};

export default VerifyOtp;
