<script setup lang="ts">
import { ref } from 'vue'
import useVuelidate from '@vuelidate/core'
import { helpers, required } from '@vuelidate/validators'
import { smartIdInit, smartIdComplete } from '@/generated/api/auth/auth'
import { fetchUserInfo } from '@/generated/api/user/user'
import { useAuthStore } from '@/stores/auth.store'
import { useAlertUtils } from '@/utils/alert-utils'
import router from '@/router'
import type { UserInfoOutputModal } from '@/generated/api/model'

const identityCode = ref('')
const verificationCode = ref<string | null>(null)
const phase = ref<'idle' | 'awaiting-confirmation'>('idle')
const submitting = ref(false)
const { pushDangerAlert } = useAlertUtils()

const elevenDigits = helpers.regex(/^\d{11}$/)
const rules = { identityCode: { required, elevenDigits } }
const validator = useVuelidate(rules, { identityCode })

async function login() {
  const valid = await validator.value.$validate()
  if (!valid) {
    return
  }
  submitting.value = true
  try {
    const initResponse = await smartIdInit({ identityCode: identityCode.value })
    if (!initResponse.data) {
      return
    }
    verificationCode.value = initResponse.data.verificationCode!
    phase.value = 'awaiting-confirmation'

    // /complete blocks until the user confirms in the Smart-ID app, then sets the cookie.
    if (!initResponse.data.reference) {
      return
    }
    await smartIdComplete({reference: initResponse.data.reference})

    const userData = await fetchUserInfo()
    useAuthStore().user = userData?.data ?? ({} as UserInfoOutputModal)
    router.push(localStorage.getItem('pathAfterLogin') ?? '/')
  } catch (error: unknown) {
    const status = (error as { response?: { status?: number } })?.response?.status
    if (status === 408) {
      pushDangerAlert('Timed out', 'You did not confirm the request in time. Please try again.')
    } else if (status === 401) {
      pushDangerAlert('Cancelled', 'The Smart-ID request was refused.')
    } else {
      pushDangerAlert('Smart-ID error', 'Could not complete Smart-ID authentication.')
    }
    phase.value = 'idle'
    verificationCode.value = null
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="mx-auto mt-20 w-80 rounded border bg-white p-6 shadow">
    <h1 class="mb-4 text-lg font-bold">Log in with Smart-ID</h1>

    <template v-if="phase === 'idle'">
      <label class="mb-1 block text-sm">Estonian identity code</label>
      <input
          v-model="identityCode"
          class="w-full rounded border px-3 py-2"
          placeholder="e.g. 40504040001"
          inputmode="numeric"
          :disabled="submitting"
      />
      <p v-if="validator.identityCode.$error" class="mt-1 text-sm text-danger">Enter an 11-digit identity code.</p>
      <button class="mt-4 w-full rounded bg-primary py-2 text-white" :disabled="submitting" @click="login">
        {{ submitting ? 'Starting…' : 'Authenticate' }}
      </button>
    </template>

    <template v-else>
      <p class="text-sm">Open your Smart-ID app and confirm the verification code:</p>
      <p class="my-4 text-center text-3xl font-bold tracking-widest">{{ verificationCode }}</p>
      <p class="text-center text-sm text-slate-500">Waiting for confirmation…</p>
    </template>
  </div>
</template>