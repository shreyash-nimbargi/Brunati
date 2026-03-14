const Settings = require("../../models/Settings");

exports.updateFreeSampleSettings = async (req, res) => {
    try {
        const data = { ...req.body };
        if (data.allowedSamples && typeof data.allowedSamples === 'string') {
            try {
                data.allowedSamples = JSON.parse(data.allowedSamples);
            } catch (e) {}
        }

        let settings = await Settings.findOne();
        if (!settings) {
            settings = new Settings(data);
        } else {
            Object.assign(settings, data);
        }
        await settings.save();
        res.json(settings);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
