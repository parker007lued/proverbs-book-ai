// Authentication and Data Sync Module
// Cross-platform user authentication and data sharing

const axios = require('axios');
const crypto = require('crypto');

class AuthManager {
    constructor() {
        // Update this to your deployed backend URL
        // For local development: 'http://localhost:3000'
        // For production: 'https://your-api-domain.com'
        this.apiUrl = process.env.API_URL || 'http://localhost:3000';
        this.user = null;
        this.token = null;
        this.syncEnabled = false;
    }

    // Initialize authentication
    async init() {
        try {
            // Check for saved credentials
            const savedAuth = this.loadAuthFromStorage();
            if (savedAuth) {
                this.user = savedAuth.user;
                this.token = savedAuth.token;
                // Verify token is still valid
                const isValid = await this.verifyToken();
                if (!isValid) {
                    this.logout();
                }
            }
            return { success: true, user: this.user };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Register new user
    async register(email, password, displayName) {
        try {
            const response = await axios.post(`${this.apiUrl}/auth/register`, {
                email,
                password: this.hashPassword(password),
                displayName,
                platform: process.platform,
                appVersion: require('./package.json').version
            });

            if (response.data.success) {
                this.user = response.data.user;
                this.token = response.data.token;
                this.saveAuthToStorage();
                return { success: true, user: this.user };
            }
            return { success: false, error: response.data.error };
        } catch (error) {
            return { success: false, error: error.response?.data?.error || error.message };
        }
    }

    // Login
    async login(email, password) {
        try {
            const response = await axios.post(`${this.apiUrl}/auth/login`, {
                email,
                password: this.hashPassword(password),
                platform: process.platform
            });

            if (response.data.success) {
                this.user = response.data.user;
                this.token = response.data.token;
                this.saveAuthToStorage();
                return { success: true, user: this.user };
            }
            return { success: false, error: response.data.error };
        } catch (error) {
            return { success: false, error: error.response?.data?.error || error.message };
        }
    }

    // Logout
    logout() {
        this.user = null;
        this.token = null;
        this.clearAuthFromStorage();
    }

    // Verify token
    async verifyToken() {
        if (!this.token) return false;
        try {
            const response = await axios.get(`${this.apiUrl}/auth/verify`, {
                headers: { Authorization: `Bearer ${this.token}` }
            });
            return response.data.valid;
        } catch {
            return false;
        }
    }

    // Sync data to cloud
    async syncData(data) {
        if (!this.user || !this.token) {
            return { success: false, error: 'Not authenticated' };
        }

        try {
            const response = await axios.post(`${this.apiUrl}/data/sync`, {
                userId: this.user.id,
                data: data,
                timestamp: new Date().toISOString()
            }, {
                headers: { Authorization: `Bearer ${this.token}` }
            });

            return { success: true, synced: response.data.synced };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Get synced data
    async getSyncedData() {
        if (!this.user || !this.token) {
            return { success: false, error: 'Not authenticated' };
        }

        try {
            const response = await axios.get(`${this.apiUrl}/data/get`, {
                headers: { Authorization: `Bearer ${this.token}` },
                params: { userId: this.user.id }
            });

            return { success: true, data: response.data.data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Hash password
    hashPassword(password) {
        return crypto.createHash('sha256').update(password).digest('hex');
    }

    // Save auth to local storage
    saveAuthToStorage() {
        const authData = {
            user: this.user,
            token: this.token,
            timestamp: Date.now()
        };
        // Use Electron's safeStorage or localStorage
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('proverbs_auth', JSON.stringify(authData));
        }
    }

    // Load auth from storage
    loadAuthFromStorage() {
        try {
            if (typeof localStorage !== 'undefined') {
                const authData = localStorage.getItem('proverbs_auth');
                if (authData) {
                    return JSON.parse(authData);
                }
            }
        } catch {
            return null;
        }
        return null;
    }

    // Clear auth from storage
    clearAuthFromStorage() {
        if (typeof localStorage !== 'undefined') {
            localStorage.removeItem('proverbs_auth');
        }
    }
}

module.exports = AuthManager;
