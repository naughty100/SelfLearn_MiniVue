import { reactive } from '../../src/reactivity/reactive'
import { effect } from '../../src/reactivity/effect'

describe('响应式系统测试', () => {
  test('reactive 基础功能', () => {
    // 添加接口定义
    interface User {
      count: number
    }

    const original: User = { count: 0 }
    const observed = reactive(original)  // 断点1：查看 reactive 对象创建

    let dummy: number | undefined
    effect(() => {  // 断点2：进入 effect 函数
      dummy = observed.count  // 断点3：触发 getter，查看依赖收集
    })

    expect(dummy).toBe(0)

    // 修改值应该触发 effect
    observed.count = 1  // 断点4：触发 setter，查看更新触发
    expect(dummy).toBe(1)
  })
}) 