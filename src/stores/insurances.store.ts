import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useSessionStorage } from '@vueuse/core'
import type { AxiosRequestConfig } from 'axios'
import { searchInsurances } from '@/generated/api/insurances/insurances'
import type { Insurance, InsuranceSearchRequest } from '@/generated/api/model'
import { nullableSerializer } from '@/utils/storage-utils'

export interface InsuranceTableSort {
    field: string
    dir: 'asc' | 'desc'
}

const defaultFilters: InsuranceSearchRequest = {}

export const useInsurancesStore = defineStore('insurances', () => {
    const insurances = ref<Insurance[]>([])
    const totalSize = ref(0)
    const totalPages = ref(0)
    const loading = ref(false)
    const error = ref<Error | null>(null)

    const filters = useSessionStorage<InsuranceSearchRequest>('insurances_filters', defaultFilters)
    const selectedSort = useSessionStorage<InsuranceTableSort>('insurances_sort', { field: 'expiryDate', dir: 'asc' })
    const selectedPageSize = useSessionStorage<number>('insurances_pageSize', 50)
    const selectedRowId = useSessionStorage<number | null>('insurances_selectedRowId', null, { serializer: nullableSerializer })

    async function fetchInsurances(page: number, options?: AxiosRequestConfig): Promise<void> {
        loading.value = true
        error.value = null
        try {
            const response = await searchInsurances(
                filters.value,
                { page, size: selectedPageSize.value, sort: [`${selectedSort.value.field}:${selectedSort.value.dir}`] },
                options,
            )
            insurances.value = response.data.content ?? []
            totalSize.value = response.data.totalSize ?? 0
            totalPages.value = response.data.totalPages ?? 0
        } catch (caughtError: unknown) {
            error.value = caughtError instanceof Error ? caughtError : new Error(String(caughtError))
        } finally {
            loading.value = false
        }
    }

    function setFilters(newFilters: InsuranceSearchRequest): void {
        filters.value = newFilters
    }

    return {
        insurances,
        totalSize,
        totalPages,
        loading,
        error,
        filters,
        selectedSort,
        selectedPageSize,
        selectedRowId,
        fetchInsurances,
        setFilters,
    }
})
