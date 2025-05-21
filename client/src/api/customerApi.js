import axios from "axios";
import axiosInstance from "./axiosInstance";


const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
//  export const getCustomers = async () => {
//     try{
//         const response = await axios.get(`${API_URL}/customers`);
//         return response.data;
//     }catch (error) {
//         console.error("Error fetching customers:", error);
//         throw error;
//     }
// };

export const getCustomerById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/customers/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching customer by ID:", error);
    throw error;
  }
};


// // Hàm xóa khách hàng
// export const deleteCustomer = async (id) => {
//   try {
//     const response = await axios.delete(`${API_URL}/customers/${id}`);
//     return response.data;
//   } catch (error) {
//     console.error(`Error deleting customer with id=${id}:`, error);
//     throw error;
//   }
// };
export const deleteCustomer = async (id, accessToken) => {
  try {
    const response = await axios.delete(`${API_URL}/customers/${id}`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    return response.data;
  } catch (error) {
    console.error(`Error deleting customer with id=${id}:`, error);
    throw error;
  }
};

export const getCustomers = async (keyword = "") => {
  try {
    const response = await axios.get(`${API_URL}/customers`, {
      params: { keyword }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching customers:", error);
    throw error;
  }
};
