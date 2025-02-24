import { ref } from '../../src/reactivity/ref'
import { computed } from '../../src/reactivity/computed'

describe('computed测试', () => {
    test('computed基础功能', () => {
        const count = ref(1)
        const double = computed(() => count.value * 2)  // 断点1：创建computed

        // 初始值
        expect(double.value).toBe(2)  // 断点2：首次访问，执行计算

        // 修改依赖值
        count.value = 2
        // expect(double.value).toBe(4)  // 断点3：再次访问，重新计算
    })

    test.only('computed缓存特性', () => {
        const count = ref(1)
        let computedTimes = 0

        const double = computed(() => {
            computedTimes++
            return count.value * 2
        })

        // 多次访问值，但只会计算一次
        expect(double.value).toBe(2)
        expect(double.value).toBe(2)
        expect(double.value).toBe(2)
        expect(computedTimes).toBe(1)

        // 修改依赖值后，再次计算
        count.value = 2
        expect(double.value).toBe(4)
        expect(computedTimes).toBe(2)
    })
}) 