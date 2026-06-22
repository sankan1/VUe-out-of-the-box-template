<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

const route = useRoute()

const logout = () => {
  useAuthStore().user = undefined
  window.location.href = '/api/logout'
}
</script>

<template>
  <header class="flex items-center py-3">
    <span class="mr-auto font-semibold">{{ route.name }}</span>
    <button class="rounded px-3 py-1 hover:bg-slate-200" @click="logout">Log out</button>
  </header>
</template>