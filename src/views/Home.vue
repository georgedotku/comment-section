<template>
  <div class="w-80 flex flex-col items-center justify-end mx-auto gap-2 pt-12">
    <h3 class="font-medium">SIGN IN</h3>
    <div
      v-for="user in users"
      :key="user.id"
      class="cursor-pointer flex text-black items-center justify-center text-justify w-35 gap-2 p-2 ring-1 shadow-xl/30 rounded-lg"
      :class="currentUser.id === user.id ? 'border-blue-500' : ''">
      <router-link
        :to="{ name: 'comment', params: { id: user.id } }"
        @click="selectUser(user)"
        class="flex items-center gap-2">
        <img :src="user.avatar" class="h-8 w-8 ml-2 rounded-full" />
        <span class="text-sm">{{ user.username }}</span>
      </router-link>
    </div>
  </div>
</template>
<script setup>
const props = defineProps({
  id: String,
  users: Array,
  currentUser: Object,
});
const emit = defineEmits(['selectUser']);
const selectUser = (user) => {
  emit('selectUser', user);
};
</script>
