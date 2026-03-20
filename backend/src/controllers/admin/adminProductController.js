const Product = require("../../models/Product");
const { deleteMultipleFromCloudinary } = require("../../utils/cloudinaryHelper");

const parseBody = (body) => {
    const parsed = { ...body };
    ['sizes', 'mainAccords', 'perfumePyramid', 'story'].forEach(field => {
        if (parsed[field] && typeof parsed[field] === 'string') {
            try {
                parsed[field] = JSON.parse(parsed[field]);
            } catch (e) {
                // Keep as is if not valid JSON
            }
        }
    });
    return parsed;
};

exports.createProduct = async (req, res) => {
    try {
        const productData = parseBody(req.body);

        // Handle uploaded images
        if (req.files) {
            if (req.files.images) {
                productData.images = req.files.images.map(file => file.path);
            }
            if (req.files.storyImages) {
                if (!productData.story) productData.story = {};
                productData.story.storyImages = req.files.storyImages.map(file => file.path);
            }
        }

        const product = new Product(productData);
        await product.save();
        res.status(201).json({ status: true, message: "Product created successfully", data: product });
    } catch (error) {
        res.status(400).json({ status: false, message: error.message, data: null });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const productData = parseBody(req.body);

        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ status: false, message: "Product not found", data: null });
        }

        // Handle uploaded images
        if (req.files) {
            if (req.files.images) {
                // Delete old product images from Cloudinary before replacing
                if (product.images && product.images.length > 0) {
                    await deleteMultipleFromCloudinary(product.images);
                }
                productData.images = req.files.images.map(file => file.path);
            }
            if (req.files.storyImages) {
                // Delete old story images from Cloudinary before replacing
                if (product.story && product.story.storyImages && product.story.storyImages.length > 0) {
                    await deleteMultipleFromCloudinary(product.story.storyImages);
                }
                // Merge: only update storyImages, keep existing sections intact
                productData.story = {
                    sections: productData.story?.sections ?? product.story?.sections ?? [],
                    storyImages: req.files.storyImages.map(file => file.path)
                };
            }
        }

        // If story.sections were sent in body but no new storyImages, preserve existing storyImages
        if (productData.story && !req.files?.storyImages) {
            productData.story = {
                storyImages: product.story?.storyImages ?? [],
                sections: productData.story.sections ?? product.story?.sections ?? []
            };
        }

        Object.assign(product, productData);
        await product.save();

        res.json({ status: true, message: "Product updated successfully", data: product });
    } catch (error) {
        res.status(400).json({ status: false, message: error.message, data: null });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ status: false, message: "Product not found", data: null });
        }

        // Delete all images from Cloudinary
        const allImages = [...(product.images || [])];
        if (product.story && product.story.storyImages) {
            allImages.push(...product.story.storyImages);
        }

        if (allImages.length > 0) {
            await deleteMultipleFromCloudinary(allImages);
        }

        await Product.findByIdAndDelete(req.params.id);
        res.json({ status: true, message: "Product deleted successfully", data: null });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message, data: null });
    }
};

exports.getAllProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const total = await Product.countDocuments();
        const products = await Product.find().sort({ createdAt: -1 }).skip(skip).limit(limit);

        res.json({ 
            status: true, 
            message: "Products fetched successfully", 
            data: products,
            pagination: { total, page, limit, totalPages: Math.ceil(total / limit) }
        });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message, data: null });
    }
};
