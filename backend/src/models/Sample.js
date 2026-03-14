const mongoose = require("mongoose");

const sampleSchema = new mongoose.Schema({

    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },

    size: {
        type: String,
        default: "1ml"
    },

    stock: Number,

    active: {
        type: Boolean,
        default: true
    }

}, { timestamps: true });

module.exports = mongoose.model("Sample", sampleSchema);