const Sample = require("../models/Sample");
const Settings = require("../models/Settings");

exports.getAvailableSamples = async (req, res) => {

    // Gracefully handle case where Settings doc doesn't exist yet
    const settings = await Settings.findOne();

    if (settings && !settings.freeSampleEnabled) {
        return res.json({ status: true, message: "Free samples are currently disabled", data: { samples: [] } });
    }

    // Simply return all active samples — Sample.active is the only gate needed
    const samples = await Sample.find({ active: true }).populate("productId");

    res.json({
        status: true,
        message: "Available samples fetched successfully",
        data: {
            maxSamples: settings?.maxSamples || 1,
            samples
        }
    });

};