import { VNode, Text } from './vnode'

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
            el.appendChild(document.createTextNode(child))
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

    // 更新属性和子节点
    // ... 待实现
  }

  return {
    mount,
    patch
  }
} 