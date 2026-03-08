const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    buyerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    farmerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    productName: {
        type: String,
        required: true,
    },
    amount: {
        type: Number, // Total price/cost
        required: true,
    },
    status: {
        type: String,
        enum: ['PROCESSING', 'SHIPPED', 'DELIVERED'],
        default: 'PROCESSING',
    },
    date: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
