
const bcrypt = require('bcrypt');
const User = require('../models/users');
const {generateToken} = require('../utils/jwt');
const errorHandler = require('../middleware/errorHandler');

async function getAllUsers (req, res) {
    const allUsers = await User.find().exec();
    if (!allUsers) {
        return res.status(404).json('users are not found');
    }
    return res.json(allUsers);
}

async function getUserById (req, res) {
    const {id} = req.params;
    const user = await User.findById(id);
    if (!user) {
        return res.status(404).json('user is not found');
    }
    return res.json(user);
}

async function addUser (req, res) {
    const {name, password} = req.body;

    const existingUser = await User.findOne({name});
    if (existingUser) {
        return res.status(400).json('user has already existed');
    }
    const hashPassword = bcrypt.hashSync(password, 10);
    const user = new User({
        name,
        hashPassword
    });
    if (!user) {
        return res.status(500).json('adding user failed');
    }
    await user.save();

    const token = generateToken(user._id);

    return res.json({name, token});
}

async function updateUser(req, res) {
    const {id} = req.params;
    const {name, password} = req.body;

    const existingUser = await User.findById(id);
    if (name !== existingUser.name) {
        return res.status(400).json('username cannot be changed');
    }

    const hashPassword = bcrypt.hashSync(password, 10);
    const updatedUser = await User.findByIdAndUpdate(id, {name, hashPassword}, {new: true});
    if (!updatedUser) {
        return res.status(404).json('updating user failed');
    }
    return res.json(updatedUser); 
}

async function deleteUser(req, res, next) {
    const {id} = req.params;

    //    const deletedUser = await User.findByIdAndDelete(id);
    let deletedUser; // 此处尝试用try catch 实现返回错误给errorHandler
    try {
        deletedUser = await User.findByIdAndDelete(id);
    } catch (error) {
        return next (error);
    }

    if (!deletedUser) {
        return res.status(404).json('deleting user failed');
    }
    return res.json(deletedUser);
}

async function loginUser(req, res) {
    const {name, password} = req.body;
    const existingUser = await User.findOne({name});
    if (!existingUser) {
        return res.status(401).json('Invalid username');
    }

    const isValidPassword = await bcrypt.compareSync(password, existingUser.hashPassword);
    if (!isValidPassword) {
        return res.status(401).json('Invalid password');
    }

    const token = generateToken(existingUser._id);

    res.data = {};
    res.data.usertoken = {name, token};

    console.log(res.data);
    // console.log(res.usertoken.token);

    return res.json({name, token});
}

module.exports = {
    getAllUsers,
    getUserById,
    addUser,
    updateUser,
    deleteUser,
    loginUser
};