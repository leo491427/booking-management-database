const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    customerEmail: {
        type: String,
        ref: 'Customer',
        required: true,
        lowercase: true
    },
    businessEmail: {
        type: String,
        ref: 'Business',
        lowercase: true
    },
    categoryName: {
        type: String,
        ref: 'Category',
        required: true,
        lowercase: true
    },
    status: {
        type:String,
        required:true,
        lowercase: true,
        enum:['processing', 'accepted', 'finished'],
        default:'processing'
    },
    jobEstimatedTime: {
        type:Date,
    },
    jobFinishedTime: {
        type:Date,
    },
    jobLocation: {
        type:String,
        default:'',
        lowercase: true,
        required: true,
    },
    rate: {
        type:Number,      
        enum:[0, 1, 2, 3, 4, 5],
        default:5,
        validate: (rate) => {
            if (rate < 0 || rate > 5) {
                return false;
            }
            return true;
        }
    },
    comment: {
        type:String,              
        default:''
    }
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
    let data;
    if (!conditionKey) {
        //此处不可以加await，加了await得到数组而不是Query对象，无法执行后面的.limit .sort等   
        data = this.find(); 
    } else {  
        //此处不可以加await，加了await得到数组而不是Query对象，无法执行后面的.limit .sort等
        data = this.find({[conditionKey]: new RegExp(conditionValue, 'i')});       
    }
    // 为何以下无论是否有await，data在return前都是query？
    data.skip((parseInt(pageRequested)-1)*parseInt(pageSize))
        .limit(parseInt(pageSize))
        .sort({[sortKey]: parseInt(sortValue)})
        .exec();
    return data;
}

const model = mongoose.model('Order', schema);

module.exports = model;