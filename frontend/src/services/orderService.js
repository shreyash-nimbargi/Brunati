import api from './api';

export const orderService = {
    createOrder: async (orderData) => {
        try {
            const response = await api.post('/orders', orderData);
            return response.data;
        } catch (error) {
            console.error('Create order error:', error);
            throw error;
        }
    },

    getOrderById: async (orderId) => {
        try {
            const response = await api.get(`/orders/${orderId}`);
            return response.data;
        } catch (error) {
            console.error('Get order error:', error);
            throw error;
        }
    },

    cancelOrder: async (orderId) => {
        try {
            const response = await api.post(`/orders/${orderId}/cancel`);
            return response.data;
        } catch (error) {
            console.error('Cancel order error:', error);
            throw error;
        }
    }
};

export default orderService;
