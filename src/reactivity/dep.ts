import { ReactiveEffect, activeEffect } from './effect'

export class Dep {
  private deps = new Set<ReactiveEffect>()

  depend() {
    if (activeEffect) {
      this.deps.add(activeEffect)
    }
  }

  notify() {
    this.deps.forEach(effect => {
      effect.run()
    })
  }
} 