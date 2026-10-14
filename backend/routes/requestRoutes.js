const express = require('express');
const router = express.Router();
const Request = require('../models/request');
const Listing = require('../models/listing');

// POST /api/requests - Seeker sends request
router.post('/', async (req, res) => {
    try {
        const { listingId, message, seekerId } = req.body;
        const listing = await Listing.findById(listingId);
        if (!listing) return res.status(404).json({ message: 'Listing not found' });

        const newRequest = new Request({
            listing: listingId,
            seeker: seekerId,
            host: listing.user || listing.host,
            message: message || 'I need support and would like to connect.'
        });

        await newRequest.save();
        res.status(201).json({ message: 'Support request sent successfully!', request: newRequest });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/requests/host/:hostId - Host views incoming requests
router.get('/host/:hostId', async (req, res) => {
    try {
        const requests = await Request.find({ host: req.params.hostId })
            .populate('seeker', 'email role')
            .populate('listing', 'title location');
        res.json(requests);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;