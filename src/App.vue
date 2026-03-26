<template>
  <div class="bg-[#E7EDE7] w-full h-full">
    <div
      class="flex flex-col gap-4 justify-start w-1/2 mx-auto mb-4 border items-center pt-10">
      <Card :user="user" />
      <ReplyCard :user="user" />
      <CommentBox />
    </div>
  </div>
</template>

<script setup>
import Card from './components/Card.vue';
import ReplyCard from './components/ReplyCard.vue';
import CommentBox from './components/CommentBox.vue';
import { ref } from 'vue';
const user = ref([
  {
    id: 1,
    name: 'Ms Susan',
    avatar: 'https://i.pravatar.cc/300',
    time: '2 weeks ago',
  },
  {
    id: 2,
    name: 'Mr Henry',
    avatar: 'https://i.pravatar.cc/300',
    time: '1 week ago',
  },
]);
</script>
