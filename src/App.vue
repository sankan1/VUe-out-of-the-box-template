<script setup lang="ts">
import { watch } from 'vue'
import { useEventBus, useWebSocket } from '@vueuse/core'
import AlertContainer from '@/components/alert/AlertContainer.vue'
import { EventBusConstants } from '@/constants/EventBusConstants'
import { PersonsEvent } from '@/types/enums/PersonsEvent'

const personsEventUpdateBus = useEventBus<PersonsEvent>(EventBusConstants.PERSONS_EVENT_UPDATE)

const wsUrl = `${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.host}/ws/persons`
const { data: wsData } = useWebSocket(wsUrl, {
  autoReconnect: {
    retries: 10,
    delay: 1000,
    onFailed() {
      console.error('WebSocket: failed to reconnect; probing whether the session is still alive')
      import('@/generated/api/user/user').then(({ fetchUserInfo }) => fetchUserInfo().catch(() => undefined))
    },
  },
  heartbeat: { message: 'ping', interval: 10000, pongTimeout: 5000 },
})

watch(wsData, (newSocketData) => {
  if (newSocketData === PersonsEvent.UPDATE) {
    personsEventUpdateBus.emit(PersonsEvent.UPDATE)
  }
})
</script>

<template>
  <AlertContainer />
  <RouterView />
</template>