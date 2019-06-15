const express = require('express');
const {
    getAllBusinesses,
    getBusinessById,
    addBusiness,
    updateBusiness,
    deleteBusinessById
} = require('../controllers/businesses');

const router = express.Router();

router.get('/', getAllBusinesses);

router.get('/:id', getBusinessById);

router.post('/', addBusiness);

router.put('/:id', updateBusiness);

router.delete('/:id', deleteBusinessById);

module.exports = router;