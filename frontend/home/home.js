document.addEventListener("DOMContentLoaded", function () {
    let map; // Google Map instance
    let geocoder; // Geocoder instance for converting addresses to coordinates
    let marker; // Marker on the map

    // Initialize Google Map
    function initMap(lat = 0, lng = 0) {
        const mapElement = document.getElementById("maps");
        if (!mapElement) {
            console.error("Google Map element not found.");
            return;
        }

        const mapOptions = {
            center: { lat, lng },
            zoom: 12,
        };

        map = new google.maps.Map(mapElement, mapOptions);
        marker = new google.maps.Marker({
            position: { lat, lng },
            map,
        });

        geocoder = new google.maps.Geocoder();
    }

    // Fetch user's location and set it on the map
    function fetchUserLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;

                    updateMap(lat, lng);

                    // Fetch location details using Google Maps API
                    const apiKey = "AIzaSyDezZNFZiRbddUtkA9NJcFrTDs5sBBVadw";
                    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;

                    try {
                        const response = await fetch(url);
                        const data = await response.json();

                        if (data.status === "OK") {
                            let town = "Unknown";
                            let state = "Unknown";

                            data.results[0].address_components.forEach((component) => {
                                if (component.types.includes("locality")) {
                                    town = component.long_name;
                                }
                                if (component.types.includes("administrative_area_level_1")) {
                                    state = component.long_name;
                                }
                            });

                            document.getElementById("locationText").innerText = `${town}, ${state}`;
                        } else {
                            document.getElementById("locationText").innerText = "Unable to fetch location details.";
                        }
                    } catch (error) {
                        console.error("Error fetching location details:", error);
                        document.getElementById("locationText").innerText = "Error fetching location details.";
                    }
                },
                (error) => {
                    console.error("Error getting geolocation:", error);
                    document.getElementById("locationText").innerText = "Geolocation is not available.";
                }
            );
        } else {
            document.getElementById("locationText").innerText = "Geolocation is not supported by this browser.";
        }
    }

    // Update the map with new coordinates
    function updateMap(lat, lng) {
        const position = { lat, lng };
        if (map) {
            map.setCenter(position);
            marker.setPosition(position);
        } else {
            initMap(lat, lng);
        }
    }

    // Fetch location suggestions from the Google Places API
    async function fetchLocationSuggestions(query) {
        const apiKey = "AIzaSyDezZNFZiRbddUtkA9NJcFrTDs5sBBVadw";
        const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${query}&key=${apiKey}`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data.status === "OK") {
                return data.predictions.map(prediction => prediction.description);
            } else {
                console.error("Error fetching location suggestions:", data.status);
                return [];
            }
        } catch (error) {
            console.error("Error fetching location suggestions:", error);
            return [];
        }
    }

    // Make location text editable
    function makeLocationEditable() {
        const locationSpan = document.getElementById('locationText');
    
        // Create a container for the input and icon
        const container = document.createElement('div');
        container.className = 'editable-location';
    
        // Create the input element
        const input = document.createElement('input');
        input.type = 'text';
        input.id = 'locationInput';
        input.value = locationSpan.innerText;
    
        // Create the magnifying glass icon
        const icon = document.createElement('img');
        icon.src = '../images/search.png';
        icon.alt = 'Search';
        icon.className = 'search';
    
        // Append the input and icon to the container
        container.appendChild(input);
        container.appendChild(icon);
    
        // Replace the span with the container
        locationSpan.replaceWith(container);
    
        // Focus the input
        input.focus();
    
        // Create and append the dropdown container
        const dropdown = document.createElement('div');
        dropdown.className = 'dropdown';
        container.appendChild(dropdown);

        // Add event listener for typing in the input
        input.addEventListener('input', async () => {
            const query = input.value.trim();
            if (query) {
                const suggestions = await fetchLocationSuggestions(query);
                dropdown.innerHTML = ''; // Clear previous suggestions
                suggestions.forEach(suggestion => {
                    const suggestionItem = document.createElement('div');
                    suggestionItem.className = 'dropdown-item';
                    suggestionItem.innerText = suggestion;
                    suggestionItem.addEventListener('click', () => {
                        input.value = suggestion;
                        dropdown.innerHTML = ''; // Clear suggestions
                    });
                    dropdown.appendChild(suggestionItem);
                });
            } else {
                dropdown.innerHTML = ''; // Clear suggestions if input is empty
            }
        });

        // Save location when the input loses focus or when Enter is pressed
        input.addEventListener('blur', saveLocation);
        input.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                saveLocation();
            }
        });
    }

    // Save the location and update the map
    function saveLocation() {
        const input = document.getElementById('locationInput');
        const newLocation = input.value;

        // Geocode the new location and update the map
        geocodeAddress(newLocation);

        // Create a new span with the updated location text
        const locationSpan = document.createElement('span');
        locationSpan.id = 'locationText';
        locationSpan.innerText = newLocation;
        locationSpan.onclick = makeLocationEditable;

        // Replace the input and icon with the span
        input.parentElement.replaceWith(locationSpan);
    }

    // Geocode the edited location text and update the map
    function geocodeAddress(address) {
        if (geocoder) {
            geocoder.geocode({ address }, (results, status) => {
                if (status === "OK" && results[0]) {
                    const location = results[0].geometry.location;
                    updateMap(location.lat(), location.lng());
                } else {
                    console.error("Geocode was not successful for the following reason:", status);
                }
            });
        }
    }

    // Initialize map and fetch user's location
    initMap();
    fetchUserLocation();

    // Attach click handler for making location editable
    document.getElementById("locationText").onclick = makeLocationEditable;
});

window.onSpotifyWebPlaybackSDKReady = () => {
    const token = 'BQBL4rdybsHeiIP2Ju0M_xXMTSI40TYkGgO3eJDT7aRwaMXBZ6nBI176Sf7h79KByCLRIDLlBbhIKMufhItg-e-NngZPYN2P5tO_h8sO2zc4eXYZC8twyVuSenfXjjed-YibFs2LbEEKH3vrNKVa0EEC7SP5lcu_LkeKZfwXnP7Y7z8Om_D6mOOec8PXWXh3vysCK1bnIZ8NCMXFCmjxVkePLccGT9biu5frIKhVbA8SIJ89jfM13dFqMT28A4nEbHegghBHf2JJ3FbqiDh9km0cI7-MpDuv_JH7Cw4r-tPJ6VuANxv03es9Esg9_TabXPBSd8vYRJae';
    
    const player = new Spotify.Player({
      name: 'Web Playback SDK Quick Start Player',
      getOAuthToken: cb => { cb(token); },
      volume: 0.5
    });

    // Ready
    player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
    });

    // Not Ready
    player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
    });

    player.addListener('initialization_error', ({ message }) => {
        console.error(message);
    });

    player.addListener('authentication_error', ({ message }) => {
        console.error(message);
    });

    player.addListener('account_error', ({ message }) => {
        console.error(message);
    });

    document.getElementById('togglePlay').onclick = function() {
        player.togglePlay();
    };

    player.connect();
}