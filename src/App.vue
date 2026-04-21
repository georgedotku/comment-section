<template>
  <div class="bg-[#E7EDE7] w-full min-h-screen">
    <router-view
      :users="users"
      :currentUser="currentUser"
      @selectUser="setUser($event)" />
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
const users = ref([]);

const fetchUsers = async () => {
  const res = await fetch('https://comments-api-strapi.onrender.com/api/users');
  const jsonData = await res.json();
  users.value = jsonData.map((user) => ({
    id: user.id,
    username: user.username,
    avatar: user.avatar,
    email: user.email,
  }));
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
