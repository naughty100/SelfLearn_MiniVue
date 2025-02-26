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
  test('should update element', () => {
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

  // 测试列表更新和key的作用
  test('should handle list update with keys', () => {
    // 初始列表
    const vnode1 = createVNode('div', {}, [
      createVNode('div', { key: 'a', id: 'a' }, 'A'),
      createVNode('div', { key: 'b', id: 'b' }, 'B'),
      createVNode('div', { key: 'c', id: 'c' }, 'C')
    ])
    renderer.render(vnode1, container)
    expect(container.innerHTML).toBe(
      '<div><div key="a" id="a">A</div><div key="b" id="b">B</div><div key="c" id="c">C</div></div>'
    )

    // 更新列表：移动、删除和新增节点
    const vnode2 = createVNode('div', {}, [  // 将null改为空对象{}，符合类型要求
      createVNode('div', { key: 'b', id: 'b2' }, 'B2'), // 移动到前面并更新
      createVNode('div', { key: 'd', id: 'd' }, 'D'),   // 新增节点
      createVNode('div', { key: 'a', id: 'a' }, 'A'),   // 移动到后面
      // c被删除了
    ])
    renderer.render(vnode2, container)

    // 验证更新后的结果
    expect(container.innerHTML).toBe(
      '<div><div key="b" id="b2">B2</div><div key="d" id="d">D</div><div key="a" id="a">A</div></div>'
    )

    // 不使用key的情况
    const vnode3 = createVNode('div', {}, [
      createVNode('div', { id: 'x' }, 'X'),
      createVNode('div', { id: 'y' }, 'Y')
    ])
    renderer.render(vnode3, container)

    const vnode4 = createVNode('div', {}, [
      createVNode('div', { id: 'z' }, 'Z'),
      createVNode('div', { id: 'x' }, 'X')
    ])
    renderer.render(vnode4, container)

    // 没有key时，节点会被就地复用，导致不必要的DOM操作
    expect(container.innerHTML).toBe(
      '<div><div key="null" id="z">Z</div><div key="null" id="x">X</div><div key="a" id="a">A</div></div>'
    )
  })

  // 测试列表重排序
  test.only('should handle list reordering', () => {
    // 创建一个有序列表
    const createList = (items: string[]) => {
      return createVNode('ul', {},
        items.map(item => createVNode('li', { key: item }, item))
      )
    }

    // 初始列表：1, 2, 3, 4
    const list1 = createList(['1', '2', '3', '4'])
    renderer.render(list1, container)
    expect(container.innerHTML).toBe(
      '<ul><li key="1">1</li><li key="2">2</li><li key="3">3</li><li key="4">4</li></ul>'
    )

    // 重新排序：4, 1, 3, 2
    const list2 = createList(['4', '1', '3', '2'])
    renderer.render(list2, container)
    expect(container.innerHTML).toBe(
      '<ul><li key="4">4</li><li key="1">1</li><li key="3">3</li><li key="2">2</li></ul>'
    )

    // 部分更新：4, 1, 5, 2 (3被5替换)
    const list3 = createList(['4', '1', '5', '2'])
    renderer.render(list3, container)
    expect(container.innerHTML).toBe(
      '<ul><li key="4">4</li><li key="1">1</li><li key="5">5</li><li key="2">2</li></ul>'
    )
  })
})