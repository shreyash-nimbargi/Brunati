const { cloudinary } = require("../config/cloudinary");

/**
 * Extracts the Cloudinary public_id from a full URL.
 * Example URL: https://res.cloudinary.com/demo/image/upload/v12345/brunati_products/sample.jpg
 * Public ID: brunati_products/sample
 * @param {string} url - The Cloudinary image URL.
 * @returns {string|null} - The public_id or null if extraction fails.
 */
const getPublicIdFromUrl = (url) => {
    if (!url) return null;
    try {
        // Find the index of the folder name (e.g., "brunati_products")
        const parts = url.split("/");
        const folderIndex = parts.findIndex(part => part === "brunati_products");
        if (folderIndex === -1) return null;

        // Construct the public_id from folder and filename (minus extension)
        const publicIdWithExtension = parts.slice(folderIndex).join("/");
        const publicId = publicIdWithExtension.split(".")[0];
        return publicId;
    } catch (error) {
        console.error("Error extracting public_id:", error.message);
        return null;
    }
};

/**
 * Deletes a single image from Cloudinary.
 * @param {string} url - The Cloudinary image URL.
 */
const deleteFromCloudinary = async (url) => {
    const publicId = getPublicIdFromUrl(url);
    if (publicId) {
        try {
            await cloudinary.uploader.destroy(publicId);
            console.log(`Deleted from Cloudinary: ${publicId}`);
        } catch (error) {
            console.error(`Failed to delete from Cloudinary: ${publicId}`, error.message);
        }
    }
};

/**
 * Deletes multiple images from Cloudinary.
 * @param {string[]} urls - Array of Cloudinary image URLs.
 */
const deleteMultipleFromCloudinary = async (urls) => {
    if (!urls || !Array.isArray(urls)) return;
    for (const url of urls) {
        await deleteFromCloudinary(url);
    }
};

module.exports = {
    getPublicIdFromUrl,
    deleteFromCloudinary,
    deleteMultipleFromCloudinary
};
