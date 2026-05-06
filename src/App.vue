<template>
  <div class="bg-[#E7EDE7] w-full min-h-screen">
    <div
      v-if="loadingUsers"
      class="flex flex-col justify-center items-center h-screen">
      <div
        class="animate-spin rounded-full h-10 w-10 border-4 border-gray-300 border-t-black"></div>
      <p class="ml-2">Loading...</p>
    </div>
    <div v-if="error" class="text-center text-red-500 mt-4">
      {{ error }}
    </div>
    <router-view
      v-else
      :users="users"
      :currentUser="currentUser"
      @selectUser="setUser($event)" />
  </div>
</template>
<script setup>
import { ref, watch, onMounted } from 'vue';
const users = ref([]);
const loadingUsers = ref(true);
const error = ref(null);

const fetchUsers = async () => {
  loadingUsers.value = true;
  try {
    const res = await fetch(
      'https://comments-api-strapi.onrender.com/api/users',
    );
    const jsonData = await res.json();
    if (!Array.isArray(jsonData)) {
      console.error('Forbidden or invalid response:', jsonData);
      return;
    }
    users.value = jsonData.map((user) => ({
      id: user.id,
      username: user.username,
      avatar: user.avatar,
      email: user.email,
    }));
  } catch (err) {
    console.error(err);
    error.value = 'Failed to fetch users.';
  } finally {
    loadingUsers.value = false;
  }
};
onMounted(fetchUsers);
const currentUser = ref(
  JSON.parse(localStorage.getItem('currentUser')) || null,
);
watch(currentUser, (user) => {
  if (user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
  } else {
    localStorage.removeItem('currentUser');
  }
});
const setUser = (user) => {
  currentUser.value = user;
};
</script>
