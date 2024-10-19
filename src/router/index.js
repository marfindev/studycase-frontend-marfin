// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import Login from '../components/Login.vue';
import EmployeeList from '../components/EmployeeList.vue';
import EmployeeForm from '../components/EmployeeForm.vue';
import { useAuthStore } from '../stores/auth';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: EmployeeList,
    meta: { requiresAuth: true },
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/employee/create',
    name: 'CreateEmployee',
    component: EmployeeForm,
    meta: { requiresAuth: true },
  },
  {
    path: '/employee/edit/:id',
    name: 'EditEmployee',
    component: EmployeeForm,
    meta: { requiresAuth: true },
    props: true,
  },
  // Redirect any unknown routes to Home
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation Guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'Login' });
  } else {
    next();
  }
});

export default router;
