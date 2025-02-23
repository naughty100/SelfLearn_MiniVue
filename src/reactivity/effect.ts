// 存储当前激活的副作用函数
export let activeEffect: ReactiveEffect | undefined

export class ReactiveEffect {
  private _fn: Function
  
  constructor(fn: Function) {
    this._fn = fn
  }

  run() {
    activeEffect = this
    const result = this._fn()
    activeEffect = undefined
    return result
  }
}

export function effect(fn: Function) {
  const _effect = new ReactiveEffect(fn)
  _effect.run()
} 