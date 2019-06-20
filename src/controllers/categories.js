const Category = require('../models/categories');
const Business = require('../models/businesses');

async function getAllCategories(req, res) {
    const allCategories = await Category.find().exec();
    if (!allCategories) {
        return res.status(404).json('categories are not found');
    }
    return res.json(allCategories);
}

// populate business data
async function getCategoryById(req, res) {
    const {id} = req.params;
    const category = await Category.findById(id)
        .populate('businesses','businessName')
        .populate('orders', '_id, status');
    if (!category) {
        return res.status(404).json('category is not found');
    }
    return res.json(category);
}

async function addCategory(req, res) {
    const {name, description} = req.body;
    const existingName = await Category.findOne({name});
    if (existingName) {
        return res.status(400).json('Category name has already existed');
    }
    const category = new Category({
        name,
        description
    });
    if (!category) {
        return res.status(500).json('adding category failed');
    }
    await category.save();
    return res.json(category);
}

async function updateCategory(req, res) {
    const {id} = req.params;
    const {name, description} = req.body;
    const updatedCategory = await Category.findByIdAndUpdate(id, {name, description}, {new: true});
    if (!updatedCategory) {
        return res.status(404).json('updating category failed');
    }
    return res.json(updatedCategory);
}

async function deleteCategoryById(req, res) {
    const {id} = req.params;
    const deletedCategory = await Category.findByIdAndDelete(id);
    if (!deletedCategory) {
        return res.status(404).json('deleting category failed');
    }

    await Business.updateMany(
        {_id: {$in: deletedCategory.businesses}},
        {$pull: {categories: deletedCategory._id}}
    );

    return res.json(deletedCategory);
}

async function addBusinesstoCategory(req, res) {
    const {categoryId, businessId} = req.params;
    const existingCategory = await Category.findById(categoryId);
    const existingBusiness = await Business.findById(businessId);
    if (!existingCategory || !existingBusiness) {   
        return res.status(404).json('Category or business is not found');
    }
    existingCategory.businesses.addToSet(existingBusiness._id);
    await existingCategory.save();
    existingBusiness.categories.addToSet(existingCategory._id);
    await existingBusiness.save();

    return res.json(existingCategory);
}

async function deleteBusinessFromCategory(req, res) {
    const {categoryId, businessId} = req.params;
    const existingCategory = await Category.findById(categoryId);
    const existingBusiness = await Business.findById(businessId);
    if (!existingCategory || !existingBusiness) {   
        return res.status(404).json('Category or business is not found');
    }
    existingCategory.businesses.pull(existingBusiness._id);
    await existingCategory.save();
    existingBusiness.categories.pull(existingCategory._id);
    await existingBusiness.save();

    return res.json(existingCategory);
} 

module.exports = {
    getAllCategories,
    getCategoryById,
    addCategory,
    updateCategory,
    deleteCategoryById,
    addBusinesstoCategory,
    deleteBusinessFromCategory
};