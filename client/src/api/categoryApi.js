import axios from "axios";

const API_URL = process.env.API_URL || "http://localhost:5000/api";
const getCategories = async () => {
  try {
    const response = await axios.get(`${API_URL}/categories`);
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

export default {
    getCategories,
};