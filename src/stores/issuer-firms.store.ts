import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useSessionStorage } from '@vueuse/core'
import type { AxiosRequestConfig } from 'axios'
import { searchIssuerFirms } from '@/generated/api/issuer-firms/issuer-firms'
import type { IssuerFirm, IssuerFirmSearchRequest } from '@/generated/api/model'

export interface IssuerFirmTableSort {
    field: string
    dir: 'asc' | 'desc'
}

const defaultFilters: IssuerFirmSearchRequest = {}

export const useIssuerFirmsStore = defineStore('issuerFirms', () => {
    const issuerFirms = ref<IssuerFirm[]>([])
    const totalSize = ref(0)
    const totalPages = ref(0)
    const loading = ref(false)
    const error = ref<Error | null>(null)

    const filters = useSessionStorage<IssuerFirmSearchRequest>('issuer_firms_filters', defaultFilters)
    const selectedSort = useSessionStorage<IssuerFirmTableSort>('issuer_firms_sort', { field: 'firmName', dir: 'asc' })
    const selectedPageSize = useSessionStorage<number>('issuer_firms_pageSize', 50)

    async function fetchIssuerFirms(page: number, options?: AxiosRequestConfig): Promise<void> {
        loading.value = true
        error.value = null
        try {
            const response = await searchIssuerFirms(
                filters.value,
                { page, size: selectedPageSize.value, sort: [`${selectedSort.value.field}:${selectedSort.value.dir}`] },
                options,
            )
            issuerFirms.value = response.data.content ?? []
            totalSize.value = response.data.totalSize ?? 0
            totalPages.value = response.data.totalPages ?? 0
        } catch (caughtError: unknown) {
            error.value = caughtError instanceof Error ? caughtError : new Error(String(caughtError))
        } finally {
            loading.value = false
        }
    }

    function setFilters(newFilters: IssuerFirmSearchRequest): void {
        filters.value = newFilters
    }

    return {
        issuerFirms,
        totalSize,
        totalPages,
        loading,
        error,
        filters,
        selectedSort,
        selectedPageSize,
        fetchIssuerFirms,
        setFilters,
    }
})
