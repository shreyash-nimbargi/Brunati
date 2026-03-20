const Order = require("../../models/Order");

exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json({ status: true, message: "Orders fetched successfully", data: orders });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message, data: null });
    }
};

exports.getOrderDetails = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate("userId").populate("items.productId").populate("freeSample.sampleId");
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
        const order = await Order.findByIdAndUpdate(req.params.id, { orderStatus }, { new: true, runValidators: true });
        if (!order) {
            return res.status(404).json({ status: false, message: "Order not found", data: null });
        }
        res.json({ status: true, message: "Success", data: order });
    } catch (error) {
        res.status(400).json({ status: false, message: error.message, data: null });
    }
};
