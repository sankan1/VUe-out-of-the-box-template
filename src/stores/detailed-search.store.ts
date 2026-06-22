import { defineStore } from 'pinia'
import type { Person, PersonSearchRequest } from '@/generated/api/model'
import { searchPersons } from '@/generated/api/persons/persons'
import { quickSearch } from '@/generated/api/quick-search/quick-search'

interface DetailedSearchState {
    persons: Person[]
    totalSize: number
    totalPages: number
    searchCondition: PersonSearchRequest
    isQuickSearch: boolean
    quickSearchText: string
    isQuickSearching: boolean
}

export const useDetailedSearchStore = defineStore('detailedSearch', {
    state: (): DetailedSearchState => ({
        persons: [],
        totalSize: 0,
        totalPages: 0,
        searchCondition: {},
        isQuickSearch: false,
        quickSearchText: '',
        isQuickSearching: false,
    }),
    actions: {
        setSearchCondition(condition: PersonSearchRequest) {
            this.searchCondition = condition
            this.isQuickSearch = false
        },
        async fetchPersons(params: { page?: number; size?: number; sort?: string[] }) {
            const response =
                this.isQuickSearch && this.quickSearchText
                    ? await quickSearch({ searchText: this.quickSearchText, ...params })
                    : await searchPersons(this.searchCondition, params)
            this.persons = response.data.content ?? []
            this.totalSize = response.data.totalSize ?? 0
            this.totalPages = response.data.totalPages ?? 0
        },
    },
})