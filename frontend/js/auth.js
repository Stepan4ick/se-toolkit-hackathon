// Authentication utilities
const AUTH_KEY = 'lf_auth';

function getAuth() {
    const data = localStorage.getItem(AUTH_KEY);
    return data ? JSON.parse(data) : null;
}

function setAuth(token, user) {
    localStorage.setItem(AUTH_KEY, JSON.stringify({ token, user }));
}

function clearAuth() {
    localStorage.removeItem(AUTH_KEY);
}

function isLoggedIn() {
    return !!getAuth();
}

function isAdmin() {
    const auth = getAuth();
    return auth && auth.user && auth.user.role === 'admin';
}

function getAuthToken() {
    const auth = getAuth();
    return auth ? auth.token : null;
}

async function apiAuthFetch(url, options = {}) {
    const token = getAuthToken();
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await fetch(url, { ...options, headers });
    return response;
}
