import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const getProducts = async () => {
  try {
    const response = await axios.get(`${API_URL}/products`);
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

// Tạo một sản phẩm mới
const createProduct = async (productName, description, price, quantity, categoryId, subcategoryId, images = [], authToken) => {
  try {
    const formData = new FormData();
    formData.append('product_name', productName);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('quantity', quantity);
    formData.append('category_id', categoryId);
    formData.append('subcategory_id', subcategoryId);

    // Thêm tất cả ảnh
    images.forEach((image) => {
      formData.append('images', image);
    });

    const response = await axios.post(`${API_URL}/products`, formData, {
      headers: {
        authToken,
        'Content-Type': 'multipart/form-data',
      }
    });

    return response.data;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};


// Lấy sản phẩm theo ID
const getProductById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/products/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    throw error;  // Đảm bảo lỗi được ném ra để xử lý ở nơi gọi
  }
};

// Cập nhật sản phẩm
const updateProduct = async (id, productName, description, price, quantity, categoryId, subcategoryId, imageUrl) => {
  try {
    const response = await axios.put(`${API_URL}/products/${id}`, {
      product_name: productName,
      description: description,
      price: price,
      quantity: quantity,
      category_id: categoryId,
      subcategory_id: subcategoryId
    });
    return response.data;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;  // Đảm bảo lỗi được ném ra để xử lý ở nơi gọi
  }
};

// Xóa sản phẩm
const deleteProduct = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/products/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;  // Đảm bảo lỗi được ném ra để xử lý ở nơi gọi
  }
};

// Xuất các phương thức để sử dụng ở nơi khác
export default {
  getProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
};