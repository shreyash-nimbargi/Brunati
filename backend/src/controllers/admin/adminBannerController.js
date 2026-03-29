const Banner = require("../../models/Banner");
const path = require("path");
const fs = require("fs");

/**
 * @desc    Get all banners
 * @route   GET /api/v1/admin/banners
 * @access  Private/Admin
 */
exports.getAllBanners = async (req, res) => {
    try {
        const banners = await Banner.find().sort({ priority: 1, createdAt: -1 });
        res.status(200).json({
            status: true,
            message: "Banners fetched successfully",
            data: banners
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message,
            data: null
        });
    }
};

/**
 * @desc    Create new banner (with possible file upload)
 * @route   POST /api/v1/admin/banners
 * @access  Private/Admin
 */
exports.createBanner = async (req, res) => {
    try {
        const { title, subtitle, link, priority } = req.body;
        let imageUrl = req.body.imageUrl || "";

        if (req.file) {
            // Using existing logic similar to Category controller
            imageUrl = `uploads/banners/${req.file.filename}`;
        }

        if (!imageUrl) {
            return res.status(400).json({
                status: false,
                message: "Image is required",
                data: null
            });
        }

        const banner = await Banner.create({
            title,
            subtitle,
            link,
            priority: priority || 1,
            imageUrl
        });

        res.status(201).json({
            status: true,
            message: "Banner created successfully",
            data: banner
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message,
            data: null
        });
    }
};

/**
 * @desc    Update existing banner
 * @route   PUT /api/v1/admin/banners/:id
 * @access  Private/Admin
 */
exports.updateBanner = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, subtitle, link, priority, active } = req.body;
        const banner = await Banner.findById(id);

        if (!banner) {
            return res.status(404).json({
                status: false,
                message: "Banner not found",
                data: null
            });
        }

        if (req.file) {
            // Delete old file if dynamic
            const oldPath = path.join(__dirname, "../../../", banner.imageUrl);
            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
            }
            banner.imageUrl = `uploads/banners/${req.file.filename}`;
        }

        banner.title = title || banner.title;
        banner.subtitle = subtitle !== undefined ? subtitle : banner.subtitle;
        banner.link = link !== undefined ? link : banner.link;
        banner.priority = priority !== undefined ? priority : banner.priority;
        banner.active = active !== undefined ? active : banner.active;

        const updatedBanner = await banner.save();

        res.status(200).json({
            status: true,
            message: "Banner updated successfully",
            data: updatedBanner
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message,
            data: null
        });
    }
};

/**
 * @desc    Delete banner
 * @route   DELETE /api/v1/admin/banners/:id
 * @access  Private/Admin
 */
exports.deleteBanner = async (req, res) => {
    try {
        const { id } = req.params;
        const banner = await Banner.findById(id);

        if (!banner) {
            return res.status(404).json({
                status: false,
                message: "Banner not found",
                data: null
            });
        }

        // Delete physical file
        const filePath = path.join(__dirname, "../../../", banner.imageUrl);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        await Banner.findByIdAndDelete(id);

        res.status(200).json({
            status: true,
            message: "Banner deleted successfully",
            data: null
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message,
            data: null
        });
    }
};
