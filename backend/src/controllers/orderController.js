const Order = require("../models/Order");
const Product = require("../models/Product");
const Sample = require("../models/Sample");
const sendEmail = require("../utils/emailService");

exports.createOrder = async (req, res) => {

    try {

        const { items, sampleId, shippingAddress } = req.body;

        if (shippingAddress) {
            // Check if this address already exists structurally
            const existingNum = req.user.addresses?.findIndex(a => 
                a.street === shippingAddress.street && 
                a.pincode === shippingAddress.pincode &&
                a.city === shippingAddress.city
            );

            if (existingNum === -1 || existingNum === undefined) {
                if (!req.user.addresses) req.user.addresses = [];
                req.user.addresses.push({
                    name: shippingAddress.name || req.user.name,
                    phone: shippingAddress.phone || req.user.phone,
                    alternatePhone: shippingAddress.alternatePhone || "",
                    street: shippingAddress.street,
                    city: shippingAddress.city,
                    state: shippingAddress.state,
                    pincode: shippingAddress.pincode
                });
                await req.user.save();
            } else if (existingNum >= 0 && req.user.addresses) {
                // Update specific phone or name if they changed the name
                req.user.addresses[existingNum].name = shippingAddress.name || req.user.addresses[existingNum].name;
                req.user.addresses[existingNum].phone = shippingAddress.phone || req.user.addresses[existingNum].phone;
                req.user.addresses[existingNum].alternatePhone = shippingAddress.alternatePhone || req.user.addresses[existingNum].alternatePhone;
                await req.user.save();
            }
        }

        // Populate customer info for the Order model
        const customer = {
            name:    shippingAddress?.name || req.user.name,
            email:   req.user.email,
            phone:   shippingAddress?.phone || req.user.phone,
            alternatePhone: shippingAddress?.alternatePhone || "",
            street:  shippingAddress?.street || "",
            city:    shippingAddress?.city || "",
            state:   shippingAddress?.state || "",
            pincode: shippingAddress?.pincode || ""
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
                    productImage: sample.productId.images,
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
    try {
        const order = await Order.findOne({
            orderId: req.params.orderId,
            userId: req.user._id // Security: Ensure customer can only view their own order
        });

        if (!order) {
            return res.status(404).json({ status: false, message: "Order not found", data: null });
        }

        res.json({ status: true, message: "Order fetched successfully", data: order });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message, data: null });
    }
};

exports.cancelOrder = async (req, res) => {
    try {
        const order = await Order.findOne({
            orderId: req.params.orderId,
            userId: req.user._id
        });

        if (!order) {
            return res.status(404).json({ status: false, message: "Order not found", data: null });
        }

        // Only allow cancellation if order hasn't been processed/shipped yet
        if (!["placed", "confirmed"].includes(order.orderStatus)) {
            return res.status(400).json({ 
                status: false, 
                message: `Cannot cancel order in '${order.orderStatus}' status. Please contact support.`, 
                data: null 
            });
        }

        // 1. Return items to stock
        for (let item of order.items) {
            const product = await Product.findById(item.productId);
            if (product) {
                const sizeData = product.sizes.find(s => s.size === item.size);
                if (sizeData) {
                    sizeData.stock += item.quantity;
                    await product.save();
                }
            }
        }

        // 2. Return free sample to stock (if any)
        if (order.freeSample && order.freeSample.sampleId) {
            const sample = await Sample.findById(order.freeSample.sampleId);
            if (sample) {
                sample.stock += 1;
                await sample.save();
            }
        }

        // 3. Update order status
        order.orderStatus = "cancelled";
        await order.save();

        // 4. Send Email
        if (order.customer.email) {
            await sendEmail({
                email: order.customer.email,
                subject: `Order Cancelled: #${order.orderId}`,
                message: `Hello ${order.customer.name},\n\nYour order #${order.orderId} has been successfully cancelled as per your request.\n\nIf this was a mistake, please reach out to us.\n\nBest regards,\nBrunati Team`
            });
        }

        res.json({ status: true, message: "Order cancelled successfully", data: order });

    } catch (error) {
        res.status(500).json({ status: false, message: error.message, data: null });
    }
};