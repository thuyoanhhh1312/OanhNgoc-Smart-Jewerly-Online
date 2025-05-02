import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
const getCategories = async () => {
  try {
    const response = await axios.get(`${API_URL}/categories`);
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

const createCategory = async (categoryName, description, authtoken) => {
  try {
    const response = await axios.post(`${API_URL}/categories`, {
      category_name: categoryName,
      description: description,
    }, {
      headers: {
        authtoken: authtoken,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
};

const getCategoryById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/categories/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching category by ID:", error);
    throw error;
  }
}

const updateCategory = async (id, categoryName, description, authtoken) => {
  try {
    const response = await axios.put(`${API_URL}/categories/${id}`, {
      category_name: categoryName,
      description: description,
    }, {
      headers: {
        authtoken
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
}

// Xóa sản phẩm
const deleteCategory = async (id, authtoken) => {
  try {
    const response = await axios.delete(`${API_URL}/categories/${id}`, {
      headers: {
        authtoken
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;  // Đảm bảo lỗi được ném ra để xử lý ở nơi gọi
  }
};

export default {
  getCategories,
  createCategory,
  getCategoryById,
  updateCategory,
  deleteCategory
};