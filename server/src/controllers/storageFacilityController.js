const StorageFacility = require('../models/StorageFacility');

// @desc    Fetch all storage facilities
// @route   GET /api/storage
const getStorageFacilities = async (req, res) => {
    try {
        const facilities = await StorageFacility.find({});
        res.json(facilities);
    } catch (error) {
        res.status(500).json({ message: 'Server err', error: error.message });
    }
};

// @desc    Create a storage facility
// @route   POST /api/storage
const createStorageFacility = async (req, res) => {
    try {
        const {
            ownerId, name, type, location, capacityKg,
            availableKg, pricePerKgDaily, temperature, imageUrl
        } = req.body;

        const facility = new StorageFacility({
            ownerId,
            name,
            type,
            location,
            capacityKg,
            availableKg,
            pricePerKgDaily,
            temperature,
            imageUrl
        });

        const createdFacility = await facility.save();
        res.status(201).json(createdFacility);
    } catch (error) {
        res.status(500).json({ message: 'Server err', error: error.message });
    }
};

// @desc    Update storage facility (e.g. available capacity)
// @route   PUT /api/storage/:id
const updateStorageFacility = async (req, res) => {
    try {
        const { availableKg } = req.body;
        const facility = await StorageFacility.findById(req.params.id);

        if (facility) {
            if (typeof availableKg === 'number') {
                facility.availableKg = availableKg;
            }

            const updatedFacility = await facility.save();
            res.json(updatedFacility);
        } else {
            res.status(404).json({ message: 'Facility not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server err', error: error.message });
    }
};

module.exports = {
    getStorageFacilities,
    createStorageFacility,
    updateStorageFacility
};
