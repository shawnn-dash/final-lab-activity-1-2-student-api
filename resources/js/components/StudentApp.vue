<template>
  <div class="max-w-5xl mx-auto p-6">
    <!-- Header bar -->
    <header class="flex justify-between items-center mb-8 bg-white p-4 rounded-lg shadow border">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Student Management Portal</h1>
        <p v-if="token" class="text-xs text-gray-500">
          Logged in as: <span class="font-semibold text-gray-700">{{ userEmail }}</span> 
          (<span class="uppercase text-blue-600 font-bold">{{ userRole }}</span>)
        </p>
      </div>

      <button 
        v-if="token" 
        @click="handleLogout" 
        class="px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition"
      >
        Logout
      </button>
    </header>

    <!-- Feedback Message -->
    <div 
      v-if="feedbackMessage" 
      :class="`p-4 mb-6 rounded border ${isError ? 'bg-red-100 border-red-400 text-red-700' : 'bg-green-100 border-green-400 text-green-700'}`"
    >
      {{ feedbackMessage }}
    </div>

    <!-- Login View -->
    <LoginForm v-if="!token" @login-success="onLoginSuccess" />

    <!-- Main Student Management View -->
    <div v-else>
      <!-- Restricted to Administrator -->
      <StudentForm 
        v-if="isAdmin" 
        :selectedStudent="editingStudent" 
        :isEditing="Boolean(editingStudent)" 
        @save="handleSave" 
        @cancel="cancelEdit" 
      />
      <div v-else class="mb-6 p-4 bg-yellow-50 border border-yellow-300 text-yellow-800 rounded">
        <strong>Notice:</strong> You are logged in as a Regular User. You have read-only access to student records.
      </div>

      <StudentList 
        :students="students" 
        :loading="loading" 
        :isAdmin="isAdmin" 
        @edit="setEdit" 
        @delete="deleteStudent" 
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import LoginForm from './LoginForm.vue';
import StudentForm from './StudentForm.vue';
import StudentList from './StudentList.vue';

const token = ref(localStorage.getItem('token') || '');
const userRole = ref(localStorage.getItem('role') || '');
const userEmail = ref(localStorage.getItem('email') || '');

const students = ref([]);
const loading = ref(false);
const editingStudent = ref(null);
const feedbackMessage = ref('');
const isError = ref(false);

const isAdmin = computed(() => userRole.value === 'admin' || userRole.value === 'administrator');

const setAuthHeader = () => {
  if (token.value) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

const showFeedback = (msg, error = false) => {
  feedbackMessage.value = msg;
  isError.value = error;
  setTimeout(() => { feedbackMessage.value = ''; }, 4000);
};

const onLoginSuccess = (data) => {
  token.value = data.token;
  userRole.value = data.role;
  userEmail.value = data.email;

  localStorage.setItem('token', data.token);
  localStorage.setItem('role', data.role);
  localStorage.setItem('email', data.email);

  setAuthHeader();
  showFeedback('Login successful!');
  fetchStudents();
};

const handleLogout = async () => {
  try {
    await axios.post('/api/logout');
  } catch (err) {
    // Ignore logout token expiration errors on client cleanup
  } finally {
    token.value = '';
    userRole.value = '';
    userEmail.value = '';
    localStorage.clear();
    setAuthHeader();
    students.value = [];
    showFeedback('Logged out successfully.');
  }
};

const fetchStudents = async () => {
  loading.value = true;
  try {
    const res = await axios.get('/api/students');
    students.value = res.data;
  } catch (err) {
    showFeedback(err.response?.data?.message || 'Failed to fetch student list.', true);
  } finally {
    loading.value = false;
  }
};

const handleSave = async (formData) => {
  try {
    if (editingStudent.value) {
      await axios.put(`/api/students/${editingStudent.value.id}`, formData);
      showFeedback('Student record updated successfully!');
    } else {
      await axios.post('/api/students', formData);
      showFeedback('Student record created successfully!');
    }
    cancelEdit();
    fetchStudents();
  } catch (err) {
    const msg = err.response?.data?.message || 'Validation or server error occurred.';
    showFeedback(msg, true);
  }
};

const deleteStudent = async (id) => {
  if (!confirm('Are you sure you want to delete this student?')) return;
  try {
    await axios.delete(`/api/students/${id}`);
    showFeedback('Student record deleted successfully!');
    fetchStudents();
  } catch (err) {
    showFeedback(err.response?.data?.message || 'Failed to delete student.', true);
  }
};

const setEdit = (student) => {
  editingStudent.value = student;
};

const cancelEdit = () => {
  editingStudent.value = null;
};

onMounted(() => {
  if (token.value) {
    setAuthHeader();
    fetchStudents();
  }
});
</script>