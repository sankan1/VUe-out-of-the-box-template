<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useAlertStore } from '@/stores/alert.store'

const alertStore = useAlertStore()
const { alerts } = storeToRefs(alertStore)
</script>

<template>
  <div class="fixed right-4 top-4 z-50 flex w-80 flex-col gap-2">
    <div
        v-for="alert in alerts"
        :key="alert.id"
        class="rounded border bg-white p-3 shadow"
        :class="{
        'border-success': alert.variant === 'success',
        'border-warning': alert.variant === 'warning',
        'border-danger': alert.variant === 'danger',
      }"
    >
      <div class="flex items-start">
        <div class="mr-2">
          <p class="font-semibold">{{ alert.title }}</p>
          <p class="text-sm">{{ alert.message }}</p>
        </div>
        <button class="ml-auto" @click="alertStore.removeAlert(alert.id)">×</button>
      </div>
    </div>
  </div>
</template>