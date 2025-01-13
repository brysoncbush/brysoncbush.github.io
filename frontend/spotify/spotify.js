const CLIENT_ID = 'b0f154bb4e844ed6b47aa014572f1bfc';
const CLIENT_SECRET = '03c070ad60e84d04a5857d1c99e35a47';
const REDIRECT_URI = 'https://brysoncbush.github.io';
const SCOPES = 'user-read-playback-state user-modify-playback-state streaming'; // Define necessary scopes

// OAuth authorization URL
const authURL = `https://accounts.spotify.com/authorize?response_type=token&client_id=${CLIENT_ID}&scope=${encodeURIComponent(SCOPES)}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;

document.getElementById('login').onclick = () => {
    window.location = authURL;  // Redirect to Spotify login
};

// Handle Spotify callback and extract token
function getAccessTokenFromUrl() {
    const params = new URLSearchParams(window.location.hash.substr(1));
    return params.get('access_token');
}

window.onSpotifyWebPlaybackSDKReady = () => {
    const accessToken = getAccessTokenFromUrl();
    
    if (!accessToken) {
        console.error('No access token found. Please log in to Spotify.');
        return;
    } else {
        console.log('Access token created successfully.');
    }

    const player = new Spotify.Player({
        name: 'Web Playback SDK Quick Start Player',
        getOAuthToken: cb => { cb(accessToken); },
        volume: 0.5
    });

    player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
        document.getElementById('togglePlay').disabled = false;  // Enable play button
    });

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
};