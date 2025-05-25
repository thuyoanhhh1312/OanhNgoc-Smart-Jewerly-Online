import axiosInstance from './axiosInstance';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const getAllOrders = async (accessToken) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/orders`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

const getOrderById = async (id, accessToken) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/orders/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching order by ID:', error);
    throw error;
  }
};

const updateOrder = async (id, status, accessToken) => {
  try {
    const response = await axiosInstance.put(
      `${API_URL}/orders/${id}`,
      {
        status_id: status,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error updating order:', error);
    throw error;
  }
};

const updateStaff = async (id, staff_id, accessToken) => {
  try {
    const response = await axiosInstance.put(
      `${API_URL}/update-staff/${id}`,
      {
        user_id: staff_id,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error updating order:', error);
    throw error;
  }
};

const getOrderByUserId = async (userId, accessToken) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/orders/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching orders by user ID:', error);
    throw error;
  }
};

export const createOrder = async (orderData) => {
  try {
    const response = await axiosInstance.post(`${API_URL}/orders`, orderData);
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

const updateIsDeposit = async (id, isDeposit, accessToken) => {
  try {
    const response = await axiosInstance.patch(
      `${API_URL}/orders/${id}/deposit`,
      { is_deposit: isDeposit },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error updating is_deposit:', error);
    throw error;
  }
};

// Tạo đơn hàng (checkout)
const checkout = async (orderData, accessToken) => {
  try {
    const response = await axiosInstance.post(`${API_URL}/checkout`, orderData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error during checkout:', error);
    throw error;
  }
};

// Tính toán giá với mã khuyến mãi
const calculatePrice = async (priceData, accessToken) => {
  try {
    const response = await axiosInstance.post(`${API_URL}/calculate-price`, priceData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error calculating price:', error);
    throw error;
  }
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  getAllOrders,
  getOrderById,
  updateOrder,
  updateStaff,
  getOrderByUserId,
  createOrder,
  updateIsDeposit,
  checkout,
  calculatePrice
};
