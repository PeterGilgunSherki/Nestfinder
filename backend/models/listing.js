const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
    title: { type: String, required: true }, // e.g., "Quiet Spare Room in Suburbs"
    location: { type: String, required: true }, // Should just be City/Neighborhood for safety, not full address
    spaceType: { type: String, required: true }, // e.g., "Couch", "Private Room", "In-law Suite"
    price: { type: Number, default: 0 }, // Often 0, or a small contribution
    beds: { type: Number, required: true },
    baths: { type: Number, required: true },
    maxDuration: { type: Number, required: true }, // Replacing sqft: Maximum days host can accommodate
    rules: { type: String, default: 'No smoking, pet friendly' }, // Crucial for establishing boundaries
    tag: { type: String, default: 'Emergency / Free' },
    image: { type: String, default: '' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Listing', listingSchema);