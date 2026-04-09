<template>
  <!-- Card -->
  <div class="bg-white p-4 w-full relative rounded-lg shadow-md">
    <div class="flex items-center gap-3">
      <!-- Avatar -->
      <img
        :src="currentUser.avatar"
        alt="img"
        class="h-12 w-12 mb-auto rounded-full transition-transform duration-200 hover:scale-105 active:scale-95" />
      <!-- Input -->
      <textarea
        v-model="input"
        type="text"
        placeholder="Add a comment"
        class="flex-1 min-w-0 h-20 px-3 outline-2 outline-gray-500/30 resize-none rounded-lg"></textarea>
      <!-- Button -->
      <button
        @click="handleSubmit"
        :disabled="input === ''"
        type="submit"
        class="bg-blue-500 text-white px-4 py-2 mb-auto rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
        SEND
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const props = defineProps({
  currentUser: Object,
});
const emit = defineEmits(['add-comment']);
const input = ref('');
const handleSubmit = () => {
  if (!input.value.trim()) return; // prevent empty comments
  emit('add-comment', {
    content: input.value,
    username: props.currentUser.username,
    avatar: props.currentUser.avatar,
  });
  input.value = ''; // clear input after submission
};
</script>
