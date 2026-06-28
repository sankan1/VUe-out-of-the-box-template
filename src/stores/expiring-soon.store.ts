import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getExpiringSoonInsurances } from '@/generated/api/insurances/insurances'
import type { Insurance } from '@/generated/api/model'

export const useExpiringSoonStore = defineStore('expiringSoon', () => {
    const items = ref<Insurance[]>([])
    const loading = ref(false)
    const lastUpdated = ref<Date | null>(null)

    function setItems(newItems: Insurance[]): void {
        items.value = newItems
        lastUpdated.value = new Date()
    }

    async function fetchInitial(): Promise<void> {
        loading.value = true
        try {
            const response = await getExpiringSoonInsurances()
            setItems(response.data ?? [])
        } finally {
            loading.value = false
        }
    }

    return { items, loading, lastUpdated, setItems, fetchInitial }
})
