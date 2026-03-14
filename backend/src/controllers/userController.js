const User = require("../models/User");
const Order = require("../models/Order");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.registerUser = async (req, res) => {
    try {

        const { name, email, password, phone } = req.body;

        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const user = await User.create({
            name,
            email,
            password,
            phone
        });

        res.status(201).json({
            message: "User registered successfully"
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.loginUser = async (req, res) => {

    try {

        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie("token", token, { httpOnly: true });

        res.json({
            message: "Login successful",
            user
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }

};

exports.logoutUser = async (req, res) => {

    res.cookie("token", "", { maxAge: 0 });

    res.json({ message: "Logged out successfully" });

};

exports.getProfile = async (req, res) => {

    const user = await User.findById(req.user.id).select("-password");

    res.json(user);

};

exports.getUserOrders = async (req, res) => {

    const orders = await Order.find({ userId: req.user.id });

    res.json(orders);

};