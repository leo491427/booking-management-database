const Order = require('../models/orders');

async function getAllOrders(req, res) {
    const allOrders = await Order.find().exec();
    if (!allOrders) {
        return res.status(404).json('orders are not found');
    }
    return res.json(allOrders);
}

// populate business data
async function getOrderById(req, res) {
    const {id} = req.params;
    const order = await Order.findById(id);
    if (!order) {
        return res.status(404).json('order is not found');
    }
    return res.json(order);
}

async function addOrder(req, res) {
    const {status, jobEstimatedTime, jobFinishedTime, jobLocation, rate, comment} = req.body;
    const order = new Order({
        status,
        jobEstimatedTime,
        jobFinishedTime,
        jobLocation,
        rate,
        comment
    });
    if (!order) {
        return res.status(500).json('adding order failed');
    }
    await order.save();
    return res.json(order);
}

// 当order更新时，如果没status数据，会被置为null, 如果有status数据也不会检查是否是三种格式之一
async function updateOrder(req, res) {
    const {id} = req.params;
    const {status, jobEstimatedTime, jobFinishedTime, jobLocation, rate, comment} = req.body;
    const updatedOrder = await Order.findByIdAndUpdate(id, {status, jobEstimatedTime, jobFinishedTime, jobLocation, rate, comment}, {runValidators: true, new: true});
    if (!updatedOrder) {
        return res.status(404).json('updating order failed');
    }
    return res.json(updatedOrder);
}

async function deleteOrderById(req, res) {
    const {id} = req.params;
    const deletedOrder = await Order.findByIdAndDelete(id);
    if (!deletedOrder) {
        return res.status(404).json('deleting order failed');
    }
    return res.json(deletedOrder);
}

module.exports = {
    getAllOrders,
    getOrderById,
    addOrder,
    updateOrder,
    deleteOrderById
};