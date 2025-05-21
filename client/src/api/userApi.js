import axios from "axios";
import axiosInstance from './axiosInstance';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// export const getUsers = async () => {
//   try {
//     const response = await axios.get(`${API_URL}/users`);
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching users:", error);
//     throw error;
//   }
// };

export const getUsers = async (keyword = "") => {
  try {
    const response = await axios.get(`${API_URL}/users`, {
      params: { keyword },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const getRoles = async () => {
  try {
    const response = await axios.get(`${API_URL}/role`);
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const deleteUser = async (id, accessToken) => {
  try {
    const response = await axiosInstance.delete(`${API_URL}/users/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

export const updateUser = async (id, name, email, role_id, accessToken) => {
  try {
    const response = await axiosInstance.put(`${API_URL}/users/${id}`, {
      name: name,
      email: email,
      role_id: role_id
    }, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
}

export const getUserById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/users/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    throw error;
  }
}
export const createUser = async (userData, accessToken) => {
  try {
    const response = await axiosInstance.post('/users', userData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};
