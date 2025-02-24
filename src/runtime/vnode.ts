// VNode 类型定义
export const Text = Symbol('Text')
export const Fragment = Symbol('Fragment')

export interface VNode {
    type: string | Symbol
    props: Record<string, any>
    children: Array<VNode | string>
    el?: HTMLElement | Text
    key?: any
}

// 创建元素VNode
export function h(
    type: string,
    props: Record<string, any> = {},
    children: Array<VNode | string> | string = []
): VNode {
    return {
        type,
        props,
        children: typeof children === 'string' ? [createTextVNode(children)] : children,
        key: props?.key
    }
}

// 创建文本VNode
export function createTextVNode(text: string): VNode {
    return {
        type: Text,
        props: {},
        children: [text]
    }
} 