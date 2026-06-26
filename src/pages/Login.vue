<script setup lang="ts">
import { onMounted } from 'vue'
import { useFlag } from '@unleash/proxy-client-vue'
import router, { handleUnauthorizedUser } from '@/router'
import { useAuthStore } from '@/stores/auth.store'
import { fetchUserInfo } from '@/generated/api/user/user'
import { FeatureFlag } from '@/constants/feature-flags'
import SmartIdLogin from '@/components/smart-id/SmartIdLogin.vue'
import type { UserInfoOutputModal } from '@/generated/api/model'

const smartIdAuthEnabled = useFlag(FeatureFlag.SMART_ID_AUTH)

onMounted(() => {
  if (smartIdAuthEnabled.value) {
    return
  }
  const authStore = useAuthStore()
  fetchUserInfo()
      .then((userData) => {
        authStore.user = userData?.data ?? ({} as UserInfoOutputModal)
        router.push(localStorage.getItem('pathAfterLogin') ?? '/')
      })
      .catch((error) => handleUnauthorizedUser(null, error))
})
</script>

<template>
  <SmartIdLogin v-if="smartIdAuthEnabled" />
  <div v-else class="grid min-h-screen place-items-center">Signing you in…</div>
</template>