<template>
  <div class="max-w-md mx-auto mt-12 bg-white p-6 rounded-lg shadow-md border border-gray-200">
    <h2 class="text-2xl font-bold mb-6 text-center text-gray-800">Login to System</h2>

    <div v-if="errorMessage" class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
      {{ errorMessage }}
    </div>

    <form @submit.prevent="handleLogin" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input 
          v-model="email" 
          type="email" 
          required 
          class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="admin@example.com"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <input 
          v-model="password" 
          type="password" 
          required 
          class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="••••••••"
        />
      </div>

      <button 
        type="submit" 
        :disabled="submitting"
        class="w-full bg-blue-600 text-white font-medium py-2 rounded hover:bg-blue-700 disabled:opacity-50 transition"
      >
        <span v-if="submitting">Logging in...</span>
        <span v-else>Login</span>
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(['login-success']);

const email = ref('');
const password = ref('');
const submitting = ref(false);
const errorMessage = ref('');

const handleLogin = async () => {
  submitting.value = true;
  errorMessage.value = '';

  try {
    const response = await axios.post('/api/login', {
      email: email.value,
      password: password.value,
    });

    const { token, role } = response.data;
    emit('login-success', { token, role, email: email.value });
  } catch (err) {
    errorMessage.value = err.response?.data?.message || 'Invalid login credentials.';
  } finally {
    submitting.value = false;
  }
};
</script>