<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { useAlertUtils } from '@/utils/alert-utils'
import { UserInfoOutputModalRoleGroupsItem } from '@/generated/api/model'
import { getPerson } from '@/generated/api/persons/persons'
import { searchCars } from '@/generated/api/cars/cars'
import { searchInsurances } from '@/generated/api/insurances/insurances'
import type { Car, Insurance, Person } from '@/generated/api/model'

const props = defineProps<{ isEdit?: boolean }>()
const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const { pushWarningAlert } = useAlertUtils()

const canEdit = computed(() => authStore.hasRole(UserInfoOutputModalRoleGroupsItem.HEAD_USER))

const person = ref<Person | null>(null)
const cars = ref<Car[]>([])
const insurances = ref<Insurance[]>([])
const loading = ref(false)

async function load() {
  const id = Number(route.params.id)
  loading.value = true
  try {
    const [personResponse, carsResponse, insurancesResponse] = await Promise.all([
      getPerson(id),
      searchCars({ ownerId: id }, { page: 0, size: 50 }),
      searchInsurances({ personId: id }, { page: 0, size: 50 }),
    ])
    person.value = personResponse.data
    cars.value = carsResponse.data.content ?? []
    insurances.value = insurancesResponse.data.content ?? []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (props.isEdit && !canEdit.value) {
    pushWarningAlert('Not allowed', 'You need the head-user role to edit persons.')
    router.replace({ name: 'Person', params: { id: route.params.id } })
    return
  }
  load()
})
</script>

<template>
  <div class="p-3" v-if="person">
    <h1 class="mb-4 text-lg font-semibold">{{ person.name }}</h1>
    <dl class="mb-6 grid max-w-md grid-cols-2 gap-2">
      <dt class="text-gray-500">Nickname</dt>
      <dd>{{ person.nickname }}</dd>
      <dt class="text-gray-500">Identity code</dt>
      <dd>{{ person.identityCode }}</dd>
      <dt class="text-gray-500">Age</dt>
      <dd>{{ person.age }}</dd>
    </dl>

    <h2 class="mb-2 font-semibold">Cars</h2>
    <table class="mb-6 w-full border-collapse text-left">
      <thead>
        <tr class="border-b">
          <th class="p-2">Mark</th>
          <th class="p-2">Model</th>
          <th class="p-2">Issuer firm</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="car in cars"
          :key="car.id"
          class="cursor-pointer border-b hover:bg-slate-50"
          @click="router.push({ name: 'Car', params: { id: car.id } })"
        >
          <td class="p-2">{{ car.mark }}</td>
          <td class="p-2">{{ car.model }}</td>
          <td class="p-2">{{ car.issuerFirmName }}</td>
        </tr>
        <tr v-if="!cars.length">
          <td class="p-2 text-gray-500" colspan="3">No cars.</td>
        </tr>
      </tbody>
    </table>

    <h2 class="mb-2 font-semibold">Insurances</h2>
    <table class="w-full border-collapse text-left">
      <thead>
        <tr class="border-b">
          <th class="p-2">Insurer</th>
          <th class="p-2">Plan</th>
          <th class="p-2">Car</th>
          <th class="p-2">Days left</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="insurance in insurances"
          :key="insurance.id"
          class="cursor-pointer border-b hover:bg-slate-50"
          @click="router.push({ name: 'Insurance', params: { id: insurance.id } })"
        >
          <td class="p-2">{{ insurance.insurerName }}</td>
          <td class="p-2">{{ insurance.plan }}</td>
          <td class="p-2">{{ insurance.carMark }} {{ insurance.carModel }}</td>
          <td class="p-2">{{ insurance.daysLeft }}</td>
        </tr>
        <tr v-if="!insurances.length">
          <td class="p-2 text-gray-500" colspan="4">No insurances.</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
