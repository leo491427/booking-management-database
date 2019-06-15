const Category = require('../models/categories');

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
    const category = await Category.findById(id);
    if (!category) {
        return res.status(404).json('category is not found');
    }
    return res.json(category);
}

async function addCategory(req, res) {
    const {name, description} = req.body;
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
    return res.json(deletedCategory);
}

module.exports = {
    getAllCategories,
    getCategoryById,
    addCategory,
    updateCategory,
    deleteCategoryById
};