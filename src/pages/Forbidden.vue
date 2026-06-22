<script setup lang="ts">
const logout = () => {
  window.location.href = '/api/logout'
}
</script>

<template>
  <div class="grid min-h-screen place-items-center gap-4 text-center">
    <div>
      <h1 class="text-2xl font-bold">403 — Access denied</h1>
      <p class="mt-2">Your account does not have permission to use this application.</p>
      <button class="mt-4 rounded bg-primary px-4 py-2 text-white" @click="logout">Log out</button>
    </div>
  </div>
</template>