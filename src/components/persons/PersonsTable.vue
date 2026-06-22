<script setup lang="ts">
import { onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useEventBus } from '@vueuse/core'
import { usePersonsTabulator } from '@/components/persons/usePersonsTabulator'
import { EventBusConstants } from '@/constants/EventBusConstants'
import { PersonsEvent } from '@/types/enums/PersonsEvent'
import { useFlag } from '@unleash/proxy-client-vue'
import { FeatureFlag } from '@/constants/feature-flags'

const container = ref<HTMLElement | null>(null)
const router = useRouter()
const { reloadTable } = usePersonsTabulator(container, router)
const personsTableFlagEnabled = useFlag(FeatureFlag.PERSONS_TABLE)

const personsEventUpdateBus = useEventBus<PersonsEvent>(EventBusConstants.PERSONS_EVENT_UPDATE)
const unsubscribe = personsEventUpdateBus.on((event) => {
  if (event === PersonsEvent.UPDATE) {
    reloadTable()
  }
})
onUnmounted(unsubscribe)
</script>

<template>
  <div v-if="personsTableFlagEnabled" ref="container"></div>
</template>