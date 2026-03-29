<template>
  <div class="bg-[#E7EDE7] w-full h-full">
    <div
      class="flex flex-col gap-4 justify-start w-1/2 mx-auto py-4 items-center">
      <Card v-for="user in user" :key="user.id" :user="user" width="w-full" />
      <CommentBox />
    </div>
  </div>
</template>

<script setup>
import Card from './components/Card.vue';

import CommentBox from './components/CommentBox.vue';
import { ref } from 'vue';
const user = ref([
  {
    id: 1,
    name: 'Mr Henry',
    avatar: 'https://i.pravatar.cc/200',
    time: '2 weeks ago',
  },
  {
    id: 2,
    name: 'Ms Susan',
    avatar: 'https://i.pravatar.cc/300',
    time: '1 week ago',
  },
]);
</script>
