import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useSessionStorage } from '@vueuse/core'
import type { AxiosRequestConfig } from 'axios'
import { searchPersons } from '@/generated/api/persons/persons'
import type { Person, PersonSearchRequest } from '@/generated/api/model'
import { nullableSerializer } from '@/utils/storage-utils'

export interface PersonTableSort {
    field: string
    dir: 'asc' | 'desc'
}

const defaultFilters: PersonSearchRequest = {}

export const usePersonsStore = defineStore('persons', () => {
    const persons = ref<Person[]>([])
    const totalSize = ref(0)
    const totalPages = ref(0)
    const loading = ref(false)
    const error = ref<Error | null>(null)

    // Ephemeral UI state persisted for the browser session (Chapter 6)
    const filters = useSessionStorage<PersonSearchRequest>('persons_filters', defaultFilters)
    const selectedSort = useSessionStorage<PersonTableSort>('persons_sort', { field: 'name', dir: 'asc' })
    const selectedPageSize = useSessionStorage<number>('persons_pageSize', 50)
    const selectedRowId = useSessionStorage<number | null>('persons_selectedRowId', null, { serializer: nullableSerializer })

    async function fetchPersons(page: number, options?: AxiosRequestConfig): Promise<void> {
        loading.value = true
        error.value = null
        try {
            const response = await searchPersons(
                filters.value,
                { page, size: selectedPageSize.value, sort: [`${selectedSort.value.field}:${selectedSort.value.dir}`] },
                options,
            )
            persons.value = response.data.content ?? []
            totalSize.value = response.data.totalSize ?? 0
            totalPages.value = response.data.totalPages ?? 0
        } catch (caughtError: unknown) {
            error.value = caughtError instanceof Error ? caughtError : new Error(String(caughtError))
        } finally {
            loading.value = false
        }
    }

    function setFilters(newFilters: PersonSearchRequest): void {
        filters.value = newFilters
    }

    return {
        persons,
        totalSize,
        totalPages,
        loading,
        error,
        filters,
        selectedSort,
        selectedPageSize,
        selectedRowId,
        fetchPersons,
        setFilters,
    }
})