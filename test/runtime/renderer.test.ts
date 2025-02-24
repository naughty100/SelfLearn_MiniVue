import { JSDOM } from 'jsdom'
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>')
global.document = dom.window.document
global.window = dom.window as any

import { h, createTextVNode } from '../../src/runtime/vnode'
import { createRenderer } from '../../src/runtime/renderer'

describe('渲染器测试', () => {
  test('基础渲染功能', () => {
    const renderer = createRenderer()
    const container = document.createElement('div')

    // 创建虚拟节点
    const vnode = h('div', { class: 'test' }, [
      createTextVNode('Hello'),
      h('span', {}, ['World'])
    ])

    // 挂载
    renderer.mount(vnode, container)

    // 验证渲染结果
    expect(container.innerHTML).toBe(
      '<div class="test">Hello<span>World</span></div>'
    )
  })

  test.only('更新属性', () => {
    const renderer = createRenderer()
    const container = document.createElement('div')

    // 初始渲染
    const oldVNode = h('div', { class: 'old', id: 'test' }, [createTextVNode('Hello')])
    renderer.mount(oldVNode, container)
    expect(container.innerHTML).toBe('<div class="old" id="test">Hello</div>')

    // 更新属性
    const newVNode = h('div', { class: 'new', style: 'color: red' }, [createTextVNode('Hello')])
    renderer.patch(oldVNode, newVNode)
    expect(container.innerHTML).toBe('<div class="new" style="color: red">Hello</div>')
  })

  test('更新子节点', () => {
    const renderer = createRenderer()
    const container = document.createElement('div')

    // 初始渲染
    const oldVNode = h('div', {}, [
      h('span', {}, [createTextVNode('First')]),
      h('span', {}, [createTextVNode('Second')])
    ])
    renderer.mount(oldVNode, container)
    expect(container.innerHTML).toBe('<div><span>First</span><span>Second</span></div>')

    // 更新子节点
    const newVNode = h('div', {}, [
      h('span', {}, [createTextVNode('First')]),
      h('span', {}, [createTextVNode('Updated')]),
      h('span', {}, [createTextVNode('Third')])
    ])
    renderer.patch(oldVNode, newVNode)
    expect(container.innerHTML).toBe('<div><span>First</span><span>Updated</span><span>Third</span></div>')
  })
}) 