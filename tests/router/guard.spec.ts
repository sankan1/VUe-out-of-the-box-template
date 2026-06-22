import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

describe('redirectToLogin', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
        localStorage.clear()
        sessionStorage.setItem('persons_filters', '{}')
    })

    it('stores the path and clears session storage', async () => {
        const { redirectToLogin } = await import('@/router')
        redirectToLogin('/person/5')
        expect(localStorage.getItem('pathAfterLogin')).toBe('/person/5')
        expect(sessionStorage.getItem('persons_filters')).toBeNull()
    })
})