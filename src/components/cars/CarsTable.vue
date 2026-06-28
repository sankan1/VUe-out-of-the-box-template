<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCarsTabulator } from '@/components/cars/useCarsTabulator'

const container = ref<HTMLElement | null>(null)
const router = useRouter()
useCarsTabulator(container, router)
</script>

<template>
  <div ref="container"></div>
</template>
