<script setup lang="ts">
import { useRouter } from 'vue-router'
import PersonsTable from '@/components/persons/PersonsTable.vue'
import QuickSearch from '@/components/base/QuickSearch.vue'
import { useQuickSearch } from '@/composables/useQuickSearch'

const router = useRouter()
const { quickSearchText, handleSearch, handleClear } = useQuickSearch({ shouldNavigate: true })
</script>

<template>
  <div class="p-3">
    <div class="mb-4 flex items-center justify-between">
      <QuickSearch v-model="quickSearchText" @search="handleSearch" @clear="handleClear" />
      <button
        v-visible-to-end-user-group
        v-visible-to-admin-group
        class="rounded bg-primary px-3 py-1 text-white"
        @click="router.push({ name: 'PersonCreate' })"
      >
        New person
      </button>
    </div>
    <PersonsTable />
  </div>
</template>