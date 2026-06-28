<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { createPerson } from '@/generated/api/persons/persons'
import type { PersonCreateRequest } from '@/generated/api/model'
import { useAlertUtils } from '@/utils/alert-utils'

const router = useRouter()
const { pushSuccessAlert, pushDangerAlert } = useAlertUtils()

const form = reactive<PersonCreateRequest>({ name: '', identityCode: '', nickname: '', age: undefined })
const submitting = ref(false)

async function submit() {
  if (!form.name || !form.identityCode) {
    pushDangerAlert('Missing fields', 'Name and identity code are required.')
    return
  }
  submitting.value = true
  try {
    await createPerson(form)
    pushSuccessAlert('Person created', `${form.name} was created successfully.`)
    router.push({ name: 'Persons' })
  } catch {
    pushDangerAlert('Could not create person', 'Something went wrong while creating the person.')
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="p-3">
    <h1 class="mb-4 text-lg font-semibold">New person</h1>
    <div class="grid max-w-md grid-cols-1 gap-3">
      <input v-model="form.name" class="rounded border px-3 py-2" placeholder="Name *" />
      <input v-model="form.identityCode" class="rounded border px-3 py-2" placeholder="Identity code *" />
      <input v-model="form.nickname" class="rounded border px-3 py-2" placeholder="Nickname" />
      <input v-model.number="form.age" type="number" class="rounded border px-3 py-2" placeholder="Age" />
      <div class="flex gap-2">
        <button class="rounded bg-primary px-4 py-2 text-white" :disabled="submitting" @click="submit">Create</button>
        <button class="rounded border px-4 py-2" @click="router.push({ name: 'Persons' })">Cancel</button>
      </div>
    </div>
  </div>
</template>
