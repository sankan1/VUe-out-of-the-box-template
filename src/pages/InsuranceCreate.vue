<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { createInsurance } from '@/generated/api/insurances/insurances'
import type { InsuranceCreateRequest } from '@/generated/api/model'
import { useAlertUtils } from '@/utils/alert-utils'

const router = useRouter()
const { pushSuccessAlert, pushDangerAlert } = useAlertUtils()

const planSuggestions = ['KASKO', 'OSAKASKO', 'Liability']

const form = reactive<Partial<InsuranceCreateRequest>>({
  personId: undefined,
  carId: undefined,
  insurerName: '',
  plan: '',
  amount: undefined,
  expiryDate: '',
})
const submitting = ref(false)

async function submit() {
  if (!form.personId || !form.carId || !form.insurerName || !form.plan || !form.amount || !form.expiryDate) {
    pushDangerAlert('Missing fields', 'Person, car, insurer, plan, amount and expiry date are all required.')
    return
  }
  submitting.value = true
  try {
    const response = await createInsurance(form as InsuranceCreateRequest)
    pushSuccessAlert('Insurance created', `${form.insurerName} (${form.plan}) was created successfully.`)
    router.push({ name: 'Insurance', params: { id: response.data.id } })
  } catch {
    pushDangerAlert('Could not create insurance', 'Something went wrong while creating the insurance.')
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="p-3">
    <h1 class="mb-4 text-lg font-semibold">New insurance</h1>
    <div class="grid max-w-md grid-cols-1 gap-3">
      <input v-model.number="form.personId" type="number" class="rounded border px-3 py-2" placeholder="Person id *" />
      <input v-model.number="form.carId" type="number" class="rounded border px-3 py-2" placeholder="Car id *" />
      <input v-model="form.insurerName" class="rounded border px-3 py-2" placeholder="Insurer name *" />
      <input v-model="form.plan" class="rounded border px-3 py-2" placeholder="Plan *" list="plan-suggestions" />
      <datalist id="plan-suggestions">
        <option v-for="plan in planSuggestions" :key="plan" :value="plan" />
      </datalist>
      <input v-model.number="form.amount" type="number" step="0.01" class="rounded border px-3 py-2" placeholder="Amount *" />
      <input v-model="form.expiryDate" type="date" class="rounded border px-3 py-2" />
      <div class="flex gap-2">
        <button class="rounded bg-primary px-4 py-2 text-white" :disabled="submitting" @click="submit">Create</button>
        <button class="rounded border px-4 py-2" @click="router.push({ name: 'Insurances' })">Cancel</button>
      </div>
    </div>
  </div>
</template>
