import { onMounted, onUnmounted, ref, type Ref } from 'vue'
import { TabulatorFull as Tabulator, type ColumnDefinition } from 'tabulator-tables'
import type { Router } from 'vue-router'
import { useCarsStore } from '@/stores/cars.store'

export function useCarsTabulator(container: Ref<HTMLElement | null>, router: Router) {
    const carsStore = useCarsStore()
    const tabulator = ref<Tabulator>()

    const columns: ColumnDefinition[] = [
        { title: 'Mark', field: 'mark', sorter: 'string' },
        { title: 'Model', field: 'model', sorter: 'string' },
        { title: 'Owner', field: 'ownerName', sorter: 'string' },
        { title: 'Issuer firm', field: 'issuerFirmName', sorter: 'string' },
    ]

    async function fetchTableData(
        _url: string,
        _config: unknown,
        params: { page: number; size: number; sort: { field: string; dir: string }[] },
    ) {
        const sorter = params.sort[0]
        if (sorter) {
            carsStore.selectedSort = { field: sorter.field, dir: sorter.dir as 'asc' | 'desc' }
        }
        carsStore.selectedPageSize = params.size
        await carsStore.fetchCars(params.page - 1)
        return {
            data: carsStore.cars,
            last_page: carsStore.totalPages,
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
            paginationSize: carsStore.selectedPageSize,
            ajaxURL: '/cars/search',
            ajaxRequestFunc: fetchTableData as never,
        })

        tabulator.value.on('rowClick', (event, row) => {
            const mouseEvent = event as MouseEvent
            if (mouseEvent.ctrlKey || mouseEvent.metaKey) {
                return
            }
            router.push({ name: 'Car', params: { id: row.getData().id } })
        })
    }

    function reloadTable() {
        tabulator.value?.setData()
    }

    onMounted(initTable)
    onUnmounted(() => tabulator.value?.destroy())

    return { tabulator, reloadTable }
}
