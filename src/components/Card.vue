<template>
  <div class="bg-white p-4 w-1/2 h-50 relative border rounded-lg shadow-md">
    <div
      class="flex flex-col items-center bg-[#E7EDE7] border w-6 py-2 space-y-0.5 rounded">
      <button @click="count++" class="font-bold text-grey-300 opacity-30">
        +
      </button>
      <span class="font-bold text-blue-500">{{ count }}</span>
      <button @click="count--" class="font-bold text-grey-300 opacity-30">
        -
      </button>
    </div>
    <div
      className="group flex mx-10 mb-40 absolute top-4 left-4 w-[90%] items-center border gap-2 sm:flex-row sm:gap-4">
      <img
        src="https://i.pravatar.cc/300"
        alt="img"
        className="h-12 w-12 rounded-full transition-transform duration-200 group-hover:scale-105 group-active:scale-95" />
      <div className="flex gap-2 border sm:items-start">
        <p className="font-medium">George</p>
        <p className="text-muted-foreground font-medium">2 weeks ago</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const count = ref(0);
</script>
