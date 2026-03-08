const mongoose = require('mongoose');

const storageFacilitySchema = new mongoose.Schema({
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['COLD_ROOM', 'WAREHOUSE', 'SILO'],
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    capacityKg: {
        type: Number,
        required: true,
    },
    availableKg: {
        type: Number,
        required: true,
    },
    pricePerKgDaily: {
        type: Number,
        required: true,
    },
    temperature: {
        type: Number, // Applicable for cold rooms
    },
    imageUrl: {
        type: String,
        default: '',
    },
}, {
    timestamps: true,
});

const StorageFacility = mongoose.model('StorageFacility', storageFacilitySchema);
module.exports = StorageFacility;
