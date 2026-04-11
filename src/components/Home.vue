<template>
  <div class="border bg-white flex gap-3 mb-4">
    <div
      v-for="user in users"
      :key="user.id"
      @click="currentUser = user"
      class="cursor-pointer flex items-center gap-2 p-2 border rounded-lg"
      :class="currentUser.id === user.id ? 'border-blue-500' : ''">
      <img :src="user.avatar" class="h-8 w-8 rounded-full" />
      <span>{{ user.username }}</span>
    </div>
  </div>
</template>
<script setup>
const props = defineProps({
  users: Array,
  currentUser: Object,
});
</script>
