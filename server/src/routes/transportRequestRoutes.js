const express = require('express');
const router = express.Router();
const {
    getTransportRequests,
    createTransportRequest,
    updateTransportRequest
} = require('../controllers/transportRequestController');

router.route('/').get(getTransportRequests).post(createTransportRequest);
router.route('/:id').put(updateTransportRequest);

module.exports = router;
