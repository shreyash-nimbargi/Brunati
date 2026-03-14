const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({

    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    },

    productName: String,

    productImage: [String],

    size: String,

    price: Number,

    quantity: Number

});

const freeSampleSchema = new mongoose.Schema({

    sampleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Sample"
    },

    productName: String,

    size: String

});

const orderSchema = new mongoose.Schema({

    orderId: {
        type: String,
        unique: true
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },

    customer: {
        name: String,
        email: String,
        phone: String,
        address: String,
        city: String,
        pincode: String
    },

    items: [orderItemSchema],

    freeSample: freeSampleSchema,

    totalAmount: Number,

    paymentStatus: {
        type: String,
        enum: ["pending", "paid", "failed"],
        default: "pending"
    },

    orderStatus: {
        type: String,
        enum: [
            "pending",
            "confirmed",
            "processing",
            "shipped",
            "delivered",
            "cancelled"
        ],
        default: "pending"
    }

}, { timestamps: true });

orderSchema.pre("save", async function (next) {

    if (!this.isNew) return next();

    const count = await mongoose.model("Order").countDocuments();

    const year = new Date().getFullYear();

    this.orderId = `BRN-${year}-${(count + 1).toString().padStart(4, "0")}`;

    next();
});

orderSchema.index({ orderStatus: 1 });
orderSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Order", orderSchema);