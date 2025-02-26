import { ref } from '../../src/reactivity/ref'
import { effect } from '../../src/reactivity/effect'

describe('ref测试', () => {
  test('ref基础功能', () => {
    const count = ref(0)
    let dummy

    effect(() => {  // 断点1：effect收集依赖
      dummy = count.value
    })

    expect(dummy).toBe(0)
    
    count.value = 2  // 断点2：触发更新
    expect(dummy).toBe(2)
  })

  test.only('ref嵌套对象', () => {
    const user = ref({
      name: '张三',
      age: 18
    })

    let dummy
    effect(() => {
      dummy = `${user.value.name}今年${user.value.age}岁`
    })

    expect(dummy).toBe('张三今年18岁')

    // 修改嵌套属性
    user.value.age = 20
    expect(dummy).toBe('张三今年20岁')
  })
}) 