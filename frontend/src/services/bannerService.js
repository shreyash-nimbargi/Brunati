import api from './api';

const getAuthHeaders = (additionalHeaders = {}) => {
    const token = localStorage.getItem('adminToken') || localStorage.getItem('admin_token');
    return {
        ...additionalHeaders,
        Authorization: `Bearer ${token}`
    };
};

export const bannerService = {
    // Public
    getActiveBanners: async () => {
        try {
            const response = await api.get('/banners');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Admin
    getAllBanners: async () => {
        try {
            const response = await api.get('/admin/banners', {
                headers: getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    createBanner: async (formData) => {
        try {
            const response = await api.post('/admin/banners', formData, {
                headers: getAuthHeaders({ 'Content-Type': 'multipart/form-data' })
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    updateBanner: async (id, formData) => {
        try {
            const response = await api.put(`/admin/banners/${id}`, formData, {
                headers: getAuthHeaders({ 'Content-Type': 'multipart/form-data' })
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    deleteBanner: async (id) => {
        try {
            const response = await api.delete(`/admin/banners/${id}`, {
                headers: getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
};
