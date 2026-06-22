import { createI18n } from 'vue-i18n'
import et from '@/assets/i18n/et.json'

export type MessageSchema = typeof et

export const i18n = createI18n<[MessageSchema], 'et'>({
    legacy: false,
    locale: 'et',
    messages: { et },
})