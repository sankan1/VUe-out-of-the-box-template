<script setup lang="ts">
import { onMounted } from 'vue'
import { useExpiringSoonStore } from '@/stores/expiring-soon.store'
import { useInsuranceWebSocket } from '@/composables/useInsuranceWebSocket'
import ExpiringSoonTable from '@/components/insurances/ExpiringSoonTable.vue'

const expiringSoonStore = useExpiringSoonStore()
useInsuranceWebSocket()

onMounted(() => {
  expiringSoonStore.fetchInitial()
})
</script>

<template>
  <div class="p-3">
    <h1 class="mb-4 text-lg font-semibold">Insurance expiring soon</h1>
    <ExpiringSoonTable />
  </div>
</template>
