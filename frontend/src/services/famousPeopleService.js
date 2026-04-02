import api from './api';

const getAuthConfig = () => {
    const token = localStorage.getItem('adminToken') || localStorage.getItem('admin_token');
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

export const famousPeopleService = {
    getAll: async () => {
        try {
            const response = await api.get(`/admin/famous-people`, getAuthConfig());
            return response.data;
        } catch (error) {
            console.error('Fetch famous people error:', error);
            throw error;
        }
    },

    create: async (data) => {
        try {
            const response = await api.post(`/admin/famous-people`, data, getAuthConfig());
            return response.data;
        } catch (error) {
            console.error('Create famous person error:', error);
            throw error;
        }
    },

    update: async (id, data) => {
        try {
            const response = await api.put(`/admin/famous-people/${id}`, data, getAuthConfig());
            return response.data;
        } catch (error) {
            console.error('Update famous person error:', error);
            throw error;
        }
    },

    delete: async (id) => {
        try {
            const response = await api.delete(`/admin/famous-people/${id}`, getAuthConfig());
            return response.data;
        } catch (error) {
            console.error('Delete famous person error:', error);
            throw error;
        }
    }
};
