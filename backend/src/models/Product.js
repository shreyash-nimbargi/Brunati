const mongoose = require("mongoose");
const slugify = require("slugify");

const sizeSchema = new mongoose.Schema({
    size: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true
    }
});

const storySectionSchema = new mongoose.Schema({
    title: String,
    description: String
});

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    slug: {
        type: String,
        unique: true,
        required: true
    },

    category: {
        type: String,
        enum: ["men", "women", "unisex", "gifts"],
        required: true
    },

    images: [String],

    mainAccords: [String],

    perfumePyramid: {
        top: [String],
        middle: [String],
        base: [String]
    },

    sizes: [sizeSchema],

    story: {
        storyImages: [String],
        sections: [storySectionSchema]
    },

    isActive: {
        type: Boolean,
        default: true
    }

}, { timestamps: true });



productSchema.pre("save", function (next) {

    if (!this.isModified("name")) {
        return next();
    }

    this.slug = slugify(this.name, {
        lower: true,
        strict: true
    });

    next();
});

productSchema.index({ slug: 1 });
productSchema.index({ category: 1 });
productSchema.index({ name: "text" });

module.exports = mongoose.model("Product", productSchema);