const express = require('express');
const {
    getAllCategories,
    getCategoryById,
    addCategory,
    updateCategory,
    deleteCategoryById
} = require('../controllers/categories');

const router = express.Router();

router.get('/', getAllCategories);

router.get('/:id', getCategoryById);

router.post('/', addCategory);

router.put('/:id', updateCategory);

router.delete('/:id', deleteCategoryById);

module.exports = router;