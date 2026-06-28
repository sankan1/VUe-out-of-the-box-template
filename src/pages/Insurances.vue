<script setup lang="ts">
import { useRouter } from 'vue-router'
import InsurancesTable from '@/components/insurances/InsurancesTable.vue'

const router = useRouter()
</script>

<template>
  <div class="p-3">
    <div class="mb-4 flex items-center justify-between">
      <h1 class="text-lg font-semibold">Insurances</h1>
      <button
        v-visible-to-head-user-group
        v-visible-to-admin-group
        class="rounded bg-primary px-3 py-1 text-white"
        @click="router.push({ name: 'InsuranceCreate' })"
      >
        New insurance
      </button>
    </div>
    <InsurancesTable />
  </div>
</template>
