const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    customerEmail: 
        {
        type: String,
        ref: 'Customer',
        required: true,
        },
    businessEmail: {
        type: String,
        ref: 'Business',

    },
    categoryName: {
        type: String,
        ref: 'Category',
        required: true,
    },
    status: {
        type:String,
        required:true,
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

const model = mongoose.model('Order', schema);

module.exports = model;