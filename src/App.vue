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
const loading = ref(false);
const error = ref(null);

const fetchUsers = async (retries = 3, delay = 5000) => {
  loading.value = true;
  error.value = null;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000); // 15s timeout

      const res = await fetch(
        'https://comments-api-strapi.onrender.com/api/users',
        { signal: controller.signal },
      );
      clearTimeout(timeout);

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
      return; // success — exit
    } catch (err) {
      console.warn(`Attempt ${attempt} failed:`, err.message);
      if (attempt < retries) {
        await new Promise((res) => setTimeout(res, delay));
      } else {
        error.value = 'Could not reach the server. Please try again later.';
        console.error('All retries exhausted:', err);
      }
    } finally {
      loading.value = false;
    }
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
