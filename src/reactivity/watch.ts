import { ReactiveEffect } from './effect'
import { isObject, hasChanged } from '../shared'

export interface WatchOptions {
    immediate?: boolean
    deep?: boolean
}

export function watch<T>(
    source: () => T,
    cb: (newValue: T, oldValue: T) => void,
    options: WatchOptions = {}
) {
    const { immediate = false, deep = false } = options

    let oldValue: T

    const job = () => {
        const newValue = runner.run()
        if (hasChanged(newValue, oldValue)) {
            cb(newValue, oldValue)
            oldValue = newValue
        }
    }

    const runner = new ReactiveEffect(
        () => source(),
        job
    )

    if (immediate) {
        job()
    } else {
        oldValue = runner.run()
    }

    return () => {
        runner.stop()
    }
}

export function watchEffect(effect: Function) {
    const runner = new ReactiveEffect(effect)
    runner.run()

    return () => {
        runner.stop()
    }
} 