import axios from "axios";
import axiosInstance from './axiosInstance';

const API = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
});

// Đăng ký tài khoản
export const register = async (data) => {
    return await API.post("/auth/register", data);
};

// Đăng nhập
export const login = async (data) => {
    return await API.post("/auth/login", data);
};

// Làm mới access token
export const refreshToken = async (refreshToken) => {
    return await API.post("/auth/refresh-token", { refreshToken });
};

// Đăng xuất
export const logout = async (accessToken) => {
    return await axiosInstance.post(
        "/auth/logout",
        {},
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );
};

// Lấy user hiện tại
export const currentUser = async (accessToken) => {
    return await axiosInstance.get("/auth/current-user", {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
};

export const currentAdmin = async (accessToken) => {
    return await axiosInstance.get("/auth/current-admin", {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
};

export const currentAdminOrStaff = async (accessToken) => {
    return await axiosInstance.get("/auth/current-admin-or-staff", {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
};