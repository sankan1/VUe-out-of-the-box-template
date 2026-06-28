import { onMounted, onUnmounted, ref, type Ref } from 'vue'
import { TabulatorFull as Tabulator, type ColumnDefinition } from 'tabulator-tables'
import type { Router } from 'vue-router'
import { useInsurancesStore } from '@/stores/insurances.store'

export function useInsurancesTabulator(container: Ref<HTMLElement | null>, router: Router) {
    const insurancesStore = useInsurancesStore()
    const tabulator = ref<Tabulator>()

    const columns: ColumnDefinition[] = [
        { title: 'Insurer', field: 'insurerName', sorter: 'string' },
        { title: 'Plan', field: 'plan', sorter: 'string' },
        { title: 'Amount', field: 'amount', sorter: 'number' },
        { title: 'Expiry date', field: 'expiryDate', sorter: 'string' },
        { title: 'Days left', field: 'daysLeft', sorter: 'number' },
        { title: 'Person', field: 'personName', sorter: 'string' },
        { title: 'Car', field: 'carMark', sorter: 'string' },
    ]

    async function fetchTableData(
        _url: string,
        _config: unknown,
        params: { page: number; size: number; sort: { field: string; dir: string }[] },
    ) {
        const sorter = params.sort[0]
        if (sorter) {
            insurancesStore.selectedSort = { field: sorter.field, dir: sorter.dir as 'asc' | 'desc' }
        }
        insurancesStore.selectedPageSize = params.size
        await insurancesStore.fetchInsurances(params.page - 1)
        return {
            data: insurancesStore.insurances,
            last_page: insurancesStore.totalPages,
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
            paginationSize: insurancesStore.selectedPageSize,
            ajaxURL: '/insurances/search',
            ajaxRequestFunc: fetchTableData as never,
        })

        tabulator.value.on('rowClick', (event, row) => {
            const mouseEvent = event as MouseEvent
            if (mouseEvent.ctrlKey || mouseEvent.metaKey) {
                return
            }
            router.push({ name: 'Insurance', params: { id: row.getData().id } })
        })
    }

    function reloadTable() {
        tabulator.value?.setData()
    }

    onMounted(initTable)
    onUnmounted(() => tabulator.value?.destroy())

    return { tabulator, reloadTable }
}
