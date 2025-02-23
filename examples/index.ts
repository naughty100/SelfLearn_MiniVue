import { reactive } from '../src/reactivity/reactive'
import { effect } from '../src/reactivity/effect'

// 创建响应式对象
const state = reactive({
  count: 0,
  message: 'Hello'
})

// 创建副作用
effect(() => {
  console.log(`计数: ${state.count}`)
  console.log(`消息: ${state.message}`)
})

// 修改值会自动触发打印
console.log('--- 修改 count ---')
state.count++

console.log('--- 修改 message ---')
state.message = 'World' 