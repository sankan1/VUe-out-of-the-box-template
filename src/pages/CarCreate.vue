<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { createCar } from '@/generated/api/cars/cars'
import type { CarCreateRequest } from '@/generated/api/model'
import { useAlertUtils } from '@/utils/alert-utils'

const router = useRouter()
const { pushSuccessAlert, pushDangerAlert } = useAlertUtils()

const form = reactive<CarCreateRequest>({ mark: '', model: '', issuerFirmName: '' })
const submitting = ref(false)

async function submit() {
  if (!form.mark || !form.model || !form.issuerFirmName) {
    pushDangerAlert('Missing fields', 'Mark, model and issuer firm are all required.')
    return
  }
  submitting.value = true
  try {
    const response = await createCar(form)
    pushSuccessAlert('Car created', `${form.mark} ${form.model} was created successfully.`)
    router.push({ name: 'Car', params: { id: response.data.id } })
  } catch {
    pushDangerAlert('Could not create car', 'Something went wrong while creating the car.')
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="p-3">
    <h1 class="mb-4 text-lg font-semibold">New car</h1>
    <div class="grid max-w-md grid-cols-1 gap-3">
      <input v-model="form.mark" class="rounded border px-3 py-2" placeholder="Mark *" />
      <input v-model="form.model" class="rounded border px-3 py-2" placeholder="Model *" />
      <input v-model="form.issuerFirmName" class="rounded border px-3 py-2" placeholder="Issuer firm (reseller) *" />
      <div class="flex gap-2">
        <button class="rounded bg-primary px-4 py-2 text-white" :disabled="submitting" @click="submit">Create</button>
        <button class="rounded border px-4 py-2" @click="router.push({ name: 'Cars' })">Cancel</button>
      </div>
    </div>
  </div>
</template>
