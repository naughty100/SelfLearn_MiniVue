export const hasChanged = (value: any, oldValue: any): boolean =>
    !Object.is(value, oldValue)

export const isObject = (val: unknown): val is Record<any, any> =>
    val !== null && typeof val === 'object' 