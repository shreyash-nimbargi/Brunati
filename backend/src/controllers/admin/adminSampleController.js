const Sample = require("../../models/Sample");

exports.createSample = async (req, res) => {
    try {
        const sample = new Sample(req.body);
        await sample.save();
        res.status(201).json(sample);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateSample = async (req, res) => {
    try {
        const sample = await Sample.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!sample) {
            return res.status(404).json({ message: "Sample not found" });
        }
        res.json(sample);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteSample = async (req, res) => {
    try {
        const sample = await Sample.findByIdAndDelete(req.params.id);
        if (!sample) {
            return res.status(404).json({ message: "Sample not found" });
        }
        res.json({ message: "Sample deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllSamples = async (req, res) => {
    try {
        const samples = await Sample.find().populate("productId").sort({ createdAt: -1 });
        res.json(samples);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
