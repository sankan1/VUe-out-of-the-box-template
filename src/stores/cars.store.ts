import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useSessionStorage } from '@vueuse/core'
import type { AxiosRequestConfig } from 'axios'
import { searchCars } from '@/generated/api/cars/cars'
import type { Car, CarSearchRequest } from '@/generated/api/model'
import { nullableSerializer } from '@/utils/storage-utils'

export interface CarTableSort {
    field: string
    dir: 'asc' | 'desc'
}

const defaultFilters: CarSearchRequest = {}

export const useCarsStore = defineStore('cars', () => {
    const cars = ref<Car[]>([])
    const totalSize = ref(0)
    const totalPages = ref(0)
    const loading = ref(false)
    const error = ref<Error | null>(null)

    const filters = useSessionStorage<CarSearchRequest>('cars_filters', defaultFilters)
    const selectedSort = useSessionStorage<CarTableSort>('cars_sort', { field: 'mark', dir: 'asc' })
    const selectedPageSize = useSessionStorage<number>('cars_pageSize', 50)
    const selectedRowId = useSessionStorage<number | null>('cars_selectedRowId', null, { serializer: nullableSerializer })

    async function fetchCars(page: number, options?: AxiosRequestConfig): Promise<void> {
        loading.value = true
        error.value = null
        try {
            const response = await searchCars(
                filters.value,
                { page, size: selectedPageSize.value, sort: [`${selectedSort.value.field}:${selectedSort.value.dir}`] },
                options,
            )
            cars.value = response.data.content ?? []
            totalSize.value = response.data.totalSize ?? 0
            totalPages.value = response.data.totalPages ?? 0
        } catch (caughtError: unknown) {
            error.value = caughtError instanceof Error ? caughtError : new Error(String(caughtError))
        } finally {
            loading.value = false
        }
    }

    function setFilters(newFilters: CarSearchRequest): void {
        filters.value = newFilters
    }

    return {
        cars,
        totalSize,
        totalPages,
        loading,
        error,
        filters,
        selectedSort,
        selectedPageSize,
        selectedRowId,
        fetchCars,
        setFilters,
    }
})
