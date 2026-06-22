export const nullableSerializer = {
    read: (value: string) => JSON.parse(value),
    write: (value: unknown) => JSON.stringify(value),
}