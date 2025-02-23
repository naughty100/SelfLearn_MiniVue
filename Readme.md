
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
4. 实现`ref`和`computed`

### 第二阶段：虚拟DOM
1. 实现VNode数据结构
2. 实现DOM diff算法
3. 实现渲染器（mount/patch）

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