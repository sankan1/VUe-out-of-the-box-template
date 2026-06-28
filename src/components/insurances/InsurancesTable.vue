<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useInsurancesTabulator } from '@/components/insurances/useInsurancesTabulator'

const container = ref<HTMLElement | null>(null)
const router = useRouter()
useInsurancesTabulator(container, router)
</script>

<template>
  <div ref="container"></div>
</template>
