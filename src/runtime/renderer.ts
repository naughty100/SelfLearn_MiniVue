import { VNode, Text, createTextVNode } from './vnode'

// 创建渲染器
export function createRenderer() {
  // 挂载元素
  function mount(vnode: VNode, container: HTMLElement) {
    const el = createElement(vnode)
    if (el) {
      container.appendChild(el)
      vnode.el = el
    }
  }

  // 创建DOM元素
  function createElement(vnode: VNode): HTMLElement | Text | null {
    const { type, props, children } = vnode

    if (type === Text) {
      // 创建文本节点
      return document.createTextNode(children[0] as string)
    }

    if (typeof type === 'string') {
      // 创建元素节点
      const el = document.createElement(type)

      // 设置属性
      for (const key in props) {
        if (key === 'key') continue
        if (key.startsWith('on')) {
          // 事件处理
          el.addEventListener(
            key.slice(2).toLowerCase(),
            props[key]
          )
        } else {
          el.setAttribute(key, props[key])
        }
      }

      // 处理子节点
      if (children) {
        children.forEach(child => {
          if (typeof child === 'string') {
            mount(createTextVNode(child), el)
          } else {
            mount(child, el)
          }
        })
      }

      return el
    }

    return null
  }

  // 更新元素
  function patch(n1: VNode, n2: VNode) {
    if (n1.type !== n2.type) {
      // 节点类型不同，直接替换
      const parent = n1.el?.parentNode
      if (parent) {
        const newEl = createElement(n2)
        if (newEl) {
          parent.replaceChild(newEl, n1.el!)
          n2.el = newEl
        }
      }
      return
    }

    // 获取旧节点的DOM元素
    const el = (n2.el = n1.el!)

    if (n1.type !== Text && n2.type !== Text) {
      const htmlEl = el as HTMLElement
      // 更新属性
      const { props: newProps = {} } = n2
      const { props: oldProps = {} } = n1

      // 更新新属性
      for (const key in newProps) {
        const newValue = newProps[key]
        const oldValue = oldProps[key]
        if (newValue !== oldValue) {
          if (key.startsWith('on')) {
            // 更新事件监听器
            const eventName = key.slice(2).toLowerCase()
            htmlEl.removeEventListener(eventName, oldValue)
            htmlEl.addEventListener(eventName, newValue)
          } else {
            // 更新普通属性
            htmlEl.setAttribute(key, newValue)
          }
        }
      }

      // 删除旧属性
      for (const key in oldProps) {
        if (!(key in newProps)) {
          if (key.startsWith('on')) {
            // 移除事件监听器
            const eventName = key.slice(2).toLowerCase()
            htmlEl.removeEventListener(eventName, oldProps[key])
          } else {
            // 移除属性
            htmlEl.removeAttribute(key)
          }
        }
      }
    }

    // 更新子节点
    const oldChildren = n1.children
    const newChildren = n2.children

    if (typeof newChildren === 'string') {
      // 新子节点是文本
      if (typeof oldChildren === 'string') {
        // 旧子节点也是文本，直接更新
        if (newChildren !== oldChildren) {
          el.textContent = newChildren
        }
      } else {
        // 旧子节点是数组，替换为文本
        el.textContent = newChildren
      }
    } else {
      // 新子节点是数组
      if (typeof oldChildren === 'string') {
        // 旧子节点是文本，清空后追加新节点
        el.textContent = ''
        newChildren.forEach(child => {
          mount(child as VNode, el as HTMLElement)
        })
      } else {
        // 都是数组，进行diff
        updateChildren(el as HTMLElement, oldChildren as VNode[], newChildren as VNode[])
      }
    }
  }

  // 更新子节点数组
  function updateChildren(el: HTMLElement, oldChildren: VNode[], newChildren: VNode[]) {
    const oldLen = oldChildren.length
    const newLen = newChildren.length
    const commonLen = Math.min(oldLen, newLen)

    // 更新共同长度的部分
    for (let i = 0; i < commonLen; i++) {
      patch(oldChildren[i], newChildren[i])
    }

    if (newLen > oldLen) {
      // 添加新节点
      for (let i = commonLen; i < newLen; i++) {
        mount(newChildren[i], el)
      }
    } else if (oldLen > newLen) {
      // 移除多余节点
      for (let i = commonLen; i < oldLen; i++) {
        el.removeChild(oldChildren[i].el!)
      }
    }
  }

  return {
    mount,
    patch
  }
}