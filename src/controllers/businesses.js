const Business = require('../models/businesses');

async function getAllBusinesses(req, res) {
    const businesses = await Business.find().exec();
    if (!businesses) {
        return res.status(404).json('businesses are not found');
    }
    return res.json(businesses);
}

async function getBusinessById(req, res) {
    const {id} = req.params;
    const business = await Business.findById(id);
    if (!business) {
        return res.status(404).json('business is not found');
    }
    return res.json(business);
}

async function addBusiness(req, res) {
    const {businessName, ABN, email, phone, streeAddress, postcode, state, rate} = req.body;
    const existingEmail = await Business.findOne({email});
    if (existingEmail) {
        return res.status(400).json('email has already existed');
    }
    const business = new Business({
        businessName,
        ABN,
        email,
        phone,
        streeAddress,
        postcode,
        state,
        rate
    })
    if (!business) {
        return res.status(500).json('adding business failed');
    }
    await business.save();
    return res.json(business);
}

async function updateBusiness(req, res) {
    const {id} = req.params;
    const {businessName, ABN, email, phone, streeAddress, postcode, state, rate} = req.body;
    const updatedBusiness = await Business.findByIdAndUpdate(id, {businessName, ABN, email, phone, streeAddress, postcode, state, rate}, {runValidators: true, new: true});
    if (!updatedBusiness) {
        return res.status(404).json('updating business failed');
    }
    return res.json(updatedBusiness);
}

async function deleteBusinessById(req, res) {
    const {id} = req.params;
    const deletedBusiness = await Business.findByIdAndDelete(id);
    if (!deletedBusiness) {
        return res.status(404).json('deleting business failed');
    }
    return res.json(deletedBusiness); 
}

module.exports = {
    getAllBusinesses,
    getBusinessById,
    addBusiness,
    updateBusiness,
    deleteBusinessById
};