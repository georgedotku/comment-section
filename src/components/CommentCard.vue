<template>
  <!-- Card -->
  <div
    class="bg-white p-4 h-40 relative rounded-lg shadow-md transition-all duration-300"
    :class="isReply ? 'ml-auto mt-3 w-[90%]' : 'w-full'">
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
        :src="comment.avatar"
        alt="img"
        class="h-12 w-12 rounded-full transition-transform duration-200 group-hover:scale-105" />
      <div class="flex gap-2 sm:items-start">
        <p class="font-medium">{{ comment.user_name }}</p>
        <span
          v-if="isReply && isOwner"
          class="bg-blue-500 text-white text-[12px] px-2 py-0.5 rounded font-medium">
          you
        </span>
        <p class="text-muted-foreground font-medium opacity-30 mt-auto">
          {{ comment.time }}
        </p>
      </div>

      <!-- Edit & Delete buttons -->
      <div v-if="isReply && isOwner" class="flex gap-2 absolute top-2 right-4">
        <span
          @click="handleDelete"
          class="flex items-center font-medium gap-1 text-red-500 cursor-pointer">
          <Trash2 class="w-4 h-4" /> Delete
        </span>
        <span
          @click="handleEdit"
          class="flex items-center font-medium gap-1 text-blue-500 cursor-pointer">
          <Edit2 class="w-4 h-4" /> Edit
        </span>
      </div>
      <!-- Reply button -->
      <span
        v-else
        @click="toggleReply(comment)"
        class="flex items-center gap-1 font-bold text-blue-500 absolute top-2 right-4 cursor-pointer">
        <Reply class="w-5 h-5" /> Reply
      </span>
    </div>

    <!-- Comment -->
    <div class="absolute top-20 mx-10 overflow-y-auto w-[90%] max-h-20">
      <!-- EDIT MODE -->
      <div v-if="isEditing" class="flex items-center gap-3">
        <textarea
          ref="editRef"
          v-model="editText"
          class="flex-1 min-w-0 h-20 px-3 outline-2 outline-gray-500/30 rounded-lg"></textarea>

        <div class="flex gap-2 flex-col justify-end">
          <button @click="cancelEdit" class="px-3 py-1 rounded bg-gray-300">
            CANCEL
          </button>

          <button
            @click="saveEdit"
            class="px-3 py-1 rounded bg-blue-500 text-white">
            UPDATE
          </button>
        </div>
      </div>

      <!-- NORMAL MODE -->
      <p v-else class="text-gray-500">
        <span v-html="highlightMention(comment.content)"></span>
      </p>

      <!-- <p class="text-gray-500">
        <span v-html="highlightMention(comment.content)"></span>
      </p> -->
    </div>
  </div>
  <!-- Reply Box -->
  <div
    v-if="isReplying"
    class="bg-white rounded-lg p-4 mt-4 ml-auto"
    :class="[isReply ? 'w-[90%] ml-auto' : 'w-full']">
    <div class="flex items-center gap-3">
      <img
        :src="currentUser.avatar"
        alt="img"
        class="h-12 w-12 mb-auto rounded-full transition-transform duration-200 hover:scale-105 active:scale-95" />
      <!-- Input -->
      <textarea
        ref="inputRef"
        v-model="replyText"
        type="text"
        placeholder="Add a comment"
        class="flex-1 min-w-0 h-20 px-3 outline-2 outline-gray-500/30 rounded-lg">
      </textarea>
      <!-- Button -->
      <button
        @click="submitReply"
        type="submit"
        class="bg-blue-500 text-white px-4 py-2 mb-auto rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
        REPLY
      </button>
    </div>
  </div>
  <!-- NESTED REPLIES -->
  <div v-if="comment.replies?.length" class="mt-2">
    <CommentCard
      v-for="reply in comment.replies"
      :key="reply.id"
      :comment="reply"
      :isReply="true"
      :currentUser="currentUser"
      @delete="$emit('delete', $event)"
      @edit="$emit('edit', $event)"
      @reply="$emit('reply', $event)" />
  </div>
</template>

<script setup>
import { Reply, Edit2, Trash2 } from 'lucide-vue-next';
import { ref, computed, nextTick } from 'vue';
defineOptions({
  name: 'CommentCard',
});
const emit = defineEmits(['edit', 'delete', 'reply']);
const count = ref(0);
const isReplying = ref(false);
const replyTo = ref(null);
const replyText = ref('');
const inputRef = ref(null);
const isEditing = ref(false);
const editText = ref('');
const editRef = ref(null);

const props = defineProps({
  comment: Object,
  currentUser: Object,
  isReply: Boolean,
  replies: Array,
});
const isOwner = computed(
  () => props.comment.user_name === props.currentUser.username,
);
const highlightMention = (text) => {
  if (!text) return '';

  return text.replace(
    /@(\w+)/g,
    '<span class="text-blue-700 font-bold">@$1</span>',
  );
};
const toggleReply = async (user) => {
  // close the reply box
  if (isReplying.value) {
    isReplying.value = false;
    replyTo.value = null;
    replyText.value = '';
    return;
  }
  isReplying.value = true;
  replyTo.value = user.user_name;
  replyText.value = `@${user.user_name} `;
  await nextTick();
  inputRef.value?.focus();
};
const submitReply = () => {
  if (replyText.value.trim() === '') return;

  emit('reply', {
    content: replyText.value,
    parent_id: props.comment.id,
    user_name: props.currentUser.username,
    avatar: props.currentUser.avatar,
  });

  // Reset the reply box
  isReplying.value = false;
  replyTo.value = null;
  replyText.value = '';
};
const handleEdit = (newContent) => {
  isEditing.value = true;
  editText.value = props.comment.content;
  nextTick(() => {
    editRef.value?.focus();
  });
};
const cancelEdit = () => {
  isEditing.value = false;
  editText.value = '';
};
const saveEdit = () => {
  if (!editText.value.trim()) return;

  emit('edit', {
    id: props.comment.id,
    content: editText.value,
  });

  isEditing.value = false;
};
const handleDelete = () => {
  emit('delete', props.comment.id);
};
</script>
