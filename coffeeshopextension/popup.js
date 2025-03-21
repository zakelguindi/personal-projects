import { getCurrentUser, signOut, syncLikedShops } from './auth.js';

// Configuration
const GOOGLE_PLACES_API_KEY = 'AIzaSyCrrB53GjSaOQO4PWW4-EwoyTn9LIqlbEs'; // Replace with actual API key
const SUPABASE_URL = 'https://quyilbqodqwttaplcyqv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1eWlsYnFvZHF3dHRhcGxjeXF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0NjIzMDEsImV4cCI6MjA1NzAzODMwMX0.j20Yl-zjE-OHJa-IPd7QMuYTy8G93dcFJmFYGK4f6uk';

// DOM Elements
const locationSearch = document.getElementById('locationSearch');
const searchBtn = document.getElementById('searchBtn');
const searchSuggestions = document.getElementById('searchSuggestions');
const cardContainer = document.getElementById('cardContainer');
const loadingIndicator = document.getElementById('loading');
const noResults = document.getElementById('noResults');
const likedShopsBtn = document.getElementById('likedShopsBtn');
const likedShopsModal = document.getElementById('likedShopsModal');
const closeLikedShopsBtn = document.getElementById('closeLikedShopsBtn');
const visitModal = document.getElementById('visitModal');
const ratingModal = document.getElementById('ratingModal');
const yesVisitBtn = document.getElementById('yesVisitBtn');
const noVisitBtn = document.getElementById('noVisitBtn');
const submitRatingBtn = document.getElementById('submitRatingBtn');
const ratingStars = document.querySelectorAll('.rating-stars i');

// State
let currentLocation = null;
let currentResults = [];
let currentCardIndex = 0;
let likedShops = [];
let currentShop = null;
let currentRating = 0;

// Event Listeners
document.addEventListener('DOMContentLoaded', async () => {
    // Check authentication
    const user = await getCurrentUser();
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    // Load liked shops from storage
    chrome.storage.local.get(['likedShops'], (result) => {
        if (result.likedShops) {
            likedShops = result.likedShops;
            // Sync liked shops with the database
            syncLikedShops(likedShops);
        }
    });

    // Search input handler
    let searchTimeout;
    locationSearch.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        const query = e.target.value.trim();
        
        if (query.length >= 2) {
            searchTimeout = setTimeout(() => searchCities(query), 300);
        } else {
            searchSuggestions.style.display = 'none';
        }
    });

    // Search button handler
    searchBtn.addEventListener('click', () => {
        const query = locationSearch.value.trim();
        if (query) {
            searchByCity(query);
        }
    });

    // Modal handlers
    likedShopsBtn.addEventListener('click', showLikedShops);
    closeLikedShopsBtn.addEventListener('click', () => likedShopsModal.classList.add('hidden'));
    yesVisitBtn.addEventListener('click', showRatingModal);
    noVisitBtn.addEventListener('click', () => visitModal.classList.add('hidden'));
    submitRatingBtn.addEventListener('click', submitRating);

    // Rating stars handler
    ratingStars.forEach(star => {
        star.addEventListener('click', () => {
            const rating = parseInt(star.dataset.rating);
            setRating(rating);
        });
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') swipeLeft();
        if (e.key === 'ArrowRight') swipeRight();
    });
});

// Search Functions
async function searchCities(query) {
    try {
        const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?` +
            `address=${encodeURIComponent(query)}&` +
            `key=${GOOGLE_PLACES_API_KEY}`
        );
        const data = await response.json();
        
        if (data.status === 'OK') {
            displayCitySuggestions(data.results);
        }
    } catch (error) {
        console.error('Error searching cities:', error);
    }
}

function displayCitySuggestions(results) {
    searchSuggestions.innerHTML = results
        .map(result => `
            <div class="suggestion-item" data-lat="${result.geometry.location.lat}" data-lng="${result.geometry.location.lng}">
                ${result.formatted_address}
            </div>
        `)
        .join('');
    
    searchSuggestions.style.display = 'block';

    // Add click handlers to suggestions
    document.querySelectorAll('.suggestion-item').forEach(item => {
        item.addEventListener('click', () => {
            const lat = parseFloat(item.dataset.lat);
            const lng = parseFloat(item.dataset.lng);
            currentLocation = { lat, lng };
            locationSearch.value = item.textContent;
            searchSuggestions.style.display = 'none';
            searchNearbyPlaces();
        });
    });
}

async function searchByCity(cityName) {
    try {
        const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?` +
            `address=${encodeURIComponent(cityName)}&` +
            `key=${GOOGLE_PLACES_API_KEY}`
        );
        const data = await response.json();
        
        if (data.status === 'OK' && data.results.length > 0) {
            const location = data.results[0].geometry.location;
            currentLocation = {
                lat: location.lat,
                lng: location.lng
            };
            searchNearbyPlaces();
        }
    } catch (error) {
        console.error('Error searching city:', error);
    }
}

async function searchNearbyPlaces() {
    if (!currentLocation) return;

    loadingIndicator.classList.remove('hidden');
    noResults.classList.add('hidden');
    cardContainer.innerHTML = '';

    try {
        const response = await fetch(
            `https://maps.googleapis.com/maps/api/place/nearbysearch/json?` +
            `location=${currentLocation.lat},${currentLocation.lng}&` +
            `radius=5000&` +
            `type=cafe&` +
            `key=${GOOGLE_PLACES_API_KEY}`
        );
        const data = await response.json();

        if (data.status === 'OK' && data.results.length > 0) {
            currentResults = data.results;
            currentCardIndex = 0;
            displayNextCard();
        } else {
            noResults.classList.remove('hidden');
        }
    } catch (error) {
        console.error('Error searching places:', error);
    } finally {
        loadingIndicator.classList.add('hidden');
    }
}

// Card Functions
function displayNextCard() {
    if (currentCardIndex >= currentResults.length) {
        cardContainer.innerHTML = '<p>No more coffee shops to show.</p>';
        return;
    }

    const place = currentResults[currentCardIndex];
    const card = createCard(place);
    cardContainer.innerHTML = '';
    cardContainer.appendChild(card);
    setupCardInteractions(card);
}

function createCard(place) {
    const card = document.createElement('div');
    card.className = 'coffee-card';
    card.dataset.placeId = place.place_id;

    const photoUrl = place.photos ? 
        `https://maps.googleapis.com/maps/api/place/photo?` +
        `maxwidth=400&` +
        `photo_reference=${place.photos[0].photo_reference}&` +
        `key=${GOOGLE_PLACES_API_KEY}` : 
        'https://via.placeholder.com/400x200?text=No+Image';

    const distance = calculateDistance(currentLocation, place.geometry.location);

    card.innerHTML = `
        <img src="${photoUrl}" alt="${place.name}" class="card-image">
        <div class="card-content">
            <h3 class="card-title">${place.name}</h3>
            <div class="card-details">
                ${place.rating ? `⭐ ${place.rating}` : ''} • ${distance.toFixed(1)} km
            </div>
            <div class="card-actions">
                <button class="action-button" onclick="openInMaps('${place.place_id}')">
                    <i class="fas fa-map-marker-alt"></i>
                </button>
                <button class="action-button" onclick="swipeLeft()">
                    <i class="fas fa-times"></i>
                </button>
                <button class="action-button" onclick="swipeRight()">
                    <i class="fas fa-heart"></i>
                </button>
            </div>
        </div>
    `;

    return card;
}

function setupCardInteractions(card) {
    let startX = 0;
    let currentX = 0;
    let isDragging = false;

    card.addEventListener('mousedown', (e) => {
        startX = e.clientX;
        isDragging = true;
        card.classList.add('swiping');
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        
        currentX = e.clientX - startX;
        const rotation = currentX * 0.1;
        card.style.transform = `translateX(${currentX}px) rotate(${rotation}deg)`;
    });

    document.addEventListener('mouseup', () => {
        if (!isDragging) return;
        isDragging = false;
        card.classList.remove('swiping');

        if (Math.abs(currentX) > 100) {
            if (currentX > 0) {
                swipeRight();
            } else {
                swipeLeft();
            }
        } else {
            card.style.transform = '';
        }
    });
}

function swipeLeft() {
    const card = document.querySelector('.coffee-card');
    if (!card) return;

    card.classList.add('swiped-left');
    setTimeout(() => {
        currentCardIndex++;
        displayNextCard();
    }, 300);
}

function swipeRight() {
    const card = document.querySelector('.coffee-card');
    if (!card) return;

    card.classList.add('swiped-right');
    setTimeout(() => {
        const place = currentResults[currentCardIndex];
        likedShops.push(place);
        chrome.storage.local.set({ likedShops });
        // Sync the new liked shop with the database
        syncLikedShops([place]);
        currentCardIndex++;
        displayNextCard();
        showVisitModal(place);
    }, 300);
}

// Modal Functions
function showVisitModal(place) {
    currentShop = place;
    visitModal.classList.remove('hidden');
}

function showRatingModal() {
    visitModal.classList.add('hidden');
    ratingModal.classList.remove('hidden');
    setRating(0);
}

function setRating(rating) {
    currentRating = rating;
    ratingStars.forEach(star => {
        const starRating = parseInt(star.dataset.rating);
        star.classList.toggle('active', starRating <= rating);
    });
}

async function submitRating() {
    if (!currentShop || !currentRating) return;

    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/ratings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_ANON_KEY
            },
            body: JSON.stringify({
                place_id: currentShop.place_id,
                rating: currentRating,
                timestamp: new Date().toISOString()
            })
        });

        if (!response.ok) throw new Error('Failed to submit rating');
        
        ratingModal.classList.add('hidden');
        currentShop = null;
        currentRating = 0;
    } catch (error) {
        console.error('Error submitting rating:', error);
        alert('Failed to submit rating. Please try again.');
    }
}

function showLikedShops() {
    const likedShopsList = document.getElementById('likedShopsList');
    likedShopsList.innerHTML = likedShops
        .map(shop => `
            <div class="liked-shop-item">
                <div>
                    <h4>${shop.name}</h4>
                    <small>${shop.rating ? `⭐ ${shop.rating}` : ''}</small>
                </div>
                <button class="action-button" onclick="openInMaps('${shop.place_id}')">
                    <i class="fas fa-map-marker-alt"></i>
                </button>
            </div>
        `)
        .join('');
    
    likedShopsModal.classList.remove('hidden');
}

// Utility Functions
function calculateDistance(loc1, loc2) {
    const R = 6371; // Earth's radius in km
    const dLat = toRad(loc2.lat - loc1.lat);
    const dLon = toRad(loc2.lng - loc1.lng);
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(toRad(loc1.lat)) * Math.cos(toRad(loc2.lat)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

function toRad(degrees) {
    return degrees * (Math.PI/180);
}

function openInMaps(placeId) {
    window.open(`https://www.google.com/maps/place/?q=place_id:${placeId}`, '_blank');
} 