import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useDetailedSearchStore } from '@/stores/detailed-search.store'

interface UseQuickSearchOptions {
    onSearch?: (text: string) => Promise<void> | void
    onClear?: () => void
    shouldNavigate?: boolean
    initializeFromStore?: boolean
}

export function useQuickSearch(options: UseQuickSearchOptions = {}) {
    const { onSearch, onClear, shouldNavigate = false, initializeFromStore = true } = options
    const detailedSearchStore = useDetailedSearchStore()
    const router = useRouter()
    const quickSearchText = ref('')

    if (initializeFromStore) {
        onMounted(() => {
            if (detailedSearchStore.quickSearchText) {
                quickSearchText.value = detailedSearchStore.quickSearchText
            }
        })
    }

    async function handleSearch() {
        if (detailedSearchStore.isQuickSearching) {
            return
        }
        const trimmed = quickSearchText.value.trim()
        if (!trimmed) {
            return
        }
        detailedSearchStore.isQuickSearching = true
        detailedSearchStore.quickSearchText = trimmed
        detailedSearchStore.isQuickSearch = true

        if (onSearch) {
            await onSearch(trimmed)
        }
        if (shouldNavigate) {
            await router.push('/search/detailed-search')
        }
        detailedSearchStore.isQuickSearching = false
    }

    function handleClear() {
        quickSearchText.value = ''
        detailedSearchStore.quickSearchText = ''
        detailedSearchStore.isQuickSearch = false
        if (onClear) {
            onClear()
        }
    }

    return { quickSearchText, handleSearch, handleClear }
}