const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    sku:{
        type: String,
        required: true,
        unique: true,
        immutable: true,
    },
    name:{
        type: String,
        required: true,
        trim: true
    },
    description:{
        type: String,
    },
    category:{
        type: String,
        required: true,
        trim: true
    },
    type:{
        type: String,
        required: true,
        enum: ['public', 'private'],
        default: 'public'
    },
    price:{
        type: Number,
        required: true,
    },
    discountPrice:{
        type: Number
    },
    quantity:{
        type: Number,
        required: true,
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    updatedAt:{
        type: Date,
        default: Date.now
    }
},{ timestamps: true });

module.exports = mongoose.model('Product', productSchema);