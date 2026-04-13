<script setup>
const props = defineProps({ comment: Object });
const emit = defineEmits(['delete', 'cancel']);
const handleDelete = () => {
  emit('delete', props.comment);
};
</script>
<template>
  <div class="w-full h-screen bg-stone-900/50 top-0 fixed z-10">
    <div class="p-20 w-100 mx-auto my-25 bg-white rounded-lg">
      <h2 class="text-2xl font-bold mb-4">Confirm Deletion</h2>
      <p class="mb-6">Are you sure you want to delete this comment?</p>
      <div class="flex items-center justify-center gap-4">
        <button
          @click="emit('cancel')"
          class="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400">
          Cancel
        </button>
        <button
          @click="handleDelete"
          class="px-4 py-2 rounded bg-red-500 text-white hover:bg-gray-700">
          Delete
        </button>
      </div>
    </div>
  </div>
</template>
