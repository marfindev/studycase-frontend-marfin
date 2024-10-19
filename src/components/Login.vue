<template>
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4">
          <v-card>
            <v-card-title class="text-center">Login</v-card-title>
            <v-card-text>
              <v-form @submit.prevent="handleLogin">
                <v-text-field
                  v-model="email"
                  label="Email"
                  type="email"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="password"
                  label="Password"
                  type="password"
                  required
                ></v-text-field>
                <v-btn
                  type="submit"
                  color="primary"
                  :loading="loading"
                  block
                >
                  Login
                </v-btn>
                <!-- Error message display -->
                <v-alert
                  v-if="error"
                  type="error"
                  dense
                  text
                  class="mt-3"
                >
                  {{ error }}
                </v-alert>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { useAuthStore } from '../stores/auth';
  
  export default {
    name: 'LoginForm',  // Renamed to follow multi-word component rule
    setup() {
      const email = ref('');
      const password = ref('');
      const loading = ref(false);
      const error = ref('');
      const router = useRouter();
      const authStore = useAuthStore();
  
      const handleLogin = async () => {
        loading.value = true;
        error.value = '';  // Reset error message
  
        try {
          // Call the login function from the store
          const response = await authStore.login({ email: email.value, password: password.value });
          // Store the token in localStorage
          localStorage.setItem('token', response.data.data.token);
          // Redirect to home after successful login
          router.push({ name: 'Home' });
        } catch (err) {
          // Capture the error message from the API response or display a default message
          error.value = err.response?.data?.message || 'Unauthorized';
        } finally {
          loading.value = false;
        }
      };
  
      return {
        email,
        password,
        loading,
        error,
        handleLogin,
      };
    },
  };
  </script>
  
  <style scoped>
  .fill-height {
    min-height: 100vh;
  }
  </style>
  