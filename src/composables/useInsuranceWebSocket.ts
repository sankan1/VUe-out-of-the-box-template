import { onUnmounted, watch } from 'vue'
import { useIntervalFn, useWebSocket } from '@vueuse/core'
import { useExpiringSoonStore } from '@/stores/expiring-soon.store'
import type { Insurance } from '@/generated/api/model'

/**
 * /ws/insurance replies to every message (including this heartbeat) with the current
 * expiring-soon snapshot instead of a bare pong, so vueuse's `heartbeat` pong-matching
 * option doesn't apply here — the keep-alive ping is driven manually instead.
 */
export function useInsuranceWebSocket() {
    const expiringSoonStore = useExpiringSoonStore()
    const wsUrl = `${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.host}/ws/insurance`

    const { data: wsData, send, close } = useWebSocket(wsUrl, {
        autoReconnect: { retries: 10, delay: 1000 },
    })

    const { pause } = useIntervalFn(() => send('ping'), 10000)

    watch(wsData, (raw: string | null) => {
        if (!raw) {
            return
        }
        try {
            const items = JSON.parse(raw) as Insurance[]
            expiringSoonStore.setItems(items)
        } catch {
            // not a JSON snapshot frame - ignore
        }
    })

    onUnmounted(() => {
        pause()
        close()
    })
}
