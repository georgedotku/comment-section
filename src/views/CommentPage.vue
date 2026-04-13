<script setup>
import CommentCard from '../components/CommentCard.vue';
import CommentBox from '../components/CommentBox.vue';
import Modal from '../components/Modal.vue';
import { useRouter } from 'vue-router';
import { ref, onMounted, computed } from 'vue';
import { formatDistanceToNowStrict } from 'date-fns';
const router = useRouter();
const props = defineProps({
  id: String,
  users: Array,
});
const comments = ref([]);
const selectedComment = ref(null);
const showModal = ref(false);
const showMenu = ref(false);
const currentUser = ref(
  JSON.parse(localStorage.getItem('currentUser')) || null,
);
const apiUrl =
  import.meta.env.MODE === 'development'
    ? 'http://localhost:1337/api/comments'
    : 'https://comments-apiv2.onrender.com/comments';
const users = [
  {
    id: 1,
    username: 'amyrobson',
    avatar: 'https://i.pravatar.cc/100?img=1',
  },
  {
    id: 2,
    username: 'maxblagun',
    avatar: 'https://i.pravatar.cc/100?img=2',
  },
  {
    id: 3,
    username: 'ramsesmiron',
    avatar: 'https://i.pravatar.cc/100?img=3',
  },
  {
    id: 4,
    username: 'juliusomo',
    avatar: 'https://i.pravatar.cc/100?img=4',
  },
];

const switchUser = (user) => {
  currentUser.value = user;
  localStorage.setItem('currentUser', JSON.stringify(user));
  showMenu.value = false;
  router.push({ name: 'comment', params: { id: user.id } });
};
const commentTree = (data, parentId = null, level = 0) => {
  console.log(data);
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
  const res = await fetch(`${apiUrl}?populate=*`);
  const jsonData = await res.json();
  console.log(jsonData);
  const formatted = jsonData.data.map((item) => ({
    id: item.id,
    documentId: item.documentId,
    username: item.username,
    avatar: item.avatar,
    content: item.content,
    created_at: item.createdAt,
    time: formatTime(item.createdAt),
    parent_id: item.parent?.id || null,
  }));
  console.log(formatted);
  comments.value = commentTree(formatted);
};
onMounted(fetchComments);

// ADD COMMENT
const addComment = async (data) => {
  const res = await fetch(`${apiUrl}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      data: {
        username: data.username,
        avatar: data.avatar,
        content: data.content,
        parent: null,
      },
    }),
  });
  if (res.ok) {
    fetchComments();
  } else {
    console.error('Failed to add comment');
  }
};

// ADD REPLY
const addReply = async (data) => {
  const res = await fetch(`${apiUrl}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      data: {
        username: data.username,
        avatar: data.avatar,
        content: data.content,
        parent: data.parent_id,
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
  <div
    @click="showMenu = !showMenu"
    class="rounded-md bg-inherit text-black ring-1 ring-gray-300 shadow-xl/30 px-3 py-1 mb-4 fixed top-4 left-4 z-50 cursor-pointer">
    SELECT USER
  </div>
  <div
    v-if="showMenu"
    class="fixed inset-0 bg-black/30 z-30"
    @click="showMenu = false"></div>

  <div
    v-if="showMenu"
    class="fixed top-0 left-0 h-64 w-64 bg-inherit shadow-xl z-40 p-4">
    <h3 class="font-bold mt-4">SWITCH USER</h3>
    <div
      v-for="user in users"
      :key="user.id"
      @click="switchUser(user)"
      class="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-gray-100">
      <img :src="user.avatar" class="w-8 h-8 rounded-full" />
      <span>{{ user.username }}</span>
    </div>
  </div>
  <div class="flex flex-col gap-4 w-full max-w-2xl mx-auto py-12 px-3 sm:px-4">
    <div v-for="comment in comments" :key="comment.id">
      <CommentCard
        :comment="comment"
        :isReply="false"
        :currentUser="currentUser"
        @openModal="toggleModal"
        @delete="deleteComment"
        @edit="editComment"
        @reply="addReply" />
    </div>
    <CommentBox
      v-if="currentUser"
      :currentUser="currentUser"
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
  <!-- <div class="border bg-white flex gap-3 mb-4">
      <div
        v-for="user in users"
        :key="user.id"
        @click="currentUser = user"
        class="cursor-pointer flex items-center gap-2 p-2 border rounded-lg"
        :class="currentUser.id === user.id ? 'border-blue-500' : ''">
        <img :src="user.avatar" class="h-8 w-8 rounded-full" />
        <span>{{ user.username }}</span>
      </div>
    </div> -->
</template>
