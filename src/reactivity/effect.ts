// 存储当前正在执行的副作用函数
// 在收集依赖时需要用到这个全局变量
export let activeEffect: ReactiveEffect | undefined

export class ReactiveEffect {
  private _fn: Function
  public scheduler: Function | undefined
  public active = true  // 添加激活状态标记
  private deps: Set<any>[] = []  // 存储所有相关的依赖集合

  constructor(fn: Function, scheduler?: Function) {
    this._fn = fn
    this.scheduler = scheduler
  }

  // 运行副作用函数，同时处理activeEffect的设置和清理
  run() {
    if (!this.active) {
      return  // 如果已停止，直接返回
    }
    activeEffect = this
    const result = this._fn()
    activeEffect = undefined
    return result
  }

  stop() {
    if (this.active) {
      // 清理所有依赖
      this.deps.forEach(dep => {
        dep.delete(this)
      })
      this.deps.length = 0
      this.active = false
    }
  }

  // 添加依赖集合
  addDep(dep: Set<any>) {
    this.deps.push(dep)
  }
}

// 创建响应式副作用
// 当依赖的响应式数据发生变化时，副作用函数会重新执行
export function effect(fn: Function) {
  const _effect = new ReactiveEffect(fn)
  // 立即执行一次副作用函数，进行依赖收集
  _effect.run()
}

// 为ref提供的特殊追踪函数
export function trackRefValue(ref: any) {
  if (activeEffect) {
    ref.dep = ref.dep || new Set()
    ref.dep.add(activeEffect)
    activeEffect.addDep(ref.dep)
  }
}

export function triggerRefValue(ref: any) {
  if (ref.dep) {
    ref.dep.forEach((effect: ReactiveEffect) => {
      if (effect.scheduler) {
        effect.scheduler()
      } else {
        effect.run()
      }
    })
  }
} 