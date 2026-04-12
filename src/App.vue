<template>
  <div class="bg-[#E7EDE7] w-full h-screen">
    <router-view
      :users="users"
      :currentUser="currentUser"
      @selectUser="setUser" />
  </div>
</template>

<script setup>
import { ref } from 'vue';

const users = [
  { id: 1, username: 'amyrobson', avatar: 'https://i.pravatar.cc/100?img=1' },
  { id: 2, username: 'maxblagun', avatar: 'https://i.pravatar.cc/100?img=2' },
  { id: 3, username: 'ramsesmiron', avatar: 'https://i.pravatar.cc/100?img=3' },
  { id: 4, username: 'juliusomo', avatar: 'https://i.pravatar.cc/100?img=4' },
];

const currentUser = ref(users);

const setUser = (user) => {
  currentUser.value = user;
};
</script>
