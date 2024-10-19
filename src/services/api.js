import axios from 'axios';

// Create an Axios instance with a base URL and default headers
const apiClient = axios.create({
  baseURL: 'https://api-interview-vue.bayarind.id/api',  // Replace with your actual API base URL
  headers: {
    'Content-Type': 'application/json',  // Set default content type for all requests
  },
});

// Add a request interceptor to include the token in every request (if available)
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2FwaS1pbnRlcnZpZXctdnVlLmJheWFyaW5kLmlkL2FwaS9hdXRoL2xvZ2luIiwiaWF0IjoxNzI5MzUxMTI0LCJleHAiOjE3MjkzNTQ3MjQsIm5iZiI6MTcyOTM1MTEyNCwianRpIjoiUTZUMkZlV0NVc1dEM05wUyIsInN1YiI6IjEiLCJwcnYiOiIyM2JkNWM4OTQ5ZjYwMGFkYjM5ZTcwMWM0MDA4NzJkYjdhNTk3NmY3In0.McVVgoh55buDpRruQhmnNQqEn6mZ4nV08baoq_wVgAM'}`;  // Add the token to the Authorization header
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// API methods for handling requests
export default {
  // Authentication
  login(credentials) {
    return apiClient.post('/auth/login', credentials);  // POST request to log in
  },

  logout() {
    return apiClient.get('/auth/logout');  // GET request to log out
  },

  // Employee management
  getEmployees() {
    return apiClient.get('/employee');  // GET request to fetch all employees
  },

  getEmployee(id) {
    return apiClient.get(`/employee/${id}`);  // GET request to fetch a single employee by ID
  },

  createEmployee(employeeData) {
    return apiClient.post('/employee', employeeData);  // POST request to create a new employee
  },

  updateEmployee(id, employeeData) {
    return apiClient.put(`/employee/${id}`, employeeData);  // PUT request to update an employee
  },

  deleteEmployee(id) {
    return apiClient.delete(`/employee/${id}`);  // DELETE request to remove an employee by ID
  },

  getPositions() {
    return apiClient.get('/position/list');  // Ensure the endpoint is correct
  },

  getDepartments() {
    return apiClient.get('/departement/list');  // Example for departments
  },

  // Additional endpoints can be added here as needed...
};
