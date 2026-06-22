<script setup lang="ts">
import PersonsTable from '@/components/persons/PersonsTable.vue'
import QuickSearch from '@/components/base/QuickSearch.vue'
import { useQuickSearch } from '@/composables/useQuickSearch'

const { quickSearchText, handleSearch, handleClear } = useQuickSearch({ shouldNavigate: true })
</script>

<template>
  <div class="p-3">
    <div class="mb-4 flex items-center justify-between">
      <QuickSearch v-model="quickSearchText" @search="handleSearch" @clear="handleClear" />
      <button v-visible-to-head-user-group class="rounded bg-primary px-3 py-1 text-white">New person</button>
    </div>
    <PersonsTable />
  </div>
</template>