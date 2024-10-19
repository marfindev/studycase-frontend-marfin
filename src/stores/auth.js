import { defineStore } from 'pinia';
import axios from 'axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || '',  // Load token from localStorage on startup
    user: null,  // You can store user info if needed
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,  // Check if the user is authenticated by checking the token
  },

  actions: {
    // Login action
    async login(credentials) {
      try {
        const response = await axios.post(
          'https://api-interview-vue.bayarind.id/api/auth/login',
          credentials,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        this.token = response.data.data.token;  // Store token from the API response
        localStorage.setItem('token', this.token);  // Persist the token in localStorage
        return response;
      } catch (error) {
        // If the login fails, throw the error to be handled in the component
        throw error;
      }
    },

    // Logout action
    async logout() {
      try {
        // Make a request to the logout endpoint (optional)
        await axios.get('https://api-interview-vue.bayarind.id/api/auth/logout', {
          headers: {
            Authorization: `Bearer ${this.token}`,  // Pass the token in the Authorization header
          },
        });
      } catch (error) {
        // Handle error if the API logout fails
        console.error('Logout failed:', error);
      } finally {
        // Clear token and user data
        this.token = '';
        this.user = null;
        localStorage.removeItem('token');  // Remove the token from localStorage
      }
    },

    // Automatically login user if token exists in localStorage
    autoLogin() {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        this.token = storedToken;
      }
    },
  },
});
