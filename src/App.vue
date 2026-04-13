<template>
  <div class="bg-[#E7EDE7] w-full min-h-screen">
    <router-view
      :users="users"
      :currentUser="currentUser"
      @selectUser="setUser($event)" />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const users = [
  { id: 1, username: 'amyrobson', avatar: 'https://i.pravatar.cc/100?img=1' },
  { id: 2, username: 'maxblagun', avatar: 'https://i.pravatar.cc/100?img=2' },
  { id: 3, username: 'ramsesmiron', avatar: 'https://i.pravatar.cc/100?img=3' },
  { id: 4, username: 'juliusomo', avatar: 'https://i.pravatar.cc/100?img=4' },
];

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
