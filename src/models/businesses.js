const mongoose = require('mongoose');
const joi = require('@hapi/joi');

const schema = new mongoose.Schema({
    businessName: {
        type:String,
        required:true
    },
    ABN: {
        type:Number,  
        required:true,
        default:''      
    },
    email: {
        type:String,
        required:true,
        validate: {
            validator: email => !joi.validate(email, joi.string().email()).error,
            msg: 'Invalid email format'
        }
    },
    phone: {
        type:Number,
        required:true
    },
    streeAddress: {
        type:String,
        required:true,
        default:''
    },
    postcode: {
        type:Number,
        required:true
    },
    state: {
        type:String,
        required:true,
        enum: ['NSW', 'VIC', 'QLD', 'WA', 'TAS','SA','ACT', 'NT'], 
    },
    rate: {
        type:Number,        
    },
},
{
    timestamps: true,
    toJSON: {
        virtuals: true
    }
});

const model = mongoose.model('Business', schema);

module.exports = model;