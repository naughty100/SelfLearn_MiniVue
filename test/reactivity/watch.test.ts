import { ref } from '../../src/reactivity/ref'
import { watch, watchEffect } from '../../src/reactivity/watch'

describe('watch/watchEffect测试', () => {
  
  test('watch基础功能', () => {
    const count = ref(0)
    let dummy = 0

    watch(
      () => count.value,  // 断点1：创建watch
      (newValue, oldValue) => {
        dummy = newValue  // 断点2：回调执行
      }
    )

    // 初始不会执行
    expect(dummy).toBe(0)

    // 修改值触发watch
    count.value = 1
    expect(dummy).toBe(1)
  })

  test('watch immediate选项', () => {
    const count = ref(0)
    let dummy = 0

    watch(
      () => count.value,
      (newValue, oldValue) => {
        dummy = newValue
      },
      { immediate: true }  // 立即执行
    )

    // 立即执行回调
    expect(dummy).toBe(0)

    // 修改值再次触发
    count.value = 1
    expect(dummy).toBe(1)
  })

  test.only('watchEffect基础功能', () => {
    const count = ref(0)
    let dummy = 0

    watchEffect(() => {  // 断点3：创建watchEffect
      dummy = count.value  // 断点4：自动收集依赖
    })

    // 立即执行
    expect(dummy).toBe(0)

    // 修改值自动触发
    count.value = 1
    // expect(dummy).toBe(1)
  })

  test('停止监听功能', () => {
    const count = ref(0)
    let dummy = 0

    const stop = watchEffect(() => {
      dummy = count.value
    })

    expect(dummy).toBe(0)

    // 停止监听
    stop()

    // 修改值不再触发更新
    count.value = 1
    expect(dummy).toBe(0)
  })
}) 