const Sample = require("../models/Sample");
const Settings = require("../models/Settings");

exports.getAvailableSamples = async (req, res) => {

    const settings = await Settings.findOne();

    if (!settings.freeSampleEnabled) {
        return res.json({ samples: [] });
    }

    const samples = await Sample.find({
        _id: { $in: settings.allowedSamples },
        active: true
    }).populate("productId");

    res.json({
        maxSamples: settings.maxSamples,
        samples
    });

};