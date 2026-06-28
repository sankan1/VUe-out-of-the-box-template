<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import { useDetailedSearchStore } from '@/stores/detailed-search.store'
import PersonsResultTable from '@/components/search/PersonsResultTable.vue'
import type { PersonSearchRequest } from '@/generated/api/model'

const store = useDetailedSearchStore()
const form = reactive<PersonSearchRequest>({
  name: '',
  nickname: '',
  hobby: '',
  identityCode: '',
  carMark: '',
  carModel: '',
  issuerFirmName: '',
  insurancePlan: '',
  ...store.searchCondition,
})

function removeEmptyFields(input: PersonSearchRequest): PersonSearchRequest {
  return Object.fromEntries(
      Object.entries(input).filter(([, value]) => value !== null && value !== undefined && value !== ''),
  ) as PersonSearchRequest
}

function applySearch() {
  store.setSearchCondition(removeEmptyFields(form))
  store.fetchPersons({ page: 0, size: 50 })
}

onMounted(() => {
  // Arriving here from the Persons tab's quick search, or returning to a previous detailed
  // search, should show results immediately rather than an empty form/table.
  if (store.isQuickSearch && store.quickSearchText) {
    store.fetchPersons({ page: 0, size: 50 })
  } else if (Object.keys(store.searchCondition).length > 0) {
    store.fetchPersons({ page: 0, size: 50 })
  }
})
</script>

<template>
  <div class="p-3">
    <p v-if="store.isQuickSearch && store.quickSearchText" class="mb-3 text-sm text-gray-500">
      Quick search results for "{{ store.quickSearchText }}"
    </p>
    <div class="mb-4 grid grid-cols-3 gap-3">
      <input v-model="form.name" class="rounded border px-3 py-2" placeholder="Name" />
      <input v-model="form.nickname" class="rounded border px-3 py-2" placeholder="Nickname" />
      <input v-model="form.hobby" class="rounded border px-3 py-2" placeholder="Hobby" />
      <input v-model="form.identityCode" class="rounded border px-3 py-2" placeholder="Identity code" />
      <input v-model="form.carMark" class="rounded border px-3 py-2" placeholder="Car mark" />
      <input v-model="form.carModel" class="rounded border px-3 py-2" placeholder="Car model" />
      <input v-model="form.issuerFirmName" class="rounded border px-3 py-2" placeholder="Issuer firm" />
      <input v-model="form.insurancePlan" class="rounded border px-3 py-2" placeholder="Insurance plan" />
    </div>
    <button class="mb-4 rounded bg-primary px-4 py-2 text-white" @click="applySearch">Apply search</button>
    <PersonsResultTable />
  </div>
</template>