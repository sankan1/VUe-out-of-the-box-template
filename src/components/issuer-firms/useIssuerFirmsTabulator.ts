import { onMounted, onUnmounted, ref, type Ref } from 'vue'
import { TabulatorFull as Tabulator, type ColumnDefinition } from 'tabulator-tables'
import { useIssuerFirmsStore } from '@/stores/issuer-firms.store'

export function useIssuerFirmsTabulator(container: Ref<HTMLElement | null>) {
    const issuerFirmsStore = useIssuerFirmsStore()
    const tabulator = ref<Tabulator>()

    const columns: ColumnDefinition[] = [
        { title: 'Firm name', field: 'firmName', sorter: 'string' },
        { title: 'Car mark', field: 'carMark', sorter: 'string' },
        { title: 'Car model', field: 'carModel', sorter: 'string' },
    ]

    async function fetchTableData(
        _url: string,
        _config: unknown,
        params: { page: number; size: number; sort: { field: string; dir: string }[] },
    ) {
        const sorter = params.sort[0]
        if (sorter) {
            issuerFirmsStore.selectedSort = { field: sorter.field, dir: sorter.dir as 'asc' | 'desc' }
        }
        issuerFirmsStore.selectedPageSize = params.size
        await issuerFirmsStore.fetchIssuerFirms(params.page - 1)
        return {
            data: issuerFirmsStore.issuerFirms,
            last_page: issuerFirmsStore.totalPages,
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
            paginationSize: issuerFirmsStore.selectedPageSize,
            ajaxURL: '/issuer-firms/search',
            ajaxRequestFunc: fetchTableData as never,
        })
    }

    function reloadTable() {
        tabulator.value?.setData()
    }

    onMounted(initTable)
    onUnmounted(() => tabulator.value?.destroy())

    return { tabulator, reloadTable }
}
