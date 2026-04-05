import api from './api';

export const productService = {
    // Get all products
    getAllProducts: async () => {
        try {
            const response = await api.get('/products');
            return response.data;
        } catch (error) {
            console.error('Error fetching products:', error);
            throw error;
        }
    },

    // Get a specific product by slug
    getProductBySlug: async (slug) => {
        try {
            const encodedSlug = encodeURIComponent(slug);
            const response = await api.get(`/products/${encodedSlug}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching product with slug ${slug}:`, error);
            throw error;
        }
    },

    // Get samples (optional but nice to have in service)
    getAvailableSamples: async () => {
        try {
            const response = await api.get('/samples/available');
            return response.data;
        } catch (error) {
            console.error('Error fetching samples:', error);
            throw error;
        }
    },

    // Get reviews for a specific product by ID
    getReviewsByProduct: async (productId) => {
        try {
            const response = await api.get(`/reviews/${productId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching reviews for product ${productId}:`, error);
            throw error;
        }
    },

    // Update product
    updateProduct: async (id, data) => {
        try {
            const response = await api.put(`/products/${id}`, data);
            return response.data;
        } catch (error) {
            console.error(`Error updating product ${id}:`, error);
            throw error;
        }
    },

    // Create product
    createProduct: async (data) => {
        try {
            const response = await api.post('/products', data);
            return response.data;
        } catch (error) {
            console.error('Error creating product:', error);
            throw error;
        }
    }
};


export default productService;
