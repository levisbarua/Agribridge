const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    farmerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    farmerName: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        enum: ['Vegetables', 'Fruits', 'Grains', 'Tubers'],
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    unit: {
        type: String,
        default: 'kg',
    },
    quantity: {
        type: Number,
        required: true,
    },
    harvestDate: {
        type: Date,
        required: true,
    },
    description: {
        type: String,
        default: '',
    },
    imageUrl: {
        type: String,
        default: '',
    },
    location: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
