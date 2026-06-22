<script setup lang="ts">
import { useRouter } from 'vue-router'
import TopBar from '@/components/layout/TopBar.vue'
import menu from '@/main/simple-menu'

const router = useRouter()
</script>

<template>
  <div class="flex">
    <nav class="w-56 shrink-0 p-4">
      <RouterLink to="/" class="mb-6 block font-bold">Persons</RouterLink>
      <ul>
        <li v-for="item in menu" :key="item.pageName" class="mb-1">
          <button class="w-full rounded px-3 py-2 text-left hover:bg-slate-100" @click="router.push({ name: item.pageName })">
            {{ item.title }}
          </button>
        </li>
      </ul>
    </nav>

    <main class="min-h-screen flex-1 bg-slate-100 px-4 pb-4">
      <TopBar />
      <RouterView :key="$route.fullPath" />
    </main>
  </div>
</template>