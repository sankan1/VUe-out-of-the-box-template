import { useAlertStore } from '@/stores/alert.store'

export function useAlertUtils() {
    const alerts = useAlertStore()

    function pushSuccessAlert(title: string, message: string) {
        alerts.pushAlert({ variant: 'success', icon: 'CheckIcon', title, message, autoclose: true })
    }

    function pushWarningAlert(title: string, message: string) {
        alerts.pushAlert({ variant: 'warning', icon: 'AlertTriangle', title, message, autoclose: true })
    }

    function pushDangerAlert(title: string, message: string) {
        alerts.pushAlert({ variant: 'danger', icon: 'StopCircle', title, message, autoclose: false })
    }

    return { pushSuccessAlert, pushWarningAlert, pushDangerAlert }
}