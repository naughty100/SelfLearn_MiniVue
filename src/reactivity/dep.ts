import { ReactiveEffect, activeEffect } from './effect'

// Dep类用于管理依赖集合
export class Dep {
  // 存储依赖的Set集合，防止重复收集
  private deps = new Set<ReactiveEffect>()

  // 收集依赖
  // 将当前激活的副作用函数添加到依赖集合中
  depend() {
    if (activeEffect) {
      this.deps.add(activeEffect)
    }
  }

  // 触发依赖
  // 执行所有收集的副作用函数
  notify() {
    this.deps.forEach(effect => {
      effect.run()
    })
  }
} 