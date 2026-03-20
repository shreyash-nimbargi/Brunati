const Order = require("../models/Order");
const Product = require("../models/Product");
const Sample = require("../models/Sample");
const sendEmail = require("../utils/emailService");

exports.createOrder = async (req, res) => {

    try {

        const { items, sampleId, street, city, pincode } = req.body;

        // Auto-populate customer info from logged-in user
        const customer = {
            name:    req.user.name,
            email:   req.user.email,
            phone:   req.user.phone,
            // Use address from request body, or fall back to saved default address
            street:  street  || req.user.address?.street  || "",
            city:    city    || req.user.address?.city     || "",
            pincode: pincode || req.user.address?.pincode  || ""
        };

        let orderItems = [];
        let total = 0;

        for (let item of items) {

            const product = await Product.findById(item.productId);

            const sizeData = product.sizes.find(
                s => s.size === item.size
            );

            if (!sizeData || sizeData.stock < item.quantity) {
                return res.status(400).json({
                    status: false,
                    message: "Stock not available",
                    data: null
                });
            }

            orderItems.push({
                productId: product._id,
                productName: product.name,
                productImage: product.images[0],
                size: item.size,
                price: sizeData.price,
                quantity: item.quantity
            });

            total += sizeData.price * item.quantity;

            sizeData.stock -= item.quantity;

            await product.save();

        }

        let freeSample = null;

        if (sampleId) {
            const sample = await Sample.findById(sampleId).populate("productId");

            if (sample && sample.active && sample.stock > 0) {
                freeSample = {
                    sampleId: sample._id,
                    productName: sample.productId.name,
                    size: sample.size
                };
                
                // Decrement sample stock
                sample.stock -= 1;
                await sample.save();
            }
        }

        const order = await Order.create({
            userId: req.user._id,
            customer,
            items: orderItems,
            freeSample,
            totalAmount: total
        });

        // ✅ Email: Order Placed
        if (req.user.email) {
            await sendEmail({
                email: req.user.email,
                subject: `Order Confirmed! Your Brunati Order #${order.orderId}`,
                message: `Hello ${req.user.name},\n\nThank you for your order! We have received your order #${order.orderId} for ₹${order.totalAmount}.\n\nWe will notify you when your order ships.\n\nThank you for choosing Brunati.`
            });
        }

        res.status(201).json({
            status: true,
            message: "Order created successfully",
            data: order
        });

    } catch (error) {

        res.status(500).json({
            status: false,
            message: error.message,
            data: null
        });

    }

};

exports.getOrderById = async (req, res) => {

    const order = await Order.findOne({
        orderId: req.params.orderId
    });

    if (!order) {
        return res.status(404).json({ status: false, message: "Order not found", data: null });
    }

    res.json({ status: true, message: "Order fetched successfully", data: order });

};