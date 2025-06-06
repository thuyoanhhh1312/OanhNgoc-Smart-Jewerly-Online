import axios from "axios";
import axiosInstance from './axiosInstance';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const getPromotions = async () => {
    try {
        const response = await axios.get(`${API_URL}/promotions`);
        return response.data;
    } catch (error) {
        console.error("Error fetching promotions:", error);
        throw error;
    }
};

const createPromotion = async (data, accessToken) => {
    try {
        const response = await axiosInstance.post(`${API_URL}/promotions`, data, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error creating promotion:", error);
        throw error;
    }
};

const getPromotionById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/promotions/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching promotion by ID:", error);
        throw error;
    }
};

const updatePromotion = async (id, data, accessToken) => {
    try {
        const response = await axiosInstance.put(`${API_URL}/promotions/${id}`, data, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error updating promotion:", error);
        throw error;
    }
};

const deletePromotion = async (id, accessToken) => {
    try {
        const response = await axiosInstance.delete(`${API_URL}/promotions/${id}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error deleting promotion:", error);
        throw error;
    }
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    getPromotions,
    createPromotion,
    getPromotionById,
    updatePromotion,
    deletePromotion,
};