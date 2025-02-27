# About This Project

我是一个前端开发者，在开发还是面试过程中，都离不开对Vue的理解。
我想通过手写一个迷你简易版Vue的形式去深入理解Vue这个框架是如何运作的。

I am a frontend developer, and understanding Vue is essential in both development and interviews.
I want to deepen my understanding of how the Vue framework works by implementing a mini version of Vue from scratch.

# 大概的目录结构
# Project Structure
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

src/
├─ reactivity/ # Reactivity System
│ ├─ effect.ts # Effects and Dependency Collection
│ ├─ reactive.ts # reactive/ref Implementation
│ └─ dep.ts # Dependency Management
├─ compiler/ # Compiler System
│ ├─ parse.ts # Template Parsing
│ ├─ transform.ts # AST Transformation
│ └─ generate.ts # Code Generation
├─ runtime/ # Runtime Core
│ ├─ vnode.ts # Virtual Node Implementation
│ ├─ renderer.ts # Renderer
│ └─ component.ts # Component Handling
└─ shared/ # Shared Utilities
examples/ # Examples Directory
test/ # Test Directory

# 分步实现要点
# Implementation Steps

### 第一阶段：响应式系统（核心）
### Phase 1: Reactivity System (Core)
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

1. Implement `reactive()` using Proxy
2. Implement `effect` for side effect tracking
3. Implement dependency collection (track/trigger)
4. Implement basic reactivity APIs
    - Implement `ref` for primitive value reactivity
    - Implement `computed` properties
      - Lazy evaluation
      - Caching
    - Implement `watch`
      - Immediate execution option
      - Deep watching option
    - Implement `watchEffect`
      - Automatic dependency collection
      - Stop watching functionality

### 第二阶段：虚拟DOM（最小核心实现）
### Phase 2: Virtual DOM (Minimal Core Implementation)
1. 实现虚拟节点（vnode）基础结构
   - 支持元素/组件/文本三种节点类型
   - 包含props/children等关键属性
2. 实现diff算法核心逻辑
   - 同层级比较（避免O(n^3)复杂度）
   - 处理节点类型变化（组件↔元素）
   - 优化带key元素的移动操作
3. 实现渲染器核心功能
   - 支持浏览器环境和服务端渲染（抽象DOM操作）
   - 实现挂载/更新/卸载基础流程
4. 处理特殊元素类型
   - 文本节点快速更新
   - 注释节点占位处理
   - Fragment多根节点支持
5. 实现props更新机制
   - 属性新增/修改/删除的比对
   - 事件监听器的绑定与解绑
   - 特殊属性（如key/ref）处理

1. Implement virtual node (vnode) basic structure
   - Support element/component/text node types
   - Include key properties like props/children
2. Implement core diff algorithm logic
   - Same level comparison (avoid O(n^3) complexity)
   - Handle node type changes (component↔element)
   - Optimize keyed element movement
3. Implement renderer core functionality
   - Support browser and SSR (abstract DOM operations)
   - Implement mount/update/unmount basic flow
4. Handle special element types
   - Quick text node updates
   - Comment node placeholders
   - Fragment multi-root support
5. Implement props update mechanism
   - Compare attribute addition/modification/deletion
   - Event listener binding and unbinding
   - Special attribute handling (key/ref)

### 第三阶段：模板编译（编译器核心）
### Phase 3: Template Compilation (Compiler Core)
1. 模板解析器实现
   - 实现基于有限状态机的词法分析
   - 构建HTML元素栈处理嵌套结构
   - 支持文本/元素/注释/插值四种节点类型
   - 处理动态属性绑定（v-bind）和事件监听（v-on）

2. AST转换优化
   - 实现指令解析系统（v-if/v-for等）
   - 处理插值表达式（{{ value }}）转换为渲染函数
   - 静态节点提升优化（标记静态子树）
   - 添加源码位置信息用于调试

3. 代码生成策略
   - 生成优化后的渲染函数代码
   - 处理作用域链（组件局部变量 vs 全局变量）
   - 生成sourcemap支持模板调试
   - 实现生产环境代码压缩

1. Template Parser Implementation
   - Implement lexical analysis based on finite state machine
   - Build HTML element stack for nested structures
   - Support text/element/comment/interpolation node types
   - Handle dynamic attribute binding (v-bind) and event listening (v-on)

2. AST Transform Optimization
   - Implement directive parsing system (v-if/v-for etc.)
   - Process interpolation expressions ({{ value }}) to render functions
   - Static node hoisting optimization (mark static subtrees)
   - Add source code location info for debugging

3. Code Generation Strategy
   - Generate optimized render function code
   - Handle scope chain (component local vs global variables)
   - Generate sourcemap for template debugging
   - Implement production environment code minification

### 第四阶段：组件系统（可组合架构）
### Phase 4: Component System (Composable Architecture)
1. 组件实例管理
   - 创建组件上下文（提供/注入）
   - 处理setup函数与响应式状态关联
   - 实现组件树的生命周期管理

2. 生命周期增强
   - 实现异步挂载（Suspense组件支持）
   - 错误边界处理（errorCaptured钩子）
   - 服务器端渲染专用生命周期

3. Props高级处理
   - 类型校验系统（运行时类型检查）
   - 实现深层次props响应式更新
   - 处理非props属性继承（组件透传）

4. 插槽扩展机制
   - 实现作用域插槽（带参数的插槽）
   - 动态插槽名支持（v-slot:[dynamicName]）
   - 编译时优化插槽内容为函数

1. Component Instance Management
   - Create component context (provide/inject)
   - Handle setup function and reactive state association
   - Implement component tree lifecycle management

2. Lifecycle Enhancement
   - Implement async mounting (Suspense component support)
   - Error boundary handling (errorCaptured hook)
   - Server-side rendering specific lifecycle

3. Advanced Props Handling
   - Type validation system (runtime type checking)
   - Implement deep props reactive updates
   - Handle non-props attribute inheritance

4. Slot Extension Mechanism
   - Implement scoped slots (slots with parameters)
   - Dynamic slot name support (v-slot:[dynamicName])
   - Compile-time optimization of slot content to functions

## 推荐实现策略
## Recommended Implementation Strategy
1. 分层架构实现顺序
   - 响应式系统 → 虚拟DOM → 编译器 → 组件整合 → 生态工具
   - 每个模块通过`__tests__/`目录添加单元测试
   - 使用benchmark目录进行性能对比测试

2. 质量保障措施
   - 添加TS类型定义（组件选项类型/函数签名）
   - 实现测试覆盖率监控（jest --coverage）
   - 代码规范检查（eslint + prettier）
   - 关键算法添加性能测试用例

3. 迭代开发建议
   - 使用monorepo管理核心与生态包
   - 优先实现90%常用场景再处理边界情况
   - 每个版本通过examples/添加演示案例

1. Layered Architecture Implementation Order
   - Reactivity System → Virtual DOM → Compiler → Component Integration → Ecosystem Tools
   - Add unit tests through `__tests__/` directory for each module
   - Use benchmark directory for performance comparison tests

2. Quality Assurance Measures
   - Add TS type definitions (component option types/function signatures)
   - Implement test coverage monitoring (jest --coverage)
   - Code standard checking (eslint + prettier)
   - Add performance test cases for key algorithms

3. Iterative Development Suggestions
   - Use monorepo to manage core and ecosystem packages
   - Implement 90% common scenarios before handling edge cases
   - Add demo cases through examples/ for each version

## 文档规范建议
## Documentation Guidelines
1. 架构设计文档
   - 模块关系图（使用mermaid语法绘制）
   - 核心类结构UML图
   - 响应式系统数据流向图

2. 开发辅助文档
   - 维护CHANGELOG.md记录重大变更
   - 编写CONTRIBUTING.md贡献指南
   - 添加ARCHITECTURE.md架构说明

3. API文档规范
   - 使用TSDoc格式注释导出接口
   - 为每个public API添加使用示例
   - 单独文档说明与Vue3的差异点

1. Architecture Design Documentation
   - Module relationship diagram (using mermaid syntax)
   - Core class structure UML diagram
   - Reactivity system data flow diagram

2. Development Support Documentation
   - Maintain CHANGELOG.md for major changes
   - Write CONTRIBUTING.md guidelines
   - Add ARCHITECTURE.md explanation

3. API Documentation Standards
   - Use TSDoc format for exported interfaces
   - Add usage examples for each public API
   - Separate documentation for differences from Vue3

需要特别注意的技术点：
Key Technical Points to Note:
- 使用Proxy实现响应式时要注意嵌套对象处理
- 虚拟DOM的diff算法要处理key的使用
- 编译器需要处理动态属性和事件绑定
- 组件更新要结合响应式系统和渲染器

- Pay attention to nested object handling when implementing reactivity with Proxy
- Handle key usage in Virtual DOM diff algorithm
- Compiler needs to handle dynamic attributes and event binding
- Component updates should combine reactivity system and renderer

建议先实现最简版本再逐步迭代，不要一开始追求完整功能覆盖。
Start with implementing the simplest version and iterate gradually, rather than aiming for complete functionality coverage from the beginning.