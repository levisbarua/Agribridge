const mongoose = require('mongoose');

const transportRequestSchema = new mongoose.Schema({
    farmerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    farmerName: {
        type: String,
        required: true,
    },
    origin: {
        type: String,
        required: true,
    },
    destination: {
        type: String,
        required: true,
    },
    originCoords: {
        type: [Number], // [latitude, longitude]
        default: [0, 0],
    },
    destinationCoords: {
        type: [Number], // [latitude, longitude]
        default: [0, 0],
    },
    goodsType: {
        type: String,
        required: true,
    },
    weightKg: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['PENDING', 'ACCEPTED', 'COMPLETED', 'CANCELLED'],
        default: 'PENDING',
    },
    priceOffer: {
        type: Number,
        required: true,
    },
    assignedProviderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // A user with LOGISTICS role
    },
    assignedProviderName: {
        type: String,
    },
}, {
    timestamps: true,
});

const TransportRequest = mongoose.model('TransportRequest', transportRequestSchema);
module.exports = TransportRequest;
