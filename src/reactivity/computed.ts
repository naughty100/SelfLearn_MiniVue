import { ReactiveEffect } from './effect'
import { Ref } from './ref'

export function computed<T>(getter: () => T): Ref<T> {
    let value: T
    let dirty = true

    const runner = new ReactiveEffect(getter, () => {
        if (!dirty) {
            dirty = true
        }
    })

    return {
        get value() {
            if (dirty) {
                value = runner.run()
                dirty = false
            }
            return value
        }
    }
} 