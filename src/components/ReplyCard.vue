<template>
  <!-- Card -->
  <div class="bg-white p-4 w-[90%] ml-auto h-40 relative rounded-lg shadow-md">
    <!-- Button Container -->
    <div
      class="flex flex-col items-center bg-[#E7EDE7] w-6 py-2 space-y-0.5 rounded">
      <button @click="count++" class="font-bold text-grey-300 opacity-30">
        +
      </button>
      <span class="font-bold text-blue-500">{{ count }}</span>
      <button @click="count--" class="font-bold text-grey-300 opacity-30">
        -
      </button>
    </div>
    <!-- User Info -->
    <div
      className="group flex mx-10 absolute top-4 left-4 w-[90%] items-center gap-2 sm:flex-row sm:gap-4">
      <img
        src="https://i.pravatar.cc/200"
        alt="img"
        class="h-12 w-12 rounded-full transition-transform duration-200 group-hover:scale-105 group-active:scale-95" />
      <div class="flex gap-2 mb-2 sm:items-start">
        <p class="font-medium">Mr Rophi</p>
        <p class="text-muted-foreground font-medium opacity-30">2 weeks ago</p>
      </div>
      <span class="flex font-bold text-blue-500 absolute top-2 right-4">
        <Reply class="w-6 h-6 font-bold" /> Reply
      </span>
    </div>
    <!-- Comment -->
    <div class="flex w-[89%] ms-8 absolute top-18 mx-10 text-justify">
      <p class="text-gray-500 font-medium">
        <span class="text-blue-700">@Ms Susan</span> sit amet consectetur
        adipisicing elit. Unde quibusdam eius tempore porro ad. Fugit doloribus
        mollitia dolor eius odio quisquam rerum ratione error. Quibusdam labore
        nisi iusto magnam dicta?
      </p>
    </div>
  </div>

  <!-- Card -->
  <div class="bg-white p-4 w-[90%] ml-auto h-40 relative rounded-lg shadow-md">
    <!-- Button Container -->
    <div
      class="flex flex-col items-center bg-[#E7EDE7] w-6 py-2 space-y-0.5 rounded">
      <button @click="count++" class="font-bold text-grey-300 opacity-30">
        +
      </button>
      <span class="font-bold text-blue-500">{{ count }}</span>
      <button @click="count--" class="font-bold text-grey-300 opacity-30">
        -
      </button>
    </div>
    <!-- User Info -->
    <div
      className="group flex mx-10 absolute top-4 left-4 w-[90%] items-center gap-2 sm:flex-row sm:gap-4">
      <img
        src="https://i.pravatar.cc/200"
        alt="img"
        class="h-12 w-12 rounded-full transition-transform duration-200 group-hover:scale-105 group-active:scale-95" />
      <div class="flex gap-2 mb-2 sm:items-start">
        <p class="font-medium">Mr Rophi</p>
        <p class="text-muted-foreground font-medium opacity-30">2 days ago</p>
      </div>
      <span class="flex font-bold text-blue-500 absolute top-2 right-4">
        <Reply class="w-6 h-6 font-bold" /> Reply
      </span>
    </div>
    <!-- Comment -->
    <div class="flex w-[89%] ms-8 absolute top-18 mx-10 text-justify">
      <p class="text-gray-500 font-medium">
        <span class="text-blue-700">@Ms Susan</span> sit amet consectetur
        adipisicing elit. Unde quibusdam eius tempore porro ad. Fugit doloribus
        mollitia dolor eius odio quisquam rerum ratione error. Quibusdam labore
        nisi iusto magnam dicta?
      </p>
    </div>
  </div>
</template>

<script setup>
import { Reply } from 'lucide-vue-next';
import { ref } from 'vue';
const count = ref(0);
</script>
