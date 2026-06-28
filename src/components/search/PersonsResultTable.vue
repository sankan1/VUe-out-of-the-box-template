<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useDetailedSearchStore } from '@/stores/detailed-search.store'

const router = useRouter()
const store = useDetailedSearchStore()
const page = ref(0)

async function goToPage(newPage: number) {
  if (newPage < 0 || newPage >= store.totalPages) {
    return
  }
  page.value = newPage
  await store.fetchPersons({ page: newPage, size: 50 })
}
</script>

<template>
  <table class="w-full border-collapse text-left">
    <thead>
      <tr class="border-b">
        <th class="p-2">Name</th>
        <th class="p-2">Nickname</th>
        <th class="p-2">Identity code</th>
        <th class="p-2">Age</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="person in store.persons"
        :key="person.id"
        class="cursor-pointer border-b hover:bg-slate-50"
        @click="router.push({ name: 'Person', params: { id: person.id } })"
      >
        <td class="p-2">{{ person.name }}</td>
        <td class="p-2">{{ person.nickname }}</td>
        <td class="p-2">{{ person.identityCode }}</td>
        <td class="p-2">{{ person.age }}</td>
      </tr>
      <tr v-if="!store.persons.length">
        <td class="p-2 text-gray-500" colspan="4">No results.</td>
      </tr>
    </tbody>
  </table>
  <div v-if="store.totalPages > 1" class="mt-3 flex items-center gap-2">
    <button class="rounded border px-3 py-1" :disabled="page === 0" @click="goToPage(page - 1)">Prev</button>
    <span>Page {{ page + 1 }} / {{ store.totalPages }}</span>
    <button class="rounded border px-3 py-1" :disabled="page >= store.totalPages - 1" @click="goToPage(page + 1)">
      Next
    </button>
  </div>
</template>
