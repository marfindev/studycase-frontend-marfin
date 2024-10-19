<template>
    <v-container fluid>
      <v-row justify="space-between" align="center" class="mb-4">
        <v-col>
          <h1>Employee List</h1>
        </v-col>
        <v-col cols="auto">
          <v-btn color="primary" @click="goToCreate">Add Employee</v-btn>
          <v-btn color="error" @click="logout">Logout</v-btn>
        </v-col>
      </v-row>
  
      <!-- Employee List Table -->
      <v-data-table
        :headers="headers"
        :items="employees"
        :loading="loading"
        no-data-text="No employees available"
        class="elevation-1"
      >
        <template #item.actions="{ item }">
          <v-btn icon color="blue" @click="editEmployee(item.id)">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn icon color="red" @click="confirmDeleteEmployee(item.id)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>
  
      <!-- Confirm Delete Dialog -->
      <v-dialog v-model="confirmDialog" max-width="500">
        <v-card>
          <v-card-title class="text-h5">Confirm Delete</v-card-title>
          <v-card-text>Are you sure you want to delete this employee?</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="confirmDialog = false">Cancel</v-btn>
            <v-btn color="red darken-1" text @click="deleteEmployee(item.id)">Delete</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
  
      <!-- Snackbar for success/error messages -->
      <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
        {{ snackbar.message }}
        <template #action>
          <v-btn text @click="snackbar.show = false">Close</v-btn>
        </template>
      </v-snackbar>
    </v-container>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import api from '../services/api';
  import { useAuthStore } from '../stores/auth';
  
  export default {
    name: 'EmployeeList',
    setup() {
      const employees = ref([]);
      const loading = ref(false);
      const router = useRouter();
      const authStore = useAuthStore();
  
      const headers = [
        { text: 'ID', value: 'id' },
        { text: 'Name', value: 'name' },
        { text: 'Gender', value: 'gender' },
        { text: 'Email', value: 'email' },
        { text: 'Phone', value: 'phone' },
        { text: 'Department', value: 'departement' },
        { text: 'Position', value: 'position' },
        { text: 'Status', value: 'status' },
        { text: 'Actions', value: 'actions', sortable: false },
      ];
  
      const confirmDialog = ref(false);
      const selectedEmployeeId = ref(null);
  
      const snackbar = ref({
        show: false,
        message: '',
        color: '',
      });
  
      // Fetch the employees from the API
      const fetchEmployees = async () => {
        loading.value = true;
        try {
          const response = await api.getEmployees();
          console.log('API Response:', response.data);
          employees.value = response.data.data.list || [];  // Safely access employee data
          console.log('Employees:', employees.value);
        } catch (error) {
          console.error('Error fetching employees:', error);
          snackbar.value = {
            show: true,
            message: error.response?.data?.message || 'Failed to fetch employees',
            color: 'error',
          };
        } finally {
          loading.value = false;
        }
      };
  
      // Navigate to the employee creation form
      const goToCreate = () => {
        router.push({ name: 'CreateEmployee' });
      };
  
      // Navigate to the employee edit form
      const editEmployee = (id) => {
        router.push({ name: 'EditEmployee', params: { id } });
      };
  
      // Confirm the employee deletion
      const confirmDeleteEmployee = (id) => {
        selectedEmployeeId.value = id;
        confirmDialog.value = true;
      };
  
      // Delete the employee
      const deleteEmployee = async (id) => {
        try {
          await api.deleteEmployee(id);
          snackbar.value = {
            show: true,
            message: 'Employee deleted successfully',
            color: 'success',
          };
          fetchEmployees();  // Refresh the list after deletion
        } catch (error) {
          console.error('Error deleting employee:', error);
          snackbar.value = {
            show: true,
            message: error.response?.data?.message || 'Failed to delete employee',
            color: 'error',
          };
        } finally {
          confirmDialog.value = false;
        }
      };     

  
      // Logout the user
      const logout = async () => {
        await authStore.logout();
        router.push({ name: 'Login' });
      };
  
      // Fetch employees when the component is mounted
      onMounted(() => {
        fetchEmployees();
      });
  
      return {
        employees,
        loading,
        headers,
        goToCreate,
        editEmployee,
        confirmDialog,
        confirmDeleteEmployee,
        deleteEmployee,
        selectedEmployeeId,
        logout,
        snackbar,
      };
    },
  };
  </script>
  
  <style scoped>
  /* Add any component-specific styles here */
  </style>
  