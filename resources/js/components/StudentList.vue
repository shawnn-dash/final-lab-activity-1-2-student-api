<template>
  <div class="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
    <div class="p-4 bg-gray-50 border-b flex justify-between items-center">
      <h3 class="text-xl font-bold text-gray-800">Registered Students</h3>
      <span class="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-semibold">
        Total: {{ students.length }}
      </span>
    </div>

    <!-- Conditional state: loading -->
    <div v-if="loading" class="p-6 text-center text-gray-500">
      Loading student records...
    </div>

    <!-- Conditional state: empty list -->
    <div v-else-if="students.length === 0" class="p-6 text-center text-gray-500">
      No students found in the database.
    </div>

    <!-- Table view -->
    <div v-else class="overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-gray-100 border-b text-sm font-semibold text-gray-700">
            <th class="p-3">ID</th>
            <th class="p-3">Student ID</th>
            <th class="p-3">Full Name</th>
            <th class="p-3">Course</th>
            <th class="p-3">Year Level</th>
            <th v-if="isAdmin" class="p-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="student in students" 
            :key="student.id" 
            class="border-b hover:bg-gray-50 transition"
          >
            <td class="p-3 text-sm text-gray-600">{{ student.id }}</td>
            <td class="p-3 font-medium text-gray-900">{{ student.student_id }}</td>
            <td class="p-3 text-gray-800">{{ student.full_name }}</td>
            <td class="p-3 text-gray-700">{{ student.course }}</td>
            <td class="p-3 text-gray-700">Year {{ student.year_level }}</td>
            <td v-if="isAdmin" class="p-3 text-center space-x-2">
              <button 
                @click="$emit('edit', student)" 
                class="px-3 py-1 bg-amber-500 text-white rounded text-xs font-semibold hover:bg-amber-600"
              >
                Edit
              </button>
              <button 
                @click="$emit('delete', student.id)" 
                class="px-3 py-1 bg-red-600 text-white rounded text-xs font-semibold hover:bg-red-700"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
defineProps({
  students: Array,
  loading: Boolean,
  isAdmin: Boolean,
});

defineEmits(['edit', 'delete']);
</script>