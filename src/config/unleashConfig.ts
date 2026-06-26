import { UnleashClient } from '@unleash/proxy-client-vue'
import { FeatureFlag } from '@/constants/feature-flags'

export const unleashClient = new UnleashClient({
    url: `${globalThis.location.origin}/unleash/frontend/`,
    clientKey: 'proxy-handles-this',
    appName: 'persons-frontend',
    refreshInterval: 15,
})

export function isAuthRequired(): boolean {
    return unleashClient.isEnabled(FeatureFlag.OIDC_AUTH) || unleashClient.isEnabled(FeatureFlag.SMART_ID_AUTH)
}
