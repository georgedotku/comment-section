<script setup>
import CommentCard from '../components/CommentCard.vue';
import CommentBox from '../components/CommentBox.vue';
import Modal from '../components/Modal.vue';
import { ArrowLeft } from 'lucide-vue-next';
import { useRouter } from 'vue-router';
import { ref, onMounted, computed } from 'vue';
import { formatDistanceToNowStrict } from 'date-fns';
const router = useRouter();
const props = defineProps({
  id: String,
  users: Array,
  currentUser: Object,
});
const comments = ref([]);
const selectedComment = ref(null);
const showModal = ref(false);
const showMenu = ref(false);

const apiUrl = 'https://comments-api-strapi.onrender.com/api/comments';

const commentTree = (data, parentId = null, level = 0) => {
  console.log('data:', data);
  return data
    .filter((item) => item.parent_id === parentId)
    .map((item) => ({
      ...item,
      level,
      time: formatTime(item.created_at),
      replies: commentTree(data, item.id, level + 1), // recursion
    }));
};

// GET COMMENTS
const fetchComments = async () => {
  const res = await fetch(
    `${apiUrl}?populate[author]=true&populate[parent]=true`,
  );
  const jsonData = await res.json();

  const formatted = jsonData.data
    .filter((item) => item.author)
    .map((item) => ({
      id: item.id,
      documentId: item.documentId,
      authorId: item.author.id,
      username: item.author.username,
      avatar: item.author.avatar,
      content: item.content,
      created_at: item.createdAt,
      parent_id: item.parent?.id || null,
    }));

  comments.value = commentTree(formatted);
};
onMounted(fetchComments);
// ADD COMMENT
const addComment = async (payload) => {
  const res = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      data: {
        content: payload.content,
        parent: payload.parent_id || null,
        author: payload.author_id,
      },
    }),
  });

  if (!res.ok) {
    console.error('Failed to add comment');
    return;
  }
  await fetchComments();
};

// ADD REPLY
const addReply = async (payload) => {
  const res = await fetch(`${apiUrl}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      data: {
        content: payload.content,
        parent: payload.parent_id || null,
        author: payload.author_id,
      },
    }),
  });
  if (res.ok) {
    fetchComments();
  } else {
    console.error('Failed to add reply');
  }
};

// EDIT
const editComment = async ({ documentId, content }) => {
  const res = await fetch(`${apiUrl}/${documentId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      data: {
        content,
      },
    }),
  });
  if (res.ok) {
    fetchComments();
  } else {
    console.error('Failed to edit comment');
  }
};

// DELETE
const deleteComment = async (documentId) => {
  const res = await fetch(`${apiUrl}/${documentId}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    console.error('Failed to delete comment');
    return;
  }
  const removeComment = (list) => {
    return list
      .filter((item) => item.documentId !== documentId)
      .map((item) => ({
        ...item,
        replies: item.replies ? removeComment(item.replies) : [],
      }));
  };
  comments.value = removeComment(comments.value);
};

// HELPERS
const toggleModal = (id) => {
  selectedComment.value = id;
  showModal.value = true;
};
const formatTime = (date) => {
  const seconds = (new Date() - new Date(date)) / 1000;
  if (seconds < 60) return 'Just now';
  return formatDistanceToNowStrict(new Date(date), {
    addSuffix: true,
  });
};
</script>

<template>
  <button
    @click="$router.back()"
    class="absolute top-4 left-4 p-1 sm:p-2 rounded-full bg-inherit shadow-xl/30 hover:bg-gray-200 transition-colors">
    <ArrowLeft class="w-4 h-4" />
  </button>
  <div class="flex flex-col gap-4 w-full max-w-2xl mx-auto py-12 px-3 sm:px-4">
    <div v-for="comment in comments" :key="comment.id">
      <CommentCard
        :comment="comment"
        :isReply="false"
        :currentUser="props.currentUser"
        @openModal="toggleModal"
        @delete="deleteComment"
        @edit="editComment"
        @reply="addReply" />
    </div>
    <CommentBox
      v-if="props.currentUser"
      :currentUser="props.currentUser"
      @add-comment="addComment" />
  </div>
  <div v-if="showModal">
    <Modal
      :comment="selectedComment"
      @delete="
        (id) => {
          deleteComment(id);
          showModal = false;
        }
      "
      @cancel="showModal = false" />
  </div>
</template>
