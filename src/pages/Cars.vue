<script setup lang="ts">
import { useRouter } from 'vue-router'
import CarsTable from '@/components/cars/CarsTable.vue'

const router = useRouter()
</script>

<template>
  <div class="p-3">
    <div class="mb-4 flex items-center justify-between">
      <h1 class="text-lg font-semibold">Cars</h1>
      <button
        v-visible-to-end-user-group
        v-visible-to-admin-group
        class="rounded bg-primary px-3 py-1 text-white"
        @click="router.push({ name: 'CarCreate' })"
      >
        New car
      </button>
    </div>
    <CarsTable />
  </div>
</template>
