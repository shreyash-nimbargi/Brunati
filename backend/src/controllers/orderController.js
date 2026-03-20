const Order = require("../models/Order");
const Product = require("../models/Product");
const Sample = require("../models/Sample");

exports.createOrder = async (req, res) => {

    try {

        const { customer, items, sampleId } = req.body;

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