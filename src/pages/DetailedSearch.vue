<script setup lang="ts">
import { reactive } from 'vue'
import { useDetailedSearchStore } from '@/stores/detailed-search.store'
import PersonsResultTable from '@/components/search/PersonsResultTable.vue'
import type { PersonSearchRequest } from '@/generated/api/model'

const store = useDetailedSearchStore()
const form = reactive<PersonSearchRequest>({ name: '', nickname: '', hobby: '' })

function removeEmptyFields(input: PersonSearchRequest): PersonSearchRequest {
  return Object.fromEntries(
      Object.entries(input).filter(([, value]) => value !== null && value !== undefined && value !== ''),
  ) as PersonSearchRequest
}

function applySearch() {
  store.setSearchCondition(removeEmptyFields(form))
  store.fetchPersons({ page: 0, size: 50 })
}
</script>

<template>
  <div class="p-3">
    <div class="mb-4 grid grid-cols-3 gap-3">
      <input v-model="form.name" class="rounded border px-3 py-2" placeholder="Name" />
      <input v-model="form.nickname" class="rounded border px-3 py-2" placeholder="Nickname" />
      <input v-model="form.hobby" class="rounded border px-3 py-2" placeholder="Hobby" />
    </div>
    <button class="mb-4 rounded bg-primary px-4 py-2 text-white" @click="applySearch">Apply search</button>
    <PersonsResultTable />
  </div>
</template>