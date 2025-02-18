import { create } from "zustand";
import axios from "axios";

const useAuthStore = create((set) => ({
    token: localStorage.getItem("token") || null,
    user: null,

    login: async (values) => {
        try {
            const { data } = await axios.post("http://localhost:3000/auth/login", values);
            localStorage.setItem("token", data.token);
            set({ token: data.token });
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.error || "Login failed" };
        }
    },

    signup: async (values) => {
        try {
            await axios.post("http://localhost:3000/auth/signup", { ...values, name: "Test", role: "DHOBI" });
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.error || "Signup failed" };
        }
    },

    verifyOtp: async (values) => {
        try {
            await axios.post("http://localhost:3000/auth/verify-otp", values);
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.error || "OTP verification failed" };
        }
    },

    resendOtp: async (values) => {
        try {
            await axios.post("http://localhost:3000/auth/resend-otp", values);
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.error || "OTP resending failed" };
        }
    },

    logout: () => {
        localStorage.removeItem("token");
        set({ token: null, user: null });
    },
}));

export default useAuthStore;
