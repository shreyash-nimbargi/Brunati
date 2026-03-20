const jwt = require("jsonwebtoken");
const User = require("../models/User");

const adminMiddleware = async (req, res, next) => {

    try {

        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ status: false, message: "Not authorized - No token found", data: null });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id);

        if (!user || !user.isAdmin) {
            return res.status(403).json({ status: false, message: "Admin access required", data: null });
        }

        req.user = user;

        next();

    } catch (error) {
        res.status(401).json({ status: false, message: "Invalid token or session expired", data: null });
    }

};

module.exports = adminMiddleware;
