const Sample = require("../../models/Sample");

exports.createSample = async (req, res) => {
    try {
        const sample = new Sample(req.body);
        await sample.save();
        res.status(201).json({ status: true, message: "Sample created successfully", data: sample });
    } catch (error) {
        res.status(400).json({ status: false, message: error.message, data: null });
    }
};

exports.updateSample = async (req, res) => {
    try {
        const sample = await Sample.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!sample) {
            return res.status(404).json({ status: false, message: "Sample not found", data: null });
        }
        res.json({ status: true, message: "Sample updated successfully", data: sample });
    } catch (error) {
        res.status(400).json({ status: false, message: error.message, data: null });
    }
};

exports.deleteSample = async (req, res) => {
    try {
        const sample = await Sample.findByIdAndDelete(req.params.id);
        if (!sample) {
            return res.status(404).json({ status: false, message: "Sample not found", data: null });
        }
        res.json({ status: true, message: "Sample deleted successfully", data: null });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message, data: null });
    }
};

exports.getAllSamples = async (req, res) => {
    try {
        const samples = await Sample.find().populate("productId").sort({ createdAt: -1 });
        res.json({ status: true, message: "Samples fetched successfully", data: samples });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message, data: null });
    }
};
