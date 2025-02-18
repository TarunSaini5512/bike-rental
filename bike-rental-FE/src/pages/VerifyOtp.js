import React, { useEffect, useState } from "react";
import useAuthStore from "../store/authStore";
import { useNavigate } from "react-router-dom";
import { Card, Input, Button, Typography, message } from "antd";
import { LockOutlined, PhoneOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const VerifyOtp = () => {
    const authStore = useAuthStore();
    const navigate = useNavigate();
    const [phone, setPhone] = useState("");
    const [loading, setLoading] = useState(false);
    const [otp, setOtp] = useState("");
    const [countdown, setCountdown] = useState(30);
    const [isResendDisabled, setIsResendDisabled] = useState(true);

    useEffect(() => {
        let timer;
        if (isResendDisabled && countdown > 0) {
            timer = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);
        } else {
            setIsResendDisabled(false);
        }
        return () => clearInterval(timer);
    }, [countdown, isResendDisabled]);

    const handlePhoneChange = (e) => {
        const value = e.target.value.replace(/\D/g, "");
        if (value.length <= 10) setPhone(value);
    };

    const handleChange = (e) => {
        const value = e.target.value.replace(/\D/g, "");
        if (value.length <= 6) setOtp(value);
    };

    const handleVerify = async () => {
        if (otp.length !== 6 && !phone) {
            message.error("OTP must be 6 digits!");
            return;
        }
        setLoading(true);
        try {
            const result = await authStore.verifyOtp({ otp, phone });
            message.success("OTP Verified Successfully!");
            navigate("/dashboard");
        } catch (error) {
            message.error(error.response?.data?.message || "Invalid OTP!");
        }
        setLoading(false);
    };

    const handleResend = async () => {
        setIsResendDisabled(true);
        setCountdown(30);
        try {
            const result = await authStore.resendOtp({ otp });
            message.success("OTP Resent Successfully!");
        } catch (error) {
            message.error("Error Resending OTP!");
        }
    };

    return (
        <div style={styles.container}>
            <Card style={styles.card}>
                <Title level={3} style={{ textAlign: "center" }}>
                    Verify OTP
                </Title>
                <Text style={{ textAlign: "center", display: "block", marginBottom: 10 }}>
                    Enter the 6-digit OTP sent to your registered email/phone.
                </Text>
                <Input
                    prefix={<PhoneOutlined />}
                    placeholder="Enter Phone Number"
                    maxLength={10}
                    value={phone}
                    onChange={handlePhoneChange}
                    style={styles.input}
                />
                <Input
                    prefix={<LockOutlined />}
                    placeholder="Enter OTP"
                    maxLength={6}
                    value={otp}
                    onChange={handleChange}
                    onPressEnter={handleVerify}
                    style={styles.input}
                />
                <Button type="primary" block loading={loading} onClick={handleVerify} style={styles.button}>
                    Verify OTP
                </Button>
                <Button
                    type="link"
                    disabled={isResendDisabled}
                    onClick={handleResend}
                    style={styles.resendButton}
                >
                    Resend OTP {isResendDisabled && `(${countdown}s)`}
                </Button>
            </Card>
        </div>
    );
};

const styles = {
    container: {
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f0f2f5",
    },
    card: {
        width: 380,
        padding: 24,
        textAlign: "center",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        borderRadius: 8,
    },
    title: {
        textAlign: "center",
        marginBottom: 10,
    },
    subtitle: {
        textAlign: "center",
        display: "block",
        marginBottom: 20,
        color: "#666",
    },
    input: {
        marginBottom: 15,
        height: 45,
        fontSize: 16,
        textAlign: "center",
        letterSpacing: 3,
    },
    button: {
        marginBottom: 10,
        height: 45,
        fontSize: 16,
        fontWeight: "bold",
    },
    resendButton: {
        width: "100%",
        textAlign: "center",
        color: "#1890ff",
    },
};

export default VerifyOtp;
