<template>
  <div class="relative">
    <div
      v-if="comment.level > 0"
      class="absolute left-0 top-0 w-0.5 bg-black opacity-30"
      :style="{
        height: '100%',
        left: `${(comment.level - 1) * 20}px`,
      }"></div>

    <!-- Card -->
    <div
      class="bg-inherit h-50 p-4 relative rounded-lg ring-2 ring-gray-300 shadow-xl/30"
      :style="{
        marginLeft: `${Math.min(comment.level, 3) * 20}px`,
        width: `calc(100% - ${Math.min(comment.level, 3) * 20}px)`,
      }"
      :class="isReply ? 'ml-auto mt-3 w-[90%]' : 'w-full'">
      <!-- User Info -->
      <div class="flex sm:mx-10 items-center gap-3">
        <img
          :src="comment.avatar"
          alt="img"
          class="h-12 w-12 rounded-full transition-transform duration-200 group-hover:scale-105" />
        <div class="flex gap-2">
          <p class="font-medium">{{ comment.username }}</p>
          <span
            v-if="isReply && isOwner"
            class="bg-black text-white h-6 w-8 text-center py-0.5 text-[12px] rounded font-medium">
            you
          </span>
          <p
            class="text-muted-foreground text-[14px] font-medium opacity-30 mt-auto">
            {{ comment.time }}
          </p>
        </div>
        <!-- Comment -->
        <div
          class="absolute top-20 sm:mx-auto w-[87%] overflow-y-auto max-h-20">
          <!-- EDIT MODE -->
          <div v-if="isEditing" class="flex items-center gap-3">
            <textarea
              v-model="editText"
              class="flex-1 min-w-0 h-20 px-3 outline-2 outline-gray-500/30 rounded-lg resize-none"></textarea>
            <div class="flex gap-2 flex-col justify-end">
              <button
                @click="cancelEdit"
                class="px-3 py-1 rounded-lg bg-gray-300">
                CANCEL
              </button>
              <button
                @click="saveEdit"
                class="px-3 py-1 rounded-lg bg-black text-white">
                UPDATE
              </button>
            </div>
          </div>

          <p v-else class="text-gray-500 text-justify">
            <span v-html="highlightMention(comment.content)"></span>
          </p>
        </div>
        <!-- Vote -->
        <div
          class="flex absolute bottom-2 left-4 w-16 h-8 sm:w-6 sm:h-22 sm:bottom-auto sm:top-2 sm:flex-col items-center justify-center bg-inherit ring-1 ring-gray-300 px-4 gap-2 rounded">
          <button
            @click="upVote"
            :class="userVote === 'up' ? 'text-gray-500' : 'text-black'"
            :disabled="!props.currentUser"
            class="text-black font-medium">
            +
          </button>
          <span class="font-bold text-gray-500">{{ count }}</span>
          <button
            @click="downVote"
            :class="userVote === 'down' ? 'text-gray-500' : 'text-black'"
            :disabled="!props.currentUser"
            class="text-black font-medium">
            -
          </button>
        </div>
      </div>
      <!-- Edit & Delete buttons -->
      <div
        v-if="isOwner"
        class="flex gap-2 w-fit absolute bottom-2 sm:bottom-auto sm:top-4 sm:mt-3 right-4">
        <span
          @click="emit('openModal', comment.documentId)"
          class="flex items-center font-medium gap-1 text-gray-500 cursor-pointer">
          <Trash2 class="w-4 h-4" /> Delete
        </span>
        <span
          @click="handleEdit"
          class="flex items-center font-medium gap-1 text-gray-500 cursor-pointer">
          <Edit2 class="w-4 h-4" /> Edit
        </span>
      </div>
      <!-- Reply button -->
      <span
        v-else
        @click="canReplyInThread(comment) && toggleReply(comment)"
        :class="[
          'flex items-center w-fit gap-1 font-bold text-gray-500 absolute bottom-2 right-4 sm:bottom-auto sm:top-4 sm:mt-3',
          canReplyInThread(comment)
            ? 'cursor-pointer'
            : 'opacity-40 cursor-not-allowed',
        ]">
        <Reply class="w-5 h-5" /> Reply
      </span>
    </div>
  </div>
  <!-- Reply Box -->
  <div
    v-if="isReplying"
    class="bg-inherit ring-2 ring-gray-300 shadow-xl/30 rounded-lg p-4 mt-4 ml-auto"
    :class="[isReply ? 'w-[90%] ml-auto' : 'w-full']">
    <div class="flex items-center gap-3">
      <img
        :src="currentUser?.avatar"
        alt="img"
        class="h-12 w-12 mb-auto rounded-full transition-transform duration-200 hover:scale-105 active:scale-95" />
      <!-- Input -->
      <textarea
        v-model="replyText"
        type="text"
        placeholder="Add a comment"
        class="flex-1 min-w-0 h-20 px-3 outline-2 outline-gray-500/30 rounded-lg">
      </textarea>
      <!-- Button -->
      <button
        @click="submitReply"
        type="submit"
        class="bg-black text-white px-4 py-2 mb-auto rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500">
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
      @openModal="$emit('openModal', $event)"
      @delete="$emit('delete', $event)"
      @edit="$emit('edit', $event)"
      @reply="$emit('reply', $event)" />
  </div>
</template>

<script setup>
import { Reply, Edit2, Trash2 } from 'lucide-vue-next';
import { ref, computed, watch, onMounted } from 'vue';
const props = defineProps({
  comment: Object,
  currentUser: Object,
  isReply: Boolean,
  replies: Array,
});
defineOptions({
  name: 'CommentCard',
});
const emit = defineEmits(['edit', 'delete', 'reply', 'openModal']);

const count = ref(0);
const votes = ref({}); // { commentId: 'up' | 'down' }
const isReplying = ref(false);
const replyTo = ref(null);
const replyText = ref('');
const isEditing = ref(false);
const editText = ref('');

const isOwner = computed(
  () => props.currentUser && props.comment.authorId === props.currentUser.id,
);
const storageKey = `votes-${props.comment.id}`;

onMounted(() => {
  const saved = JSON.parse(localStorage.getItem(storageKey));
  if (saved) {
    count.value = saved.count;
    votes.value = saved.votes;
  }
});
watch([count, votes], () => {
  localStorage.setItem(
    storageKey,
    JSON.stringify({
      count: count.value,
      votes: votes.value,
    }),
  );
});
const userVote = computed(() => {
  return props.currentUser ? votes.value[props.currentUser.id] : null;
});
const upVote = () => {
  if (!props.currentUser) return;
  const userId = props.currentUser.id;
  const current = votes.value[userId];

  if (current === 'up') {
    // undo
    count.value--;
    delete votes.value[userId];
  } else if (current === 'down') {
    // switch
    count.value += 1;
    votes.value[userId] = 'up';
  } else {
    // new vote
    count.value++;
    votes.value[userId] = 'up';
  }
};
const downVote = () => {
  if (!props.currentUser) return;

  const userId = props.currentUser.id;
  const current = votes.value[userId];

  // only removes upvote
  if (current === 'up') {
    count.value--;
    delete votes.value[userId];
  }

  // if already down or nothing → do nothing
};
const highlightMention = (text) => {
  if (!text) return '';
  return text.replace(
    /@(\w+)/g,
    '<span class="text-blue-700 font-bold">@$1</span>',
  );
};

// REPLY
const getMaxLevel = (comment) => {
  let max = comment.level;

  const traverse = (node) => {
    node.replies?.forEach((child) => {
      max = Math.max(max, child.level);
      traverse(child);
    });
  };

  traverse(comment);

  return max;
};
const canReplyInThread = (comment) => {
  return getMaxLevel(comment) < 2;
};
const toggleReply = (comment) => {
  if (isReplying.value) {
    isReplying.value = false;
    replyTo.value = null;
    replyText.value = '';
    return;
  }

  isReplying.value = true;
  replyTo.value = comment.username;
  replyText.value = `@${comment.username} `;
};
const submitReply = () => {
  if (!replyText.value.trim()) return;

  emit('reply', {
    content: replyText.value,
    parent_id: props.comment.id,
    author_id: props.currentUser.id,
  });

  isReplying.value = false;
  replyTo.value = null;
  replyText.value = '';
};
const handleEdit = (newContent) => {
  isEditing.value = true;
  editText.value = props.comment.content;
};
const cancelEdit = () => {
  isEditing.value = false;
  editText.value = '';
};
const saveEdit = () => {
  if (!editText.value.trim()) return;

  emit('edit', {
    documentId: props.comment.documentId,
    content: editText.value,
  });

  isEditing.value = false;
};
const handleDelete = () => {
  emit('delete', props.comment.documentId);
};
</script>
