import { defineConfig } from 'orval'

export default defineConfig({
    persons: {
        input: './openapi/openapi.yml',
        output: {
            target: './src/generated/api',
            mode: 'tags-split',
            schemas: './src/generated/api/model',
            client: 'axios-functions',
            clean: true,
        },
        hooks: {
            afterAllFilesWrite: 'prettier --write',
        },
    },
})