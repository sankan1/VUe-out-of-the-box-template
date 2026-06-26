import {
    createRouter,
    createWebHistory,
    type RouteLocationNormalized,
    type RouteLocationNormalizedLoaded,
} from 'vue-router'
import _ from 'lodash'
import { useAuthStore } from '@/stores/auth.store'
import type { UserInfoOutputModal } from '@/generated/api/model'
import { fetchUserInfo } from '@/generated/api/user/user'
import { isAuthRequired, unleashClient } from '@/config/unleashConfig'
import { FeatureFlag } from '@/constants/feature-flags'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/login',
            name: 'Login',
            component: () => import('@/pages/Login.vue'),
            meta: { allowAnonymous: true },
        },
        {
            path: '/forbidden',
            name: 'Forbidden',
            component: () => import('@/pages/Forbidden.vue'),
            meta: { allowAnonymous: true },
        },
        {
            path: '/',
            name: 'Dashboard',
            component: () => import('@/pages/Dashboard.vue'),
            children: [
                {
                    path: '/',
                    name: 'Persons',
                    component: () => import('@/pages/Persons.vue'),
                },
                {
                    path: '/person/:id',
                    name: 'Person',
                    component: () => import('@/pages/PersonDetail.vue'),
                },
                {
                    path: '/person/:id/edit',
                    name: 'PersonEdit',
                    component: () => import('@/pages/PersonDetail.vue'),
                    props: { isEdit: true },
                },
                {
                    path: '/search',
                    name: 'Search',
                    component: () => import('@/pages/SearchLayout.vue'),
                    redirect: { name: 'DetailedSearch' },
                    children: [
                        {
                            path: 'detailed-search',
                            name: 'DetailedSearch',
                            component: () => import('@/pages/DetailedSearch.vue'),
                        },
                    ],
                },
            ],
        },
        {
            path: '/:pathMatch(.*)*',
            name: 'NotFound',
            component: () => import('@/pages/NotFound.vue'),
            meta: { allowAnonymous: true },
        },
    ],
})

let previousRoute: RouteLocationNormalizedLoaded | undefined = undefined

router.beforeEach((to, from, next) => {
    previousRoute = from
    const authStore = useAuthStore()
    const userInfo = authStore.user
    const allowAnonymous = to.matched.some((record) => record.meta.allowAnonymous)

    if (isAuthRequired() && !allowAnonymous && _.isEmpty(userInfo)) {
        fetchUserInfo()
            .then((userData) => {
                authStore.user = userData?.data ?? ({} as UserInfoOutputModal)
                next()
            })
            .catch((error) => handleUnauthorizedUser(to, error))
    } else {
        next()
    }
})

export const handleUnauthorizedUser = (to: RouteLocationNormalized | null, error: unknown) => {
    let status: number | undefined = undefined
    if (typeof error === 'object' && error !== null) {
        const errorObject = error as Record<string, unknown>
        const response = errorObject.response as { status?: number } | undefined
        status = response?.status ?? (errorObject.status as number | undefined)
    }
    if (status === 403) {
        if (to) {
            localStorage.setItem('pathAfterLogin', to.path)
        }
        router.push('/forbidden')
        return
    }
    redirectToLogin(to?.path)
}

let redirectingToLogin = false
let explicitPathStored = false
export const redirectToLogin = (pathAfterLogin?: string) => {
    if (pathAfterLogin && !explicitPathStored) {
        localStorage.setItem('pathAfterLogin', pathAfterLogin)
        explicitPathStored = true
    } else if (!pathAfterLogin && !localStorage.getItem('pathAfterLogin')) {
        localStorage.setItem('pathAfterLogin', globalThis.location.pathname)
    }

    if (redirectingToLogin) {
        return
    }
    redirectingToLogin = true
    sessionStorage.clear()

    if (unleashClient.isEnabled(FeatureFlag.OIDC_AUTH)) {
        globalThis.location.href = '/oauth/login/oidc'
        return
    }
    if (unleashClient.isEnabled(FeatureFlag.SMART_ID_AUTH)) {
        redirectingToLogin = false
        router.push('/login')
        return
    }
    redirectingToLogin = false
}

export function getPreviousRoute() {
    return previousRoute
}

export default router