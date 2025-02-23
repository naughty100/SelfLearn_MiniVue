import { Dep } from './dep'
import { activeEffect } from './effect'

const targetMap = new WeakMap()

export function reactive<T extends object>(raw: T): T {
    return new Proxy(raw, {
        get(target, key) {
            // 依赖收集
            track(target, key)
            return Reflect.get(target, key)
        },
        set(target, key, value) {
            const result = Reflect.set(target, key, value)
            // 触发更新
            trigger(target, key)
            return result
        }
    })
}

function track(target: object, key: string | symbol) {
    // 没有正在运行的副作用函数，直接返回
    if (!activeEffect) return

    let depsMap = targetMap.get(target)
    if (!depsMap) {
        depsMap = new Map()
        targetMap.set(target, depsMap)
    }

    let dep = depsMap.get(key)
    if (!dep) {
        dep = new Dep()
        depsMap.set(key, dep)
    }

    dep.depend()
}

function trigger(target: object, key: string | symbol) {
    const depsMap = targetMap.get(target)
    if (!depsMap) return

    const dep = depsMap.get(key)
    if (dep) {
        dep.notify()
    }
} 