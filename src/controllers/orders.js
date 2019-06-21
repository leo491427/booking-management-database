const Order = require('../models/orders');
const Customer = require('../models/customers');
const Business = require('../models/businesses');
const Category = require('../models/categories');

async function getAllOrders(req, res) {
    const {conditionKey, conditionValue, pageRequested = 1, pageSize = 5, sortKey = 'createdAt', sortValue = 1} = req.body;
    
    let documentCountBeforePagination;
    if (!conditionKey) {
        documentCountBeforePagination = await Order.countDocuments();
    } else {  
        documentCountBeforePagination = await Order.countDocuments({[conditionKey]: new RegExp(conditionValue, 'i')});
    }
    console.log(documentCountBeforePagination);
    
    const documentsAfterPagination = await Order.searchByFilters(conditionKey, conditionValue, pageRequested, pageSize, sortKey, sortValue);
    if (!documentsAfterPagination || documentsAfterPagination.length === 0) {
        return res.status(404).json('Orders are not found');
    }
    if (typeof(documentsAfterPagination) === 'string') {
        return res.status(500).json(documentsAfterPagination);
    }
    return res.json({documentCountBeforePagination, documentsAfterPagination});   
}

// populate business data
async function getOrderById(req, res) {
    const {id} = req.params;
    const order = await Order.findById(id)
        .populate('customer', 'customerName, email, phone')
        .populate('business', 'businessName, email, phone')
        .populate('category', 'name');
    if (!order) {
        return res.status(404).json('order is not found');
    }
    return res.json(order);
}

async function addOrder(req, res) {
    const {customerEmail, businessEmail, categoryName, status, jobEstimatedTime, jobFinishedTime, jobLocation, rate, comment} = req.body;
    const order = new Order({
        customerEmail,
        businessEmail,
        categoryName,
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
    
    const existingCustomer = await Customer.findOne({email:customerEmail});
    if (!existingCustomer) {
        return res.status(404).json(`Customer is not found`);
    }
    const existingCategory = await Category.findOne({name:categoryName});
    if (!existingCategory) {
        return res.status(404).json(`Category is not found`);
    }
    if (businessEmail) {
        const existingBusiness = await Business.findOne({email:businessEmail});
        if (!existingBusiness) {
        return res.status(404).json(`Business is not found`);
        }
        existingBusiness.orders.addToSet(order._id);
        await existingBusiness.save(); 
    }
    existingCustomer.orders.addToSet(order._id);
    await existingCustomer.save();
    existingCategory.orders.addToSet(order._id);
    await existingCategory.save();

    await order.save();
    return res.json(order);
}
    
   
    
    // if (customerEmail) {
    //     console.log(customerEmail);
    //     const existingCustomer = await Customer.findOne({email:customerEmail});
    //     if (!existingCustomer) {return res.status(404).json(`Customer is not found`);}
    //     console.log(existingCustomer.orders);
    //     console.log(order.customer);
    //     order.customer.addToSet(customerEmail);
    //     existingCustomer.orders.addToSet(order._id);
    //     await order.save();
    //     await existingCustomer.save();
    //     //await addAssociatedInfo(order, 'customer', Customer, 'email', customerEmail);
    // }
    // if (businessEmail) {
    //     await addAssociatedInfo(order, business, Business, email, businessEmail);
    // }
    // if (categoryName) {
    //     await addAssociatedInfo(order, category, Category, name, categoryName);
    // }

    // return res.json(order);


// async function addAssociatedInfo(sourceDocument, sourceKey, TargetDatabase, associatedKey, associatedValue) {

//     const existingItemInTarget = await TargetDatabase.findOne({[associatedKey]: associatedValue});
//     if (!existingItemInTarget) {
//         return res.status(404).json(`${TargetDatabase} is not found`);
//     }
//     console.log(sourceDocument);
//     console.log(sourceKey);
//     order.customer.addToSet(customerEmail);
//     //sourceDocument[sourceKey].addToSet(associatedValue);
//     await sourceDocument.save();
//     existingItemInTarget[orders].addToSet(sourceDocument._id);
//     await existingItemInTarget.save();
// }

// 当order更新时，如果没status数据，会被置为null
async function updateOrder(req, res) {
    const {id} = req.params;
    const {businessEmail, categoryName, status, jobEstimatedTime, jobFinishedTime, jobLocation, rate, comment} = req.body;
    const existingOrder = await Order.findById(id);
    if (!existingOrder) {
        return res.status(404).json('Order is not found');
    }

    if (businessEmail && businessEmail !== existingOrder.businessEmail) {
        const existingBusiness = await Business.findOne({email:businessEmail});
        if (!existingBusiness) {
            return res.status(404).json(`Business is not found`);
        }
        const previousBusiness = await Business.findOne({email: existingOrder.businessEmail});
        if (previousBusiness) {
            previousBusiness.orders.pull(existingOrder._id);
            await previousBusiness.save();
        }
        existingBusiness.orders.addToSet(existingOrder._id);
        await existingBusiness.save(); 
    } else if (!businessEmail){
        const previousBusiness = await Business.findOne({email: existingOrder.businessEmail});
        if (previousBusiness) {
            previousBusiness.orders.pull(existingOrder._id);
            await previousBusiness.save();
        }
    }

    if (categoryName && categoryName !== existingOrder.categoryName) {
        const existingCategory = await Category.findOne({name:categoryName});
        if (!existingCategory) {
            return res.status(404).json(`Category is not found`);
        }
        const previousCategory = await Category.findOne({name:existingOrder.categoryName});
        if (previousCategory) {
            previousCategory.orders.pull(existingOrder._id);
            await previousCategory.save();
        }
        existingCategory.orders.addToSet(existingOrder._id);
        await existingCategory.save();
    }

    const updatedOrder = await Order.findByIdAndUpdate(id,
        {businessEmail, categoryName, status, jobEstimatedTime, jobFinishedTime, jobLocation, rate, comment},
        {runValidators: true, new: true});
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

    await Customer.updateMany(
        {email: {$in: deletedOrder.customerEmail}},
        {$pull: {orders: deletedOrder._id}}
    )
    await Business.updateMany(
        {email: {$in: deletedOrder.businessEmail}},
        {$pull: {orders: deletedOrder._id}}
    )
    await Category.updateMany(
        {name: {$in: deletedOrder.categoryName}},
        {$pull: {orders: deletedOrder._id}}
    )

    return res.json(deletedOrder);
}




module.exports = {
    getAllOrders,
    getOrderById,
    addOrder,
    updateOrder,
    deleteOrderById
};