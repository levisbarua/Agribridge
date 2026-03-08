const TransportRequest = require('../models/TransportRequest');

// @desc    Fetch all transport requests
// @route   GET /api/transport-requests
const getTransportRequests = async (req, res) => {
    try {
        const requests = await TransportRequest.find({});
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: 'Server err', error: error.message });
    }
};

// @desc    Create a transport request
// @route   POST /api/transport-requests
const createTransportRequest = async (req, res) => {
    try {
        const {
            farmerId, farmerName, origin, destination,
            originCoords, destinationCoords, goodsType,
            weightKg, priceOffer
        } = req.body;

        const request = new TransportRequest({
            farmerId,
            farmerName,
            origin,
            destination,
            originCoords,
            destinationCoords,
            goodsType,
            weightKg,
            priceOffer
        });

        const createdRequest = await request.save();
        res.status(201).json(createdRequest);
    } catch (error) {
        res.status(500).json({ message: 'Server err', error: error.message });
    }
};

// @desc    Update a transport request status
// @route   PUT /api/transport-requests/:id
const updateTransportRequest = async (req, res) => {
    try {
        const { status, assignedProviderId, assignedProviderName } = req.body;
        const request = await TransportRequest.findById(req.params.id);

        if (request) {
            if (status) request.status = status;
            if (assignedProviderId) request.assignedProviderId = assignedProviderId;
            if (assignedProviderName) request.assignedProviderName = assignedProviderName;

            const updatedReq = await request.save();
            res.json(updatedReq);
        } else {
            res.status(404).json({ message: 'Request not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server err', error: error.message });
    }
};

module.exports = {
    getTransportRequests,
    createTransportRequest,
    updateTransportRequest
};
