// Configuration
const GOOGLE_PLACES_API_KEY = 'AIzaSyCrrB53GjSaOQO4PWW4-EwoyTn9LIqlbEs'; // Replace with actual API key
const SUPABASE_URL = 'https://quyilbqodqwttaplcyqv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1eWlsYnFvZHF3dHRhcGxjeXF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0NjIzMDEsImV4cCI6MjA1NzAzODMwMX0.j20Yl-zjE-OHJa-IPd7QMuYTy8G93dcFJmFYGK4f6uk';

// Cache for place details
const placeDetailsCache = new Map();

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'GET_PLACE_DETAILS') {
        getPlaceDetails(request.placeId)
            .then(details => sendResponse({ success: true, details }))
            .catch(error => sendResponse({ success: false, error: error.message }));
        return true; // Will respond asynchronously
    }
});

// Fetch place details from Google Places API
async function getPlaceDetails(placeId) {
    // Check cache first
    if (placeDetailsCache.has(placeId)) {
        return placeDetailsCache.get(placeId);
    }

    try {
        const response = await fetch(
            `https://maps.googleapis.com/maps/api/place/details/json?` +
            `place_id=${placeId}&` +
            `fields=name,rating,formatted_address,opening_hours,website,` +
            `formatted_phone_number,reviews,types,photos&` +
            `key=${GOOGLE_PLACES_API_KEY}`
        );

        const data = await response.json();
        if (data.status === 'OK') {
            const details = processPlaceDetails(data.result);
            placeDetailsCache.set(placeId, details);
            return details;
        } else {
            throw new Error('Failed to fetch place details');
        }
    } catch (error) {
        console.error('Error fetching place details:', error);
        throw error;
    }
}

// Process and enrich place details
function processPlaceDetails(place) {
    // Extract amenities from place types and reviews
    const amenities = extractAmenities(place);
    
    return {
        ...place,
        amenities,
        // Add additional processed data here
    };
}

// Extract amenities from place data
function extractAmenities(place) {
    const amenities = new Set();
    
    // Extract from types
    if (place.types) {
        place.types.forEach(type => {
            switch (type) {
                case 'cafe':
                    amenities.add('coffee');
                    break;
                case 'restaurant':
                    amenities.add('food');
                    break;
                case 'point_of_interest':
                    amenities.add('landmark');
                    break;
            }
        });
    }
    
    // Extract from reviews (if available)
    if (place.reviews) {
        place.reviews.forEach(review => {
            const text = review.text.toLowerCase();
            if (text.includes('wifi') || text.includes('wi-fi')) amenities.add('wifi');
            if (text.includes('outlet') || text.includes('plug')) amenities.add('outlets');
            if (text.includes('pet') || text.includes('dog')) amenities.add('pet-friendly');
            if (text.includes('vegan')) amenities.add('vegan-friendly');
            if (text.includes('quiet') || text.includes('study')) amenities.add('quiet');
            if (text.includes('outdoor') || text.includes('patio')) amenities.add('outdoor');
        });
    }
    
    return Array.from(amenities);
}

// Handle installation
chrome.runtime.onInstalled.addListener(() => {
    // Initialize any necessary storage or state
    chrome.storage.local.set({
        filters: [],
        lastLocation: null
    });
}); 