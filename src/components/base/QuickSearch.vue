<script setup lang="ts">
import { computed } from 'vue'
import useVuelidate from '@vuelidate/core'
import { minLength } from '@vuelidate/validators'

const model = defineModel<string>({ required: true })
const emit = defineEmits<{ search: []; clear: [] }>()

const rules = { model: { minLength: minLength(2) } }
const validator = useVuelidate(rules, { model })
const hasText = computed(() => model.value.trim().length > 0)

async function onEnter() {
  if (await validator.value.$validate()) {
    emit('search')
  }
}
</script>

<template>
  <div class="flex items-center gap-2">
    <input
        v-model="model"
        class="w-72 rounded border px-3 py-2"
        placeholder="Search persons…"
        @keyup.enter="onEnter"
    />
    <button class="rounded bg-primary px-3 py-2 text-white" @click="onEnter">Search</button>
    <button v-if="hasText" class="rounded border px-3 py-2" @click="emit('clear')">Clear</button>
  </div>
</template>