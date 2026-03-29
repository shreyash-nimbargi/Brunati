import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const categoryService = {
    getAllCategories: async () => {
        const response = await axios.get(`${API_URL}/api/v1/admin/categories`);
        return response.data;
    },
    createCategory: async (data) => {
        const response = await axios.post(`${API_URL}/api/v1/admin/categories`, data);
        return response.data;
    },
    updateCategory: async (id, data) => {
        const response = await axios.put(`${API_URL}/api/v1/admin/categories/${id}`, data);
        return response.data;
    },
    deleteCategory: async (id) => {
        const response = await axios.delete(`${API_URL}/api/v1/admin/categories/${id}`);
        return response.data;
    }
};
