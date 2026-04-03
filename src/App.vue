<script setup>
import CommentCard from './components/CommentCard.vue';
import CommentBox from './components/CommentBox.vue';
import { ref, onMounted, computed } from 'vue';
import { formatDistanceToNowStrict } from 'date-fns';

const comments = ref([]);
const buildTree = (data, parentId = null) => {
  return data
    .filter((item) => item.parent_id === parentId)
    .map((item) => ({
      ...item,
      time: formatTime(item.created_at),
      replies: buildTree(data, item.id), // recursion
    }));
};

const fetchComments = async () => {
  const res = await fetch('http://localhost:4000/comments');
  const data = await res.json();
  comments.value = buildTree(data);
  console.log(comments.value);
};

onMounted(fetchComments);

// const allComments = computed(() =>
//   comments.value.filter((u) => u.parent_id === null),
// );
// const getReplies = (parentId) => {
//   return comments.value.filter((c) => c.parent_id === parentId);
// };

// ADD COMMENT
const addComment = async (data) => {
  const res = await fetch('http://localhost:4000/comments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_name: 'Jane',
      avatar: 'https://i.pravatar.cc/200',
      content: data.content,
      parent_id: null,
    }),
  });

  const newComment = await res.json();
  comments.value.push({
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
      user_name: 'Jane',
      avatar: 'https://i.pravatar.cc/200',
      content: data.content,
      parent_id: data.parent_id,
    }),
  });

  fetchComments();
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

  comments.value = comments.value.filter((u) => u.id !== id);
};

// HELPERS

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
    <div class="flex flex-col gap-4 w-1/2 mx-auto py-4">
      <div v-for="comment in comments" :key="comment.id">
        <!-- MAIN COMMENT -->
        <CommentCard
          :comment="comment"
          :isReply="false"
          @delete="deleteComment"
          @edit="editComment"
          @reply="addReply" />

        <!-- REPLIES -->
        <!-- <CommentCard
          v-for="(reply, index) in comment.replies"
          :key="reply.id"
          :comment="reply"
          :isReply="true"
          :replyIndex="index"
          @delete="deleteComment"
          @edit="editComment"
          @reply="addReply" /> -->
      </div>

      <!-- INPUT -->
      <CommentBox @add-comment="addComment" />
    </div>
  </div>
</template>
