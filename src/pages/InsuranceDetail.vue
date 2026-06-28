<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { getInsurance } from '@/generated/api/insurances/insurances'
import type { Insurance } from '@/generated/api/model'

const route = useRoute()
const insurance = ref<Insurance | null>(null)

onMounted(async () => {
  const id = Number(route.params.id)
  const response = await getInsurance(id)
  insurance.value = response.data
})
</script>

<template>
  <div class="p-3" v-if="insurance">
    <h1 class="mb-4 text-lg font-semibold">{{ insurance.insurerName }} — {{ insurance.plan }}</h1>
    <dl class="grid max-w-md grid-cols-2 gap-2">
      <dt class="text-gray-500">Person</dt>
      <dd>{{ insurance.personName }}</dd>
      <dt class="text-gray-500">Car</dt>
      <dd>{{ insurance.carMark }} {{ insurance.carModel }}</dd>
      <dt class="text-gray-500">Amount</dt>
      <dd>{{ insurance.amount }}</dd>
      <dt class="text-gray-500">Expiry date</dt>
      <dd>{{ insurance.expiryDate }}</dd>
      <dt class="text-gray-500">Days left</dt>
      <dd>{{ insurance.daysLeft }}</dd>
    </dl>
  </div>
</template>
