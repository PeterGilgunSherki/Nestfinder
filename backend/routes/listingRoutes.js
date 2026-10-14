const express = require('express');
const router = express.Router();
const protect = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');
const { getListings, createListing, updateListing, deleteListing } = require('../controllers/listingController');

router.get('/', getListings);
router.post('/', protect, upload.single('image'), createListing);
router.put('/:id', protect, updateListing);
router.delete('/:id', protect, deleteListing);

module.exports = router;