import api from './api';

const getAuthConfig = () => {
    const token = localStorage.getItem('adminToken') || localStorage.getItem('admin_token');
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

export const reviewService = {
    getAllReviews: async (page = 1, limit = 20) => {
        try {
            const config = getAuthConfig();
            config.params = { page, limit };
            const response = await api.get(`/admin/reviews`, config);
            return response.data;
        } catch (error) {
            console.error('Fetch reviews error:', error);
            throw error;
        }
    },

    createReview: async (reviewData) => {
        try {
            const response = await api.post(`/admin/reviews`, reviewData, getAuthConfig());
            return response.data;
        } catch (error) {
            console.error('Create review error:', error);
            throw error;
        }
    },

    updateReview: async (id, reviewData) => {
        try {
            const response = await api.put(`/admin/reviews/${id}`, reviewData, getAuthConfig());
            return response.data;
        } catch (error) {
            console.error('Update review error:', error);
            throw error;
        }
    },

    deleteReview: async (id) => {
        try {
            const response = await api.delete(`/admin/reviews/${id}`, getAuthConfig());
            return response.data;
        } catch (error) {
            console.error('Delete review error:', error);
            throw error;
        }
    }
};
