import { reactive } from '../../src/reactivity/reactive'
import { effect } from '../../src/reactivity/effect'

describe('响应式系统测试', () => {
  test('reactive 基础功能', () => {
    const original = { count: 0 }
    const observed = reactive(original)
    
    let dummy
    effect(() => {
      dummy = observed.count
    })
    
    expect(dummy).toBe(0)
    
    // 修改值应该触发 effect
    observed.count = 1
    expect(dummy).toBe(1)
  })
}) 