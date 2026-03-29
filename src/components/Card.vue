<template>
  <!-- Card -->
  <div
    :class="[
      'bg-white p-4 h-40 relative rounded-lg shadow-md transition-all duration-300',
      isReplying ? 'w-[90%] ml-auto' : width,
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
        @click="toggleReply(user)"
        class="flex items-center gap-1 font-bold text-blue-500 absolute top-2 right-4 cursor-pointer">
        <Reply class="w-5 h-5" /> Reply
      </span>
    </div>

    <!-- Comment -->
    <div class="absolute top-20 mx-10 overflow-y-auto max-h-20">
      <span v-if="replyTo" class="text-blue-700 font-bold">
        @{{ replyTo }}
      </span>
      <p class="text-gray-500">
        {{ user.comment }}
      </p>
    </div>
  </div>
  <!-- Reply Box -->
  <div v-if="isReplying" class="bg-white w-full rounded-lg p-4 mt-4 mx-10">
    <div class="flex items-center gap-3">
      <img
        src="https://i.pravatar.cc/100"
        alt="img"
        class="h-12 w-12 mb-auto rounded-full transition-transform duration-200 hover:scale-105 active:scale-95" />
      <!-- Input -->
      <textarea
        ref="inputRef"
        v-model="replyText"
        type="text"
        placeholder="Add a comment"
        class="flex-1 min-w-0 h-20 px-3 outline-2 outline-gray-500/30 rounded-lg"></textarea>

      <!-- Button -->
      <button
        @click="submitReply"
        type="submit"
        class="bg-blue-500 text-white px-4 py-2 mb-auto rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
        REPLY
      </button>
    </div>
    <!-- Actions -->
    <!-- <div class="flex gap-2 mt-2 justify-end">
      <button @click="isReplying = false" class="px-3 py-1 text-gray-500">
        Cancel
      </button>

      <button
        @click="submitReply"
        class="px-4 py-1 bg-blue-500 text-white rounded">
        Reply
      </button> 
    </div> -->
  </div>
</template>

<script setup>
import { Reply } from 'lucide-vue-next';
import { ref, nextTick } from 'vue';

const count = ref(0);
const isReplying = ref(false);
const replyTo = ref(null);
const replyText = ref('');
const inputRef = ref(null);

const props = defineProps({
  user: Object,
  width: {
    type: String,
  },
});

const toggleReply = async (user) => {
  isReplying.value = true;
  replyTo.value = isReplying.value ? props.user.name : '@name';
  replyText.value = `@${user.name} `;

  await nextTick();
  inputRef.value?.focus();
};
const submitReply = () => {
  if (replyText.value.trim() === '') return;

  // Here you can handle the reply submission, e.g., send it to an API or update local state
  console.log('Reply submitted:', replyText.value);

  // Reset the reply box
  isReplying.value = false;
  replyTo.value = null;
  replyText.value = '';
};
</script>
