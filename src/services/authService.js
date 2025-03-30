const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api/auth";

// Helper function to handle API responses
const handleResponse = async (response) => {
    const data = await response.json();
    if (!response.ok) {
        // Handle backend errors
        const error = data.message || `Request failed with status ${response.status}`;
        throw new Error(error);
    }
    return data;
};

// Signup function
export const signup = async (userData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
        });
        return await handleResponse(response);
    } catch (error) {
        console.error("Signup Error:", error);
        throw new Error(error.message || "Failed to signup. Please try again later.");
    }
};

// Login function
export const login = async (credentials) => {
    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
        });
        const data = await handleResponse(response);

        // Store token in localStorage
        if (data.token) {
            localStorage.setItem("token", data.token);
        }
        return data;
    } catch (error) {
        console.error("Login Error:", error);
        throw new Error(error.message || "Failed to login. Please try again later.");
    }
};

// Logout function
export const logout = () => {
    localStorage.removeItem("token");
};

// Check if user is authenticated
export const isAuthenticated = () => {
    return !!localStorage.getItem("token");
};

// Get current user's token
export const getToken = () => {
    return localStorage.getItem("token");
};

// Verify token with backend (optional)
export const verifyToken = async () => {
    try {
        const token = getToken();
        if (!token) return false;

        const response = await fetch(`${API_BASE_URL}/verify`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        return await handleResponse(response);
    } catch (error) {
        console.error("Token Verification Error:", error);
        logout(); // Clear invalid token
        throw new Error("Session expired. Please login again.");
    }
};