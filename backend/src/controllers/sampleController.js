const Sample = require("../models/Sample");
const Settings = require("../models/Settings");

exports.getAvailableSamples = async (req, res) => {

    const settings = await Settings.findOne();

    if (!settings.freeSampleEnabled) {
        return res.json({ status: true, message: "Free samples are disabled", data: { samples: [] } });
    }

    const samples = await Sample.find({
        _id: { $in: settings.allowedSamples },
        active: true
    }).populate("productId");

    res.json({
        status: true,
        message: "Available samples fetched successfully",
        data: {
            maxSamples: settings.maxSamples,
            samples
        }
    });

};