const Order = require("../../models/Order");
const sendEmail = require("../../utils/emailService");

exports.getAllOrders = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const total = await Order.countDocuments();
        const orders = await Order.find().sort({ createdAt: -1 }).skip(skip).limit(limit);

        res.json({ 
            status: true, 
            message: "Orders fetched successfully", 
            data: orders,
            pagination: { total, page, limit, totalPages: Math.ceil(total / limit) }
        });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message, data: null });
    }
};

exports.getOrderDetails = async (req, res) => {
    try {
        const order = await Order.findOne({ orderId: req.params.orderId }).populate("userId").populate("items.productId").populate("freeSample.sampleId");
        if (!order) {
            return res.status(404).json({ status: false, message: "Order not found", data: null });
        }
        res.json({ status: true, message: "Success", data: order });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message, data: null });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderStatus } = req.body;
        const order = await Order.findOneAndUpdate({ orderId: req.params.orderId }, { orderStatus }, { new: true, runValidators: true }).populate("userId", "name email");
        
        if (!order) {
            return res.status(404).json({ status: false, message: "Order not found", data: null });
        }

        // 🚚 Email: Order Shipped
        if (orderStatus === "shipped" && order.userId && order.userId.email) {
            await sendEmail({
                email: order.userId.email,
                subject: `Your Brunati Order #${order.orderId} Has Shipped! 🚚`,
                message: `Hello ${order.userId.name},\n\nGreat news! Your luxury fragrance order #${order.orderId} has been shipped and is on its way to you.\n\nExpect delivery within 3-5 business days.\n\nThank you for choosing Brunati.`
            });
        }

        // 📦 Email: Order Delivered
        if (orderStatus === "delivered" && order.userId && order.userId.email) {
            await sendEmail({
                email: order.userId.email,
                subject: `Your Brunati Order #${order.orderId} Has Been Delivered! 📦`,
                message: `Hello ${order.userId.name},\n\nYour order #${order.orderId} has been delivered! We hope you love your new fragrance.\n\nIf you enjoyed your purchase, we would love to hear from you — leave a review on the product page!\n\nThank you for choosing Brunati.`
            });
        }

        res.json({ status: true, message: "Success", data: order });
    } catch (error) {
        res.status(400).json({ status: false, message: error.message, data: null });
    }
};
