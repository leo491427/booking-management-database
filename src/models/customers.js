const mongoose = require('mongoose');
const joi = require('@hapi/joi');

const schema = new mongoose.Schema({
    customerName :{
        type:String,
        required:true,
        lowercase: true
    },
    preferName: {
        type:String,
        lowercase: true,
        default:''       
    },
    email: {
        type:String,
        required:true,
        lowercase: true,
        validate: {
            validator: email => !joi.validate(email, joi.string().email()).error,
            msg: 'Invalid email format'
        }
    },
    phone:{
        type:Number,
        required:true,
    },
    orders: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order',
        }
    ]    
},
{
    timestamps: true,
    toJSON: {
        virtuals: true
    }
});

schema.statics.searchByFilters = async function (conditionKey, conditionValue, pageRequested, pageSize, sortKey, sortValue) {
    if (isNaN(pageSize) || parseInt(pageSize) <= 0) {
        return 'pageSize is invalid';
    }
    if (isNaN(pageRequested) || parseInt(pageRequested) <= 0) {
        return 'pageRequested is invalid';
    }
    if (parseInt(sortValue) !== 1 && parseInt(sortValue) !== -1) {
        return 'sortValue is invalid';
    }
    const data = await this.find({[conditionKey]: new RegExp(conditionValue, 'i')})
        .skip((parseInt(pageRequested)-1)*parseInt(pageSize))
        .limit(parseInt(pageSize))
        .sort({[sortKey]: parseInt(sortValue)})
        .exec();
    
    return data;
}

const model = mongoose.model('Customer', schema);

module.exports = model;