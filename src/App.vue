<template>
  <div
    class="bg-[#E7EDE7] w-full h-screen flex flex-col gap-4 justify-start items-center pt-15">
    <Card :user="user" />
  </div>
</template>

<script setup>
import Card from './components/Card.vue';
import { ref } from 'vue';
const user = ref([
  {
    id: 1,
    name: 'Susan',
    avatar: 'https://i.pravatar.cc/300',
    time: '2 weeks ago',
  },
  {
    id: 2,
    name: 'Henry',
    avatar: 'https://i.pravatar.cc/300',
    time: '1 week ago',
  },
]);
</script>
