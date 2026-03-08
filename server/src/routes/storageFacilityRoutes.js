const express = require('express');
const router = express.Router();
const {
    getStorageFacilities,
    createStorageFacility,
    updateStorageFacility
} = require('../controllers/storageFacilityController');

router.route('/').get(getStorageFacilities).post(createStorageFacility);
router.route('/:id').put(updateStorageFacility);

module.exports = router;
