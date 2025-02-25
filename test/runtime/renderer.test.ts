import { createRenderer } from '../../src/runtime/renderer'
import { createVNode, Text, Fragment } from '../../src/runtime/vnode'

// 测试渲染器功能
describe('renderer', () => {
  let container: HTMLElement

  // 在所有测试开始前检查环境
  beforeAll(() => {
    if (typeof document === 'undefined') {
      throw new Error('请确保测试环境支持DOM操作（使用jsdom）')
    }
  })

  // 在每个测试用例执行前初始化容器
  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container) // 添加到document中
  })

  // 在每个测试用例执行后清理容器
  afterEach(() => {
    if (container && container.parentNode) {
      container.parentNode.removeChild(container)
    }
  })

  // 创建自定义渲染器，传入平台相关的DOM操作方法
  const renderer = createRenderer({
    // 创建元素节点
    createElement: tag => document.createElement(tag),
    // 创建文本节点
    createText: text => document.createTextNode(text),
    // 设置元素文本内容
    setElementText: (el, text) => { el.textContent = text },
    // 插入子节点到父节点
    insert: (child, parent) => parent.appendChild(child),
    // 处理属性更新
    patchProps: (el, key, _, next) => {
      if (key.startsWith('on')) {
        // 处理事件监听器
        el.addEventListener(key.slice(2).toLowerCase(), next)
      } else {
        // 处理普通属性
        el.setAttribute(key, next)
      }
    }
  })

  // 测试元素渲染功能
  test('should render element', () => {
    // 创建虚拟节点
    const vnode = createVNode('div', { id: 'test' }, 'hello')
    // 执行渲染
    renderer.render(vnode, container)
    // 验证渲染结果
    expect(container.innerHTML).toBe('<div id="test">hello</div>')
  })

  // 测试元素更新功能
  test.only('should update element', () => {
    // 先渲染初始节点
    const vnode1 = createVNode('div', { id: 'test' }, 'hello')
    renderer.render(vnode1, container)

    // 创建新的虚拟节点
    const vnode2 = createVNode('div', { id: 'foo' }, 'world')
    // 执行更新渲染
    renderer.render(vnode2, container)
    // 验证更新后的结果
    expect(container.innerHTML).toBe('<div id="foo">world</div>')
  })
})