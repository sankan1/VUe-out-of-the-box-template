<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { assignCarOwner, getCar } from '@/generated/api/cars/cars'
import type { Car } from '@/generated/api/model'
import { useAuthStore } from '@/stores/auth.store'
import { useAlertUtils } from '@/utils/alert-utils'
import { UserInfoOutputModalRoleGroupsItem } from '@/generated/api/model'

const route = useRoute()
const authStore = useAuthStore()
const { pushSuccessAlert, pushDangerAlert } = useAlertUtils()

const car = ref<Car | null>(null)
const ownerPersonId = ref<number | null>(null)
const assigning = ref(false)

const canAssignOwner = computed(
  () =>
    authStore.hasRole(UserInfoOutputModalRoleGroupsItem.HEAD_USER) ||
    authStore.hasRole(UserInfoOutputModalRoleGroupsItem.ADMIN),
)

async function loadCar() {
  const id = Number(route.params.id)
  const response = await getCar(id)
  car.value = response.data
}

async function submitAssignOwner() {
  if (!car.value || !ownerPersonId.value) {
    pushDangerAlert('Missing person', 'Enter the person id to assign as owner.')
    return
  }
  assigning.value = true
  try {
    const response = await assignCarOwner(car.value.id, { personId: ownerPersonId.value })
    car.value = response.data
    pushSuccessAlert('Owner assigned', `${response.data.ownerName ?? 'Person'} now owns this car.`)
  } catch {
    pushDangerAlert('Could not assign owner', 'Something went wrong while assigning the owner.')
  } finally {
    assigning.value = false
  }
}

onMounted(loadCar)
</script>

<template>
  <div class="p-3" v-if="car">
    <h1 class="mb-4 text-lg font-semibold">{{ car.mark }} {{ car.model }}</h1>
    <dl class="mb-6 grid max-w-md grid-cols-2 gap-2">
      <dt class="text-gray-500">Owner</dt>
      <dd>{{ car.ownerName ?? 'Unowned' }}</dd>
      <dt class="text-gray-500">Issuer firm</dt>
      <dd>{{ car.issuerFirmName }}</dd>
    </dl>

    <div v-if="canAssignOwner" class="max-w-md">
      <h2 class="mb-2 font-semibold">Assign owner</h2>
      <div class="flex gap-2">
        <input v-model.number="ownerPersonId" type="number" class="rounded border px-3 py-2" placeholder="Person id" />
        <button class="rounded bg-primary px-4 py-2 text-white" :disabled="assigning" @click="submitAssignOwner">
          Assign
        </button>
      </div>
    </div>
  </div>
</template>
