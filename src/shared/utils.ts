// 判断值是否变化
export const hasChanged = (value: any, oldValue: any): boolean =>
    !Object.is(value, oldValue)

// 规范化事件名（onClick -> click）
export const toHandlerKey = (str: string) =>
    str ? `on${str[0].toUpperCase()}${str.slice(1)}` : ''

// 判断是否是事件属性
export const isEvent = (key: string) => /^on[A-Z]/.test(key)

// 获取DOM属性名（例如将className转换为class）
export const getDomPropName = (key: string) => {
    if (key === 'className') return 'class'
    return key.toLowerCase()
} 