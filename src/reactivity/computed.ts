import { ReactiveEffect } from './effect'
import { Ref } from './ref'

class ComputedRefImpl<T> implements Ref<T> {
    private _value!: T
    private _dirty = true
    private _effect: ReactiveEffect

    constructor(getter: () => T) {
        this._effect = new ReactiveEffect(getter, () => {
            if (!this._dirty) {
                this._dirty = true
            }
        })
    }

    get value() {
        if (this._dirty) {
            this._value = this._effect.run()
            this._dirty = false
        }
        return this._value
    }
}

export function computed<T>(getter: () => T): Ref<T> {
    return new ComputedRefImpl(getter)
} 