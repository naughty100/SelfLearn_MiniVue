// 存储当前正在执行的副作用函数
// 在收集依赖时需要用到这个全局变量
export let activeEffect: ReactiveEffect | undefined

export class ReactiveEffect {
  private _fn: Function

  constructor(fn: Function) {
    this._fn = fn
  }

  // 运行副作用函数，同时处理activeEffect的设置和清理
  run() {
    // 设置当前运行的副作用函数
    activeEffect = this
    // 执行副作用函数
    const result = this._fn()
    // 执行完毕后清空activeEffect
    activeEffect = undefined
    return result
  }
}

// 创建响应式副作用
// 当依赖的响应式数据发生变化时，副作用函数会重新执行
export function effect(fn: Function) {
  const _effect = new ReactiveEffect(fn)
  // 立即执行一次副作用函数，进行依赖收集
  _effect.run()
} 