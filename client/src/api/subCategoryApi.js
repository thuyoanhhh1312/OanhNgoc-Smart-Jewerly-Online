import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const getSubCategories = async () => {
    try {
        const response = await axios.get(`${API_URL}/subcategories`);
        return response.data;
    }
    catch (error) {
        console.error("Error fetching subcategories:", error);
        throw error;
    }
};

const getSubCategoryById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/subcategories/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching subcategory by ID:", error);
        throw error;
    }
}
const createSubCategory = async (subcategory_name, description, category_id, authtoken) => {
    try {
        const response = await axios.post(`${API_URL}/subcategories`, {
            subcategory_name,
            description,
            category_id,
        }, {
            headers: {
                authtoken
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error creating subcategory:", error);
        throw error;
    }
};


const updateSubCategory = async (id, data, authtoken) => {
    try {
        const response = await axios.put(`${API_URL}/subcategories/${id}`, data, {
            headers: {
                authtoken
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error updating subcategory:", error);
        throw error;
    }
};

const deleteSubCategory = async (id, authtoken) => {
    try {
        const response = await axios.delete(`${API_URL}/subcategories/${id}`, {
            headers: {
                authtoken
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error deleting subcategory:", error);
        throw error;
    }
};

export default {
    getSubCategories,
    createSubCategory,
    getSubCategoryById,
    updateSubCategory,
    deleteSubCategory,
};

