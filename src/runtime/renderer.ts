import { VNode, Text, Fragment } from './vnode'

// 渲染器配置接口（抽象DOM操作）
interface RendererOptions {
  createElement(tag: string): Element
  createText(text: string): Text
  setElementText(el: Element, text: string): void
  insert(el: Node, parent: Element, anchor?: Node | null): void
  patchProps(el: Element, key: string, prevValue: any, nextValue: any): void
}

// 创建渲染器
export function createRenderer(options: RendererOptions) {
  const {
    createElement,
    createText,
    setElementText,
    insert,
    patchProps
  } = options

  // 处理普通元素节点
  function mountElement(vnode: VNode, container: Element) {
    const el = (vnode.el = createElement(vnode.type as string) as Element)

    // 处理props
    if (vnode.props) {
      for (const key in vnode.props) {
        patchProps(el, key, null, vnode.props[key])
      }
    }

    // 处理子节点
    if (typeof vnode.children === 'string') {
      setElementText(el, vnode.children)
    } else if (Array.isArray(vnode.children)) {
      vnode.children.forEach(child => {
        patch(null, child, el)
      })
    }

    insert(el, container)
  }

  // 核心patch算法
  function patch(n1: VNode | null, n2: VNode, container: Element) {
    // 新旧节点类型不同时直接卸载旧节点
    if (n1 && !isSameVNodeType(n1, n2)) {
      unmount(n1)
      n1 = null
    }

    const { type } = n2
    if (typeof type === 'string') {
      if (!n1) {
        mountElement(n2, container)
      } else {
        updateElement(n1, n2, container)
      }
    } else if (type === Text) {
      // 处理文本节点
      processText(n1, n2, container)
    } else if (type === Fragment) {
      // 处理Fragment节点
      processFragment(n1, n2, container)
    }
  }

  // 判断是否是相同类型的VNode
  function isSameVNodeType(n1: VNode, n2: VNode): boolean {
    return n1.type === n2.type && n1.key === n2.key
  }

  // 更新元素节点
  function updateElement(n1: VNode, n2: VNode, container: Element) {
    const el = (n2.el = n1.el as Element)

    // 更新props
    const oldProps = n1.props || {}
    const newProps = n2.props || {}

    // 添加新props/更新变化props
    for (const key in newProps) {
      if (newProps[key] !== oldProps[key]) {
        patchProps(el, key, oldProps[key], newProps[key])
      }
    }
    // 删除旧props
    for (const key in oldProps) {
      if (!(key in newProps)) {
        patchProps(el, key, oldProps[key], null)
      }
    }

    // 更新子节点
    updateChildren(el, n1.children as VNode[], n2.children as VNode[])
  }

  // 子节点diff算法（简化版）
  function updateChildren(
    parentEl: Element,
    oldCh: VNode[] | string,
    newCh: VNode[] | string
  ) {
    // 如果新旧children都是字符串，直接更新文本
    if (typeof oldCh === 'string' && typeof newCh === 'string') {
      if (oldCh !== newCh) {
        setElementText(parentEl, newCh)
      }
      return
    }

    // 如果新children是字符串，旧的是数组
    if (Array.isArray(oldCh) && typeof newCh === 'string') {
      // 移除所有旧节点
      oldCh.forEach(child => unmount(child))
      // 设置新文本
      setElementText(parentEl, newCh)
      return
    }

    // 如果旧children是字符串，新的是数组
    if (typeof oldCh === 'string' && Array.isArray(newCh)) {
      // 清空旧文本
      setElementText(parentEl, '')
      // 挂载新节点
      newCh.forEach(child => patch(null, child, parentEl))
      return
    }

    // 如果都是数组，进行diff
    if (Array.isArray(oldCh) && Array.isArray(newCh)) {
      // 简单实现：根据key进行复用
      const oldMap = getKeyMap(oldCh)
      newCh.forEach((newVNode, newIndex) => {
        const key = newVNode.key ?? newIndex
        const oldVNode = oldMap.get(key)
        if (oldVNode) {
          patch(oldVNode, newVNode, parentEl)
        } else {
          patch(null, newVNode, parentEl)
        }
      })

      // 删除旧列表中不存在的节点
      oldCh.forEach(oldVNode => {
        if (!newCh.find(v => v.key === oldVNode.key)) {
          unmount(oldVNode)
        }
      })
    }
  }

  function unmount(vnode: VNode) {
    const parent = vnode.el?.parentNode
    if (parent && vnode.el) {
      parent.removeChild(vnode.el)
    }
  }

  // 处理文本节点
  function processText(n1: VNode | null, n2: VNode, container: Element) {
    if (!n1) {
      const el = (n2.el = createText(n2.children as string))
      insert(el, container)
    } else {
      const el = (n2.el = n1.el!)
      if (n2.children !== n1.children) {
        el.nodeValue = n2.children as string
      }
    }
  }

  // 处理Fragment节点
  function processFragment(n1: VNode | null, n2: VNode, container: Element) {
    if (!n1) {
      ; (n2.children as VNode[]).forEach(child => patch(null, child, container))
    } else {
      updateChildren(container, n1.children as VNode[], n2.children as VNode[])
    }
  }

  return {
    render(vnode: VNode | null, container: Element) {
      if (vnode) {
        patch(container._vnode || null, vnode, container)
      } else if (container._vnode) {
        unmount(container._vnode)
      }
      container._vnode = vnode
    }
  }
}

// 辅助函数：生成key到VNode的映射
function getKeyMap(children: VNode[]): Map<string | number, VNode> {
  const map = new Map()
  if (Array.isArray(children)) {
    children.forEach((child, index) => {
      const key = child.key ?? index
      map.set(key, child)
    })
  }
  return map
}

// 在全局声明中扩展Element类型
declare global {
  interface Element {
    _vnode: VNode | null
  }
} 