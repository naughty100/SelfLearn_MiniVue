# About This Project

我是一个前端开发者，在开发还是面试过程中，都离不开对Vue的理解。
我想通过手写一个迷你简易版Vue的形式去深入理解Vue这个框架是如何运作的。

# 大概的目录结构
mini-vue/
├─ src/
│ ├─ reactivity/ # 响应式系统
│ │ ├─ effect.ts # 副作用和依赖收集
│ │ ├─ reactive.ts # reactive/ref实现
│ │ └─ dep.ts # 依赖管理
│ ├─ compiler/ # 编译系统
│ │ ├─ parse.ts # 模板解析
│ │ ├─ transform.ts # 转换AST
│ │ └─ generate.ts # 代码生成
│ ├─ runtime/ # 运行时核心
│ │ ├─ vnode.ts # 虚拟节点实现
│ │ ├─ renderer.ts # 渲染器
│ │ └─ component.ts # 组件处理
│ └─ shared/ # 公共工具
├─ examples/ # 示例目录
└─ test/ # 测试目录

# 分步实现要点
### 第一阶段：响应式系统（核心）
1. 实现`reactive()`用Proxy代理对象
2. 实现`effect`副作用跟踪
3. 实现依赖收集（track/trigger）
4. 实现基础响应式API
   - 实现`ref`处理原始值的响应式
   - 实现`computed`计算属性
     - 懒执行特性
     - 缓存特性
   - 实现`watch`
     - 立即执行选项
     - 深度监听选项
   - 实现`watchEffect`
     - 自动收集依赖
     - 停止监听功能

### 第二阶段：虚拟DOM（最小核心实现）

#### 1. VNode基础结构
```typescript
interface VNode {
  type: string | Symbol // 元素类型/文本节点标识
  props: Record<string, any> // 属性/事件
  children: Array<VNode | string> // 子节点
  el?: HTMLElement // 关联的真实DOM
  key?: any // 用于diff的key
}

// 创建VNode的工厂函数
function h(type: string, props: {}, children: []) { ... }
```

#### 2. 最简Diff算法（同层比较）
实现逻辑：
1. 比较根节点类型
   - 类型不同：直接替换整个节点
   - 类型相同：进入属性比较
2. 属性更新：
   - 新旧props差异比较
   - 事件监听器特殊处理（如onClick）
3. 子节点比较（带key）：
   - 头头比较
   - 尾尾比较
   - 新增节点
   - 删除节点
   - 移动节点（通过key映射）

#### 3. 基础渲染器
```typescript
// 挂载流程
function mount(vnode: VNode, container: HTMLElement) {
  // 1. 创建DOM元素
  // 2. 处理props（包括事件绑定）
  // 3. 递归挂载子节点
  // 4. 将DOM插入容器
}

// 更新流程
function patch(oldVNode: VNode, newVNode: VNode) {
  // 1. 执行diff算法比较差异
  // 2. 按需更新DOM：
  //   - 更新文本内容
  //   - 更新属性/事件
  //   - 处理子节点变更
}

// 卸载流程
function unmount(vnode: VNode) {
  // 从父节点移除DOM
  // 清理事件监听
}
```

### 第三阶段：模板编译
1. 实现模板解析成AST
2. 转换AST（处理指令等）
3. 生成渲染函数代码

### 第四阶段：组件系统
1. 实现组件实例管理
2. 实现生命周期钩子
3. 实现Props处理
4. 实现插槽机制

## 推荐实现顺序
1. 从响应式系统开始 → 虚拟DOM → 编译器 → 组件整合
2. 每个阶段通过examples目录添加测试用例
3. 使用TypeScript保证类型安全
4. 先实现核心功能再补充边界情况

## 文档建议
1. 添加开发日志记录实现过程
2. 对关键算法添加原理说明
3. 用流程图展示数据流转
4. 对比与真实Vue实现的差异

需要特别注意的技术点：
- 使用Proxy实现响应式时要注意嵌套对象处理
- 虚拟DOM的diff算法要处理key的使用
- 编译器需要处理动态属性和事件绑定
- 组件更新要结合响应式系统和渲染器

建议先实现最简版本再逐步迭代，不要一开始追求完整功能覆盖。