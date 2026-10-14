const Listing = require('../models/listing');

// Complete CRUD logic[cite: 1]
exports.getListings = async (req, res, next) => {
    try {
        const listings = await Listing.find();
        res.status(200).json(listings);
    } catch (err) {
        next(err);
    }
};

exports.createListing = async (req, res) => {
    try {
        const { title, location, spaceType, price, beds, baths, maxDuration, rules, image } = req.body;

        const newListing = await Listing.create({
            title,
            location,
            spaceType,
            price,
            beds,
            baths,
            maxDuration,
            rules,
            image: image || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=500&q=80', // Fallback default image
            user: req.user.id
        });

        res.status(201).json(newListing);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateListing = async (req, res, next) => {
    try {
        const updated = await Listing.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updated);
    } catch (err) {
        next(err);
    }
};

exports.deleteListing = async (req, res, next) => {
    try {
        await Listing.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Listing removed successfully' });
    } catch (err) {
        next(err);
    }
};