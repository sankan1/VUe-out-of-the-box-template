import axios from 'axios'
import { redirectToLogin } from '@/router'

export function configureAxios() {
    axios.defaults.withCredentials = true
    axios.defaults.paramsSerializer = { indexes: null }
    prependApiPath()
    redirectToLoginOnUnauthorized()
}

function prependApiPath() {
    axios.interceptors.request.use((config) => {
        if (config.url && !config.url.startsWith('/api')) {
            config.url = `/api${config.url}`
        }
        return config
    })
}

function redirectToLoginOnUnauthorized() {
    axios.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error?.response?.status === 401) {
                redirectToLogin()
            }
            return Promise.reject(error)
        },
    )
}