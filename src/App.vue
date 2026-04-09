<script setup>
import CommentCard from './components/CommentCard.vue';
import CommentBox from './components/CommentBox.vue';
import Modal from './components/Modal.vue';
import { ref, onMounted, computed } from 'vue';
import { formatDistanceToNowStrict } from 'date-fns';

const comments = ref([]);
const selectedComment = ref(null);
const showModal = ref(false);
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
const currentUser = ref(users[0]); // Simulate logged-in user
const replyTree = (data, parentId = null) => {
  console.log(data);
  return data
    .filter((item) => item.parent_id === parentId)
    .map((item) => ({
      ...item,
      time: formatTime(item.createdAt),
      replies: replyTree(data, item.id), // recursion
    }));
};

const fetchComments = async () => {
  const res = await fetch(`${apiUrl}?populate=*`);
  const jsonData = await res.json();
  console.log(jsonData);
  const formatted = jsonData.data.map((item) => ({
    id: item.id,
    username: item.username,
    avatar: item.avatar,
    content: item.content,
    created_at: item.createdAt,
    parent_id: item.parent?.id || null,
  }));
  console.log(formatted);
  comments.value = replyTree(formatted);
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
  const newComment = await res.json();
  comments.value.push({
    id: newComment.data.id,
    username: newComment.data.attributes.username,
    avatar: newComment.data.attributes.avatar,
    content: newComment.data.attributes.content,
    parent_id: null,
    time: formatTime(newComment.data.attributes.createdAt),
  });
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
const editComment = async ({ id, content }) => {
  await fetch(`${apiUrl}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      data: {
        content,
      },
    }),
  });
  fetchComments();
};

// DELETE
const deleteComment = async (id) => {
  await fetch(`${apiUrl}/${id}`, {
    method: 'DELETE',
  });
  const removeComment = (list) => {
    return list
      .filter((item) => item.id !== id)
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
  <div class="bg-[#E7EDE7] w-full min-h-screen">
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
    <div class="flex flex-col gap-4 w-1/2 mx-auto py-4">
      <div v-for="comment in comments" :key="comment.id">
        <!-- MAIN COMMENT -->
        <CommentCard
          :comment="comment"
          :isReply="false"
          :currentUser="currentUser"
          @openModal="toggleModal"
          @delete="deleteComment"
          @edit="editComment"
          @reply="addReply" />
      </div>
      <div class="flex gap-3 mb-4">
        <div
          v-for="user in users"
          :key="user.id"
          @click="currentUser = user"
          class="cursor-pointer flex items-center gap-2 p-2 border rounded-lg"
          :class="currentUser.id === user.id ? 'border-blue-500' : ''">
          <img :src="user.avatar" class="h-8 w-8 rounded-full" />
          <span>{{ user.username }}</span>
        </div>
      </div>
      <!-- INPUT -->
      <CommentBox :currentUser="currentUser" @add-comment="addComment" />
    </div>
  </div>
</template>
