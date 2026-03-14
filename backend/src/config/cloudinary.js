const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
require("dotenv").config();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME || "your_cloud_name",
    api_key: process.env.CLOUDINARY_API_KEY || "your_api_key",
    api_secret: process.env.CLOUDINARY_API_SECRET || "your_api_secret",
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "brunati_products",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
    },
});

module.exports = { cloudinary, storage };
