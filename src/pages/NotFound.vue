<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<template>
  <div class="grid min-h-screen place-items-center gap-4 text-center">
    <div>
      <h1 class="text-2xl font-bold">404 — Not found</h1>
      <button class="mt-4 rounded bg-primary px-4 py-2 text-white" @click="router.push('/')">Go home</button>
    </div>
  </div>
</template>