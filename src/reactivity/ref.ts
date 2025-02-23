import { trackRefValue, triggerRefValue } from './effect'
import { hasChanged, isObject } from '../shared'
import { reactive } from './reactive'

export interface Ref<T = any> {
    value: T
}

class RefImpl<T> {
    private _value: T
    public dep = new Set()

    constructor(value: T) {
        this._value = convert(value)
    }

    get value() {
        trackRefValue(this)
        return this._value
    }

    set value(newVal: T) {
        if (hasChanged(newVal, this._value)) {
            this._value = convert(newVal)
            triggerRefValue(this)
        }
    }
}

// 辅助函数处理值的转换
function convert<T>(value: T): T {
    return isObject(value) ? reactive(value as object) as T : value
}

export function ref<T>(value: T): Ref<T> {
    return new RefImpl(value)
} 