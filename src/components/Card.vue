<template>
  <div class="bg-white p-4 w-1/2 rounded-lg shadow-md">
    <div
      class="flex flex-col items-center bg-[#E7EDE7] w-6 py-2 space-y-0.5 rounded">
      <button @click="count++" class="font-medium text-grey-100">+</button>
      <span class="font-bold text-blue-500">{{ count }}</span>
      <button @click="count--" class="font-medium text-grey-100">-</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const count = ref(0);
</script>
