const express = require('express');
const {
    getAllUsers,
    getUserById,
    addUser,
    updateUser,
    deleteUser
} = require('../controllers/users');
const authGuard = require('../middleware/authGuard');

const router = express.Router();

// 是否需要添加更多user操作，比如put用于更新密码？
router.get('/', getAllUsers);

router.get('/:id', getUserById);

router.post('/', addUser);

router.put('/:id', updateUser);

router.delete('/:id', deleteUser);

module.exports = router;