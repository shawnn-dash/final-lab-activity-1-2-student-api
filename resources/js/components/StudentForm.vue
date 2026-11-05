<template>
  <div class="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-8">
    <h3 class="text-xl font-bold mb-4 text-gray-800">
      {{ isEditing ? 'Edit Student Record' : 'Add New Student' }}
    </h3>

    <form @submit.prevent="submitForm" class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
        <input 
          v-model="form.student_id" 
          type="text" 
          required 
          class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g. 2026-0001"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
        <input 
          v-model="form.full_name" 
          type="text" 
          required 
          class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Juan Cruz"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Course</label>
        <input 
          v-model="form.course" 
          type="text" 
          required 
          class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="BS Information Technology"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Year Level (1-4)</label>
        <input 
          v-model.number="form.year_level" 
          type="number" 
          min="1" 
          max="4" 
          required 
          class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div class="md:col-span-2 flex space-x-3 pt-2">
        <button 
          type="submit" 
          class="px-5 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 transition"
        >
          {{ isEditing ? 'Update Student' : 'Save Student' }}
        </button>
        <button 
          v-if="isEditing" 
          type="button" 
          @click="$emit('cancel')" 
          class="px-5 py-2 bg-gray-500 text-white rounded font-medium hover:bg-gray-600 transition"
        >
          Cancel
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue';

const props = defineProps({
  selectedStudent: Object,
  isEditing: Boolean,
});

const emit = defineEmits(['save', 'cancel']);

const form = reactive({
  student_id: '',
  full_name: '',
  course: '',
  year_level: 1,
});

watch(
  () => props.selectedStudent,
  (newVal) => {
    if (newVal) {
      form.student_id = newVal.student_id;
      form.full_name = newVal.full_name;
      form.course = newVal.course;
      form.year_level = newVal.year_level;
    } else {
      form.student_id = '';
      form.full_name = '';
      form.course = '';
      form.year_level = 1;
    }
  },
  { immediate: true }
);

const submitForm = () => {
  emit('save', { ...form });
};
</script>