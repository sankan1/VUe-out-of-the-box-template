import type { ObjectDirective } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import { UserInfoOutputModalRoleGroupsItem } from '@/generated/api/model'

type RoleVisibilityChecks = { [key: string]: boolean }
type RoleVisibilityState = { checks: RoleVisibilityChecks }

function getVisibilityState(element: HTMLElement): RoleVisibilityState {
    const decorated = element as unknown as { __roleVisibilityState?: RoleVisibilityState }
    decorated.__roleVisibilityState ??= { checks: {} }
    return decorated.__roleVisibilityState
}

function applyCombinedVisibility(element: HTMLElement) {
    const state = getVisibilityState(element)
    const hasAnyTrue = Object.values(state.checks).some((isVisible) => isVisible)
    element.style.display = hasAnyTrue ? '' : 'none'
}

function makeSingleRoleVisibleDirective(roleName: string, key: string): ObjectDirective {
    return {
        mounted(element) {
            const auth = useAuthStore()
            getVisibilityState(element).checks[key] = auth.hasRole(roleName)
            applyCombinedVisibility(element)
        },
        updated(element) {
            const auth = useAuthStore()
            getVisibilityState(element).checks[key] = auth.hasRole(roleName)
            applyCombinedVisibility(element)
        },
    }
}

export const visibleToHeadUserGroup: ObjectDirective = makeSingleRoleVisibleDirective(
    UserInfoOutputModalRoleGroupsItem.HEAD_USER,
    'visibleToHeadUserGroup',
)
export const visibleToEndUserGroup: ObjectDirective = makeSingleRoleVisibleDirective(
    UserInfoOutputModalRoleGroupsItem.END_USER,
    'visibleToEndUserGroup',
)
export const visibleToAdminGroup: ObjectDirective = makeSingleRoleVisibleDirective(
    UserInfoOutputModalRoleGroupsItem.ADMIN,
    'visibleToAdminGroup',
)