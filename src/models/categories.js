const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    name: {
        type:String,
        required:true,
        lowercase: true,      
    },
    description: {
        type:String,       
        default:''
    },
    businesses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Business',
        }
    ],
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

const model = mongoose.model('Category', schema);

module.exports = model;