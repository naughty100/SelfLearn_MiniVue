import { trackRefValue, triggerRefValue } from './effect'
import { hasChanged } from '../shared'

export interface Ref<T = any> {
    value: T
}

class RefImpl<T> {
    private _value: T

    constructor(value: T) {
        this._value = value
    }

    get value() {
        trackRefValue(this)
        return this._value
    }

    set value(newVal: T) {
        if (hasChanged(newVal, this._value)) {
            this._value = newVal
            triggerRefValue(this)
        }
    }
}

export function ref<T>(value: T): Ref<T> {
    return new RefImpl(value)
} 