<template>
  <!-- Card -->
  <div class="bg-white p-4 w-full relative rounded-lg shadow-md">
    <div class="flex items-center gap-3">
      <!-- Avatar -->
      <img
        src="https://i.pravatar.cc/300"
        alt="img"
        class="h-12 w-12 mb-auto rounded-full transition-transform duration-200 hover:scale-105 active:scale-95" />

      <!-- Input -->
      <textarea
        placeholder="Add a comment"
        class="flex-1 min-w-0 h-20 px-3 border rounded-lg"></textarea>

      <!-- Button -->
      <button
        type="submit"
        class="bg-blue-500 text-white px-4 py-2 mb-auto rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
        SEND
      </button>
    </div>
  </div>
</template>
