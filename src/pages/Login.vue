<script setup lang="ts">
import { onMounted } from 'vue'
import router, { handleUnauthorizedUser } from '@/router'
import { useAuthStore } from '@/stores/auth.store'
import { fetchUserInfo } from '@/generated/api/user/user'
import type { UserInfoOutputModal } from '@/generated/api/model'

onMounted(() => {
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
  <div class="grid min-h-screen place-items-center">Signing you in…</div>
</template>