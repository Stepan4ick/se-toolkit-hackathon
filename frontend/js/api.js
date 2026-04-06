// API base URL
const API_BASE = '/api';

// Category labels mapping
const CATEGORIES = {
    'electronics': 'Электроника',
    'documents': 'Документы',
    'clothing': 'Одежда',
    'accessories': 'Аксессуары',
    'other': 'Другое'
};

// ===== Public endpoints =====

async function getPosts({ search, type, category } = {}) {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (type) params.set('type', type);
    if (category) params.set('category', category);
    const url = `${API_BASE}/posts${params.toString() ? '?' + params.toString() : ''}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch posts');
    return response.json();
}

async function getPost(id) {
    const response = await fetch(`${API_BASE}/posts/${id}`);
    if (!response.ok) throw new Error('Post not found');
    return response.json();
}

async function createPost(data) {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE}/posts`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to create post');
    }
    return response.json();
}

async function markReturned(id) {
    const response = await apiAuthFetch(`${API_BASE}/posts/${id}/return`, { method: 'PATCH' });
    if (!response.ok) throw new Error('Failed to mark as returned');
    return response.json();
}

async function deletePost(id) {
    const response = await apiAuthFetch(`${API_BASE}/posts/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Failed to delete post');
    return true;
}

// ===== Auth endpoints =====

async function register(email, password, name) {
    const response = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name })
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Registration failed');
    }
    const data = await response.json();
    setAuth(data.access_token, data.user);
    return data;
}

async function login(email, password) {
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);
    
    const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString()
    });
    if (!response.ok) {
        throw new Error('Invalid email or password');
    }
    const data = await response.json();
    setAuth(data.access_token, data.user);
    return data;
}

function logout() {
    clearAuth();
    window.location.href = 'index.html';
}

async function getMe() {
    const response = await apiAuthFetch(`${API_BASE}/auth/me`);
    if (!response.ok) {
        clearAuth();
        return null;
    }
    return response.json();
}

// ===== Admin endpoints =====

async function adminGetUsers() {
    const response = await apiAuthFetch(`${API_BASE}/admin/users`);
    if (!response.ok) throw new Error('Unauthorized');
    return response.json();
}

async function adminGetUserPosts(userId) {
    const response = await apiAuthFetch(`${API_BASE}/admin/users/${userId}/posts`);
    if (!response.ok) throw new Error('Failed to fetch user posts');
    return response.json();
}

// ===== Utilities =====

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function truncate(text, maxLength = 120) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
