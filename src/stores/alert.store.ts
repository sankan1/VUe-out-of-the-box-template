import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface AlertItem {
    id: string
    variant: 'success' | 'warning' | 'danger'
    icon: string
    title: string
    message: string
    autoclose: boolean
}

export const useAlertStore = defineStore('alert', () => {
    const alerts = ref<AlertItem[]>([])
    const autocloseTimers = new Map<string, number>()

    function pushAlert(payload: Omit<AlertItem, 'id'>): string {
        const randomValues = new Uint32Array(1)
        window.crypto.getRandomValues(randomValues)
        const id = `${Date.now()}-${randomValues.toString().slice(0, 6)}`
        alerts.value.push({ id, ...payload })
        if (payload.autoclose) {
            const timer = window.setTimeout(() => removeAlert(id), 5000)
            autocloseTimers.set(id, timer)
        }
        return id
    }

    function removeAlert(id: string): void {
        alerts.value = alerts.value.filter((alert) => alert.id !== id)
        const timer = autocloseTimers.get(id)
        if (timer) {
            window.clearTimeout(timer)
            autocloseTimers.delete(id)
        }
    }

    return { alerts, pushAlert, removeAlert }
})