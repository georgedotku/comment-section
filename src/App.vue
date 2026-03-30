<template>
  <div class="bg-[#E7EDE7] w-full min-h-screen">
    <div class="flex flex-col gap-4 w-1/2 mx-auto py-4">
      <!-- COMMENTS -->
      <Card
        v-for="comment in allComments"
        :key="comment.id"
        :user="comment"
        :isReply="false"
        @delete="deleteComment"
        @edit="editComment"
        @reply="addReply" />
      <!-- REPLIES (BOTTOM) -->
      <Card
        v-for="(reply, index) in allReplies"
        :key="reply.id"
        :user="reply"
        :isReply="true"
        :replyIndex="index"
        @delete="deleteComment"
        @edit="editComment"
        @reply="addReply" />
      <!-- INPUT -->
      <CommentBox @add-comment="addComment" />
    </div>
  </div>
</template>

<script setup>
import Card from './components/Card.vue';
import CommentBox from './components/CommentBox.vue';
import { ref, onMounted, computed } from 'vue';
import { formatDistanceToNowStrict } from 'date-fns';

const user = ref([]);

const fetchComments = async () => {
  const res = await fetch('http://localhost:4000/comments');
  const data = await res.json();
  user.value = data.map((c) => ({
    ...c,
    time: formatTime(c.created_at),
  }));
};
onMounted(fetchComments);

const allComments = computed(() =>
  user.value.filter((u) => u.parent_id === null),
);
const allReplies = computed((parentId) =>
  user.value.filter((u) => u.parent_id === parentId),
);
// const getReplies = (id) => {
//   return user.value
//     .filter((u) => u.parent_id === id)
//     .map((r) => ({
//       ...r,
//       time: formatTime(r.created_at),
//     }));
// };

// ADD COMMENT
const addComment = async (data) => {
  const res = await fetch('http://localhost:4000/comments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_name: 'Jane Doe',
      avatar: 'https://i.pravatar.cc/200',
      content: data.content,
      parent_id: null,
    }),
  });

  const newComment = await res.json();
  user.value.push({
    ...newComment,
    time: formatTime(newComment.created_at),
  });
};

// ADD REPLY
const addReply = async (data) => {
  const res = await fetch('http://localhost:4000/comments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_name: 'Jane Doe',
      avatar: 'https://i.pravatar.cc/200',
      content: data.content,
      parent_id: data.parent_id,
    }),
  });

  const newReply = await res.json();
  user.value.push({
    ...newReply,
    time: formatTime(newReply.created_at),
  });
};

// EDIT
const editComment = async ({ id, content }) => {
  await fetch(`http://localhost:4000/comments/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  });

  fetchComments();
};

// DELETE
const deleteComment = async (id) => {
  await fetch(`http://localhost:4000/comments/${id}`, {
    method: 'DELETE',
  });

  user.value = user.value.filter((u) => u.id !== id);
};

// HELPERS
function getCurrentUser() {
  let user = localStorage.getItem('user');

  if (!user) {
    const randomId = Math.floor(Math.random() * 1000);
    user = {
      name: `User${randomId}`,
      avatar: `https://i.pravatar.cc/150?img=${randomId}`,
    };
    localStorage.setItem('user', JSON.stringify(user));
  }

  return JSON.parse(user);
}

const formatTime = (date) => {
  const seconds = (new Date() - new Date(date)) / 1000;
  if (seconds < 60) return 'Just now';

  return formatDistanceToNowStrict(new Date(date), {
    addSuffix: true,
  });
};
</script>
