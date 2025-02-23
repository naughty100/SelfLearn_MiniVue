import { reactive } from '../../src/reactivity/reactive'
import { effect } from '../../src/reactivity/effect'

const user = reactive({
  age: 10
})

effect(() => {
  console.log('用户年龄是:', user.age)
})

// 修改age会自动触发effect重新执行
user.age = 20 