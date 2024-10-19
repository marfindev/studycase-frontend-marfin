<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card>
          <v-card-title>Edit Employee</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="handleSubmit">
              <v-text-field
                v-model="employee.name"
                label="Name"
                required
              ></v-text-field>

              <v-select
                v-model="employee.gender"
                :items="['male', 'female']"
                label="Gender"
                required
              ></v-select>

              <v-text-field
                v-model="employee.email"
                label="Email"
                required
              ></v-text-field>

              <v-text-field
                v-model="employee.phone"
                label="Phone"
                required
              ></v-text-field>

              <v-text-field
                v-model="employee.date_of_birth"
                label="Date of Birth"
                type="date"
                required
              ></v-text-field>

              <v-text-field
                v-model="employee.address"
                label="Address"
                required
              ></v-text-field>

              <v-select
                v-model="employee.department_id"
                :items="departments"
                item-text="name"
                item-value="id"
                label="Department"
                required
              ></v-select>

              <v-select
                v-model="employee.job_position_id"
                :items="positions"
                item-text="name"
                item-value="id"
                label="Position"
                required
              ></v-select>

              <v-btn color="primary" @click="handleSubmit">Update Employee</v-btn>
              <v-btn color="secondary" @click="goBack" class="mt-2">Cancel</v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import api from '../services/api';

export default {
  name: 'EditEmployee',
  setup() {
    const employee = ref({
      id: null,
      name: '',
      gender: '',
      email: '',
      phone: '',
      date_of_birth: '',
      address: '',
      department_id: null,
      job_position_id: null
    });
    const departments = ref([]);  // Fetch departments from the API
    const positions = ref([]);    // Fetch positions from the API
    const route = useRoute();     // Get the route for the employee ID
    const router = useRouter();

    const fetchEmployee = async (id) => {
      try {
        const response = await api.getEmployee(id);
        employee.value = response.data;  // Populate employee with API data
      } catch (error) {
        console.error('Failed to fetch employee:', error);
      }
    };

    const fetchDepartments = async () => {
      try {
        const response = await api.getDepartments();  // Fetch departments from API
        departments.value = response.data;
      } catch (error) {
        console.error('Failed to fetch departments', error);
      }
    };

    const fetchPositions = async () => {
      try {
        const response = await api.getPositions();  // Fetch positions from API
        positions.value = response.data;
      } catch (error) {
        console.error('Failed to fetch positions', error);
      }
    };

    const handleSubmit = async () => {
      const employeeData = {
        id: employee.value.id,  // Ensure the ID is included in the update
        name: employee.value.name,
        gender: employee.value.gender,
        email: employee.value.email,
        phone: employee.value.phone,
        date_of_birth: employee.value.date_of_birth,
        address: employee.value.address,
        department_id: employee.value.department_id,
        job_position_id: employee.value.job_position_id,
      };

      try {
        await api.updateEmployee(employee.value.id, employeeData);  // Send the updated data in PUT request
        router.push({ name: 'EmployeeList' });  // Redirect after successful update
      } catch (error) {
        console.error('Failed to update employee', error);
      }
    };

    const goBack = () => {
      router.push({ name: 'EmployeeList' });
    };

    onMounted(() => {
      // Assuming the employee ID is passed via route params
      const employeeId = route.params.id;
      fetchEmployee(employeeId);  // Fetch employee details when the component mounts
      fetchDepartments();  // Fetch departments
      fetchPositions();  // Fetch positions
    });

    return {
      employee,
      departments,
      positions,
      handleSubmit,
      goBack,
    };
  }
};
</script>

<style scoped>
/* Add any component-specific styles here */
</style>
