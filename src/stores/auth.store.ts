import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { UserInfoOutputModal } from '@/generated/api/model'

export const useAuthStore = defineStore('auth', () => {
    const user = ref<UserInfoOutputModal | undefined>()
    const roleGroups = computed<string[]>(() => user.value?.roleGroups ?? [])

    function hasRole(role: string): boolean {
        return roleGroups.value.includes(role)
    }

    return {
        user,
        hasRole,
    }
})