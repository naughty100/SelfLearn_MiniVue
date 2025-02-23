import { Dep } from './dep'
import { activeEffect } from './effect'

// 存储对象->依赖映射关系的WeakMap
// key: 原始对象
// value: Map(key -> dep)
const targetMap = new WeakMap()

// 创建响应式对象
export function reactive<T extends object>(raw: T): T {
    return new Proxy(raw, {
        // 拦截对象属性的读取操作
        get(target, key) {
            // 进行依赖收集
            track(target, key)
            return Reflect.get(target, key)
        },
        // 拦截对象属性的设置操作
        set(target, key, value) {
            const result = Reflect.set(target, key, value)
            // 触发相关联的副作用函数
            trigger(target, key)
            return result
        }
    })
}

// 依赖收集
// 将当前运行的副作用函数与正在读取的属性关联起来
function track(target: object, key: string | symbol) {
    if (!activeEffect) return

    // 获取当前对象的依赖映射
    let depsMap = targetMap.get(target)
    if (!depsMap) {
        depsMap = new Map()
        targetMap.set(target, depsMap)
    }

    // 获取当前key的依赖集合
    let dep = depsMap.get(key)
    if (!dep) {
        dep = new Dep()
        depsMap.set(key, dep)
    }

    // 收集依赖
    dep.depend()
}

// 触发更新
// 当属性值发生变化时，触发所有相关的副作用函数重新执行
function trigger(target: object, key: string | symbol) {
    const depsMap = targetMap.get(target)
    if (!depsMap) return

    const dep = depsMap.get(key)
    if (dep) {
        dep.notify()
    }
} 