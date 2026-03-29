<template>
  <!-- Card -->
  <div
    :class="[
      'bg-white p-4 h-40 relative rounded-lg shadow-md transition-all duration-300',
      isReplying ? 'w-64' : width,
    ]">
    <!-- Vote -->
    <div class="flex flex-col items-center bg-[#E7EDE7] w-6 py-2 rounded">
      <button @click="count++" class="font-bold opacity-30">+</button>
      <span class="font-bold text-blue-500">{{ count }}</span>
      <button @click="count--" class="font-bold opacity-30">-</button>
    </div>

    <!-- User Info -->
    <div
      class="group flex mx-10 absolute top-4 left-4 w-[90%] items-center gap-3">
      <img
        :src="user.avatar"
        alt="img"
        class="h-12 w-12 rounded-full transition-transform duration-200 group-hover:scale-105" />

      <div>
        <p class="font-medium">{{ user.name }}</p>
        <p class="text-sm opacity-40">{{ user.time }}</p>
      </div>

      <!-- Reply -->
      <span
        @click="toggleReply"
        class="flex items-center gap-1 font-bold text-blue-500 absolute top-2 right-4 cursor-pointer">
        <Reply class="w-5 h-5" /> Reply
      </span>
    </div>

    <!-- Comment -->
    <div class="absolute top-20 mx-10">
      <p class="text-gray-500">
        {{ user.comment }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { Reply } from 'lucide-vue-next';
import { ref } from 'vue';

const count = ref(0);
const isReplying = ref(false);

const props = defineProps({
  user: Object,
  width: {
    type: String,
    default: 'w-full',
  },
});

const toggleReply = () => {
  isReplying.value = !isReplying.value;
};
</script>
