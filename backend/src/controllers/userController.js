const User = require("../models/User");
const Order = require("../models/Order");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.registerUser = async (req, res) => {
    try {

        const { name, email, password, phone } = req.body;

        if (!phone || !password) {
            return res.status(400).json({ status: false, message: "Phone and password are required", data: null });
        }

        const userExists = await User.findOne({ phone });

        if (userExists) {
            return res.status(400).json({ status: false, message: "User already exists with this phone number", data: null });
        }

        const user = await User.create({
            name,
            email,
            password,
            phone
        });

        res.status(201).json({
            status: true,
            message: "User registered successfully",
            data: user
        });

    } catch (error) {
        res.status(500).json({ status: false, message: error.message, data: null });
    }
};

exports.loginUser = async (req, res) => {

    try {

        const { phone, password } = req.body;

        if (!phone || !password) {
            return res.status(400).json({ status: false, message: "Phone and password are required", data: null });
        }

        const user = await User.findOne({ phone });

        if (!user) {
            return res.status(400).json({ status: false, message: "Invalid credentials", data: null });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ status: false, message: "Invalid credentials", data: null });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "30d" }
        );

        res.cookie("token", token, { 
            httpOnly: true,
            maxAge: 30 * 24 * 60 * 60 * 1000 
        });

        res.json({
            status: true,
            message: "Login successful",
            data: { user, token }
        });

    } catch (error) {
        res.status(500).json({ status: false, message: error.message, data: null });
    }

};

exports.logoutUser = async (req, res) => {

    res.cookie("token", "", { maxAge: 0 });

    res.json({ status: true, message: "Logged out successfully", data: null });

};

exports.getProfile = async (req, res) => {

    const user = await User.findById(req.user.id).select("-password");

    res.json({ status: true, message: "Profile fetched successfully", data: user });

};

exports.getUserOrders = async (req, res) => {

    const orders = await Order.find({ userId: req.user.id });

    res.json({ status: true, message: "Orders fetched successfully", data: orders });

};

exports.updateAddress = async (req, res) => {
    try {
        const { street, city, pincode } = req.body;
        const user = await User.findById(req.user.id);
        
        user.address = { street, city, pincode };
        await user.save();

        res.json({ status: true, message: "Address updated successfully", data: user.address });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message, data: null });
    }
};