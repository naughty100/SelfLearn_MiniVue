// VNode 类型定义
export const Text = Symbol('Text')
export const Fragment = Symbol('Fragment')

export interface VNode {
    type: string | Symbol
    props?: Record<string, any>
    children: VNode[] | string
    el?: Node
    key?: string | number
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

// 创建虚拟节点
export function createVNode(
    type: VNode['type'],
    props?: VNode['props'],
    children?: VNode['children']
): VNode {
    return {
        type,
        props: props || {},
        children: children || [],
        // 初始时不挂载el，在渲染阶段处理
    }
}

// 特殊节点类型标识
export const Comment = Symbol('Comment') 