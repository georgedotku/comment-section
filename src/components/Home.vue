<template>
  <div class="w-80 flex flex-col items-center justify-end mx-auto gap-2 pt-12">
    <h3 class="font-medium">SIGN IN</h3>
    <div
      v-for="user in users"
      :key="user.id"
      @click="currentUser = user"
      class="cursor-pointer flex text-black items-center justify-center text-justify w-35 gap-2 p-2 ring-1 shadow-xl/30 rounded-lg"
      :class="currentUser.id === user.id ? 'border-blue-500' : ''">
      <img :src="user.avatar" class="h-8 w-8 ml-2 rounded-full" />
      <span class="text-sm">{{ user.username }}</span>
    </div>
  </div>
</template>
<script setup>
const props = defineProps({
  users: Array,
  currentUser: Object,
});
</script>
