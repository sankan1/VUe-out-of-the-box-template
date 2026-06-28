<script setup lang="ts">
import { ref } from 'vue'
import { useIssuerFirmsTabulator } from '@/components/issuer-firms/useIssuerFirmsTabulator'

const container = ref<HTMLElement | null>(null)
useIssuerFirmsTabulator(container)
</script>

<template>
  <div ref="container"></div>
</template>
