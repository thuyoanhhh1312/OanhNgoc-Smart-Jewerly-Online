import axios from "axios";
import axiosInstance from "./axiosInstance";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const getAllOrders = async (accessToken) => {
  try {
    const response = await axios.get(`${API_URL}/orders`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};

const getOrderById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/orders/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching order by ID:", error);
    throw error;
  }
};

const updateOrder = async (id, status, accessToken) => {
  try {
    const response = await axiosInstance.put(
      `${API_URL}/orders/${id}`,
      {
        status: status,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating order:", error);
    throw error;
  }
};

const updateStaff = async (id, staff_id, accessToken) => {
  try {
    const response = await axiosInstance.put(
      `${API_URL}/orders/${id}`,
      {
        staff_id: staff_id,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating order:", error);
    throw error;
  }
};

const getOrderByUserId = async (userId, accessToken) => {
  try {
    const response = await axios.get(`${API_URL}/orders/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching orders by user ID:", error);
    throw error;
  }
};

export default {
  getAllOrders,
  getOrderById,
  updateOrder,
  updateStaff,
  getOrderByUserId,
};
