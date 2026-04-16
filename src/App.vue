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
const apiUrl =
  import.meta.env.MODE === 'development'
    ? 'http://localhost:1337/api/comments'
    : 'https://comments-apiv2.onrender.com/comments';
// GET COMMENTS
const fetchComments = async () => {
  const res = await fetch(`${apiUrl}?populate=*`);
  const jsonData = await res.json();
  console.log(jsonData);
  const formatted = jsonData.data.map((item) => ({
    id: item.id,
    documentId: item.documentId,
    username: item.author.username,
    avatar: item.author.avatar,
  }));
  console.log('formatted:', formatted);
  users.value.push(...formatted);
};
onMounted(fetchComments);

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
