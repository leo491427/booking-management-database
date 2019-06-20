const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    name: {
        type:String,
        required:true,        
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

const model = mongoose.model('Category', schema);

module.exports = model;