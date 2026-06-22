import { onMounted, onUnmounted, ref, type Ref } from 'vue'
import { TabulatorFull as Tabulator, type ColumnDefinition } from 'tabulator-tables'
import type { Router } from 'vue-router'
import { usePersonsStore } from '@/stores/persons.store'

export function usePersonsTabulator(container: Ref<HTMLElement | null>, router: Router) {
    const personsStore = usePersonsStore()
    const tabulator = ref<Tabulator>()

    const columns: ColumnDefinition[] = [
        { title: 'Name', field: 'name', sorter: 'string' },
        { title: 'Nickname', field: 'nickname', sorter: 'string' },
        { title: 'Hobby', field: 'hobby', sorter: 'string' },
    ]

    async function fetchTableData(_url: string, _config: unknown, params: { page: number; size: number; sorters: { field: string; dir: string }[] }) {
        const sorter = params.sorters[0]
        if (sorter) {
            personsStore.selectedSort = { field: sorter.field, dir: sorter.dir as 'asc' | 'desc' }
        }
        personsStore.selectedPageSize = params.size
        await personsStore.fetchPersons(params.page - 1)
        return {
            data: personsStore.persons,
            last_page: personsStore.totalPages,
        }
    }

    function initTable() {
        if (!container.value) {
            return
        }
        tabulator.value = new Tabulator(container.value, {
            layout: 'fitColumns',
            columns,
            pagination: true,
            paginationMode: 'remote',
            sortMode: 'remote',
            filterMode: 'remote',
            paginationSize: personsStore.selectedPageSize,
            ajaxURL: '/persons/search',
            ajaxRequestFunc: fetchTableData as never,
        })

        tabulator.value.on('rowClick', (event, row) => {
            const mouseEvent = event as MouseEvent
            if (mouseEvent.ctrlKey || mouseEvent.metaKey) {
                return
            }
            router.push({ name: 'Person', params: { id: row.getData().id } })
        })
    }

    function reloadTable() {
        tabulator.value?.setData()
    }

    onMounted(initTable)
    onUnmounted(() => tabulator.value?.destroy())

    return { tabulator, reloadTable }
}