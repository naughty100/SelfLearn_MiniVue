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

  test('多个依赖的情况', () => {
    // 创建一个包含多个属性的响应式对象
    const user = reactive({
      name: '张三',
      age: 18,
      info: {
        title: '程序员',
        level: 'P5'
      }
    })

    // 追踪多个值的变化
    let message: string = ''
    effect(() => {  // 断点1：effect 函数执行
      message = `${user.name}是${user.age}岁的${user.info.title}`  // 断点2：访问多个属性
    })

    // 初始状态检查
    expect(message).toBe('张三是18岁的程序员')

    // 修改其中一个值
    user.name = '李四'  // 断点3：修改name
    expect(message).toBe('李四是18岁的程序员')

    // 修改嵌套对象的值
    user.info.title = '高级工程师'  // 断点4：修改嵌套属性
    expect(message).toBe('李四是18岁的高级工程师')

    // 修改另一个值
    user.age = 20  // 断点5：修改age
    expect(message).toBe('李四是20岁的高级工程师')
  })

  test.only('多个effect依赖同一个属性', () => {
    const counter = reactive({
      count: 0
    })

    // 第一个effect：显示计数
    let message1: string = ''
    effect(() => {  // 断点1：第一个effect执行
      message1 = `计数: ${counter.count}`  // 断点2：访问count
    })

    // 第二个effect：显示翻倍的计数
    let message2: string = ''
    effect(() => {  // 断点3：第二个effect执行
      message2 = `翻倍: ${counter.count * 2}`  // 断点4：访问count
    })

    // 第三个effect：显示计数是否为偶数
    let message3: string = ''
    effect(() => {  // 断点5：第三个effect执行
      message3 = `是偶数: ${counter.count % 2 === 0}`  // 断点6：访问count
    })

    // 初始状态检查
    expect(message1).toBe('计数: 0')
    expect(message2).toBe('翻倍: 0')
    expect(message3).toBe('是偶数: true')

    // 修改count，应该触发所有effect
    counter.count = 1  // 断点7：修改count，应该触发三个effect
    expect(message1).toBe('计数: 1')
    expect(message2).toBe('翻倍: 2')
    expect(message3).toBe('是偶数: false')

    // 再次修改，确保所有effect都能正确触发
    counter.count = 2  // 断点8：再次修改count
    expect(message1).toBe('计数: 2')
    expect(message2).toBe('翻倍: 4')
    expect(message3).toBe('是偶数: true')
  })
}) 