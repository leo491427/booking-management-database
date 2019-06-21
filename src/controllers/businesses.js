const Business = require('../models/businesses');
const Category = require('../models/categories');

async function getAllBusinesses(req, res) {
    // const businesses = await Business.find().exec();
    // if (!businesses) {
    //     return res.status(404).json('businesses are not found');
    // }

    const {conditionKey = 'email', conditionValue, pageRequested = 1, pageSize = 5, sortKey = 'email', sortValue = 1} = req.query;
    
    const documentCountBeforePagination = await Business.countDocuments({[conditionKey]: new RegExp(conditionValue, 'i')});

    const documentsAfterPagination = await Business.searchByFilters(conditionKey, conditionValue, pageRequested, pageSize, sortKey, sortValue);
    if (!documentsAfterPagination || documentsAfterPagination.length === 0) {
        return res.status(404).json('Businesses are not found');
    }
    if (typeof(documentsAfterPagination) === 'string') {
        return res.status(500).json(documentsAfterPagination);
    }
    return res.json({documentCountBeforePagination, documentsAfterPagination});
}

async function getBusinessById(req, res) {
    const {id} = req.params;
    const business = await Business.findById(id)
        .populate('categories','name')
        .populate('orders', '_id, status');
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

    await Category.updateMany(
        {_id: {$in: deletedBusiness.categories}},
        {$pull: {businesses: deletedBusiness._id}}
    );
    return res.json(deletedBusiness); 
}

async function addCategorytoBusiness(req, res) {
    const {businessId, categoryId} = req.params;
    const existingBusiness = await Business.findById(businessId);
    const existingCategory = await Category.findById(categoryId);
    if (!existingBusiness || !existingCategory) {   
        return res.status(404).json('Business or category is not found');
    }
    existingBusiness.categories.addToSet(existingCategory._id);
    await existingBusiness.save();
    existingCategory.businesses.addToSet(existingBusiness._id);
    await existingCategory.save();

    return res.json(existingBusiness);
}

async function deleteCategoryFromBusiness(req, res) {
    const {businessId, categoryId} = req.params;
    const existingBusiness = await Business.findById(businessId);
    const existingCategory = await Category.findById(categoryId);
    if (!existingBusiness || !existingCategory) {   
        return res.status(404).json('Business or category is not found');
    }
    existingBusiness.categories.pull(existingCategory._id);
    await existingBusiness.save();
    existingCategory.businesses.pull(existingBusiness._id);
    await existingCategory.save();

    return res.json(existingBusiness);
} 

module.exports = {
    getAllBusinesses,
    getBusinessById,
    addBusiness,
    updateBusiness,
    deleteBusinessById,
    addCategorytoBusiness,
    deleteCategoryFromBusiness,
};