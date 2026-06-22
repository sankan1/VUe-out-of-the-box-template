import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { usePersonsStore } from '@/stores/persons.store'
import * as personsApi from '@/generated/api/persons/persons'

describe('persons store', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
        sessionStorage.clear()
    })

    it('loads a page of persons and maps the response', async () => {
        vi.spyOn(personsApi, 'searchPersons').mockResolvedValue({
            data: { content: [{ id: 1, name: 'Ada' }], totalSize: 1, totalPages: 1 },
        } as never)

        const store = usePersonsStore()
        await store.fetchPersons(0)

        expect(store.persons).toHaveLength(1)
        expect(store.totalSize).toBe(1)
        expect(store.loading).toBe(false)
    })

    it('captures errors into the error ref', async () => {
        vi.spyOn(personsApi, 'searchPersons').mockRejectedValue(new Error('boom'))
        const store = usePersonsStore()
        await store.fetchPersons(0)
        expect(store.error?.message).toBe('boom')
    })
})