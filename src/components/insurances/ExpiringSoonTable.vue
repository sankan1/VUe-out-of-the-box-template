<script setup lang="ts">
import { useExpiringSoonStore } from '@/stores/expiring-soon.store'

const expiringSoonStore = useExpiringSoonStore()
</script>

<template>
  <table class="w-full border-collapse text-left">
    <thead>
      <tr class="border-b">
        <th class="p-2">Person</th>
        <th class="p-2">Car</th>
        <th class="p-2">Insurer</th>
        <th class="p-2">Plan</th>
        <th class="p-2">Amount</th>
        <th class="p-2">Expiry date</th>
        <th class="p-2">Days left</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in expiringSoonStore.items" :key="item.id" class="border-b">
        <td class="p-2">{{ item.personName }}</td>
        <td class="p-2">{{ item.carMark }} {{ item.carModel }}</td>
        <td class="p-2">{{ item.insurerName }}</td>
        <td class="p-2">{{ item.plan }}</td>
        <td class="p-2">{{ item.amount }}</td>
        <td class="p-2">{{ item.expiryDate }}</td>
        <td class="p-2" :class="{ 'font-semibold text-danger': (item.daysLeft ?? 0) < 7 }">{{ item.daysLeft }}</td>
      </tr>
      <tr v-if="!expiringSoonStore.items.length">
        <td class="p-2 text-gray-500" colspan="7">No insurances are expiring within 30 days.</td>
      </tr>
    </tbody>
  </table>
</template>
