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
}) 