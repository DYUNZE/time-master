# TimeMaster - Agent Guide

> 本文档面向 AI 编程助手，包含项目架构、开发规范和重要实现细节。

## 项目概述

TimeMaster 是一个基于 Vue 3 的个人时间管理应用，提供时钟展示、日历计划、聊天室、图书馆、游戏工厂等功能模块。

**项目名称**: time-master  
**版本**: 0.0.0  
**类型**: 单页应用 (SPA)  
**语言**: 中文

## 技术栈

- **框架**: Vue 3.5.26 (Composition API + `<script setup>` 语法)
- **构建工具**: Vite 7.3.0
- **类型系统**: TypeScript 5.9.3
- **状态管理**: Pinia 3.0.4
- **路由**: Vue Router 4.6.4
- **UI 组件库**: Element Plus 2.13.2
- **CSS 预处理器**: Sass 1.97.3
- **工具库**: VueUse 14.1.0
- **特效**: tsParticles (@tsparticles/vue3)
- **日历农历**: lunar-javascript 1.7.7
- **音乐播放**: APlayer 1.10.1

## 开发环境要求

- Node.js: ^20.19.0 || >=22.12.0
- 包管理器: npm (使用 package-lock.json)

## 常用命令

```bash
# 开发服务器
npm run dev          # 启动开发服务器，监听 0.0.0.0:5173

# 构建
npm run build        # 类型检查 + 生产构建
npm run build-only   # 仅生产构建（跳过类型检查）
npm run type-check   # 仅类型检查

# 预览
npm run preview      # 预览生产构建
```

## 项目结构

```
src/
├── assets/              # 静态资源
│   ├── img/            # 图片（mountain.svg 登录背景）
│   └── logo.svg
├── components/         # 组件
│   ├── Clock.vue       # Canvas 时钟组件
│   ├── LoginForm.vue   # 登录表单
│   ├── MusicPlayer.vue # 音乐播放器
│   ├── Sidebar.vue     # 侧边导航栏
│   ├── effects/        # 特效组件
│   │   └── Star.vue    # 粒子星空背景（tsParticles）
│   ├── icons/          # 图标组件（SVG）
│   └── plan/
│       └── Plan.vue    # 日历计划组件（含农历）
├── composables/        # 组合式函数（Vue3 官方推荐命名）
│   ├── useGlobalTheme.ts  # 全局主题（暗黑/亮色切换）
│   └── useLogin.ts        # 登录/登出逻辑
├── router/             # 路由配置
│   └── index.ts        # 路由定义 + 导航守卫
├── stores/             # Pinia 状态仓库
│   └── useUserStore.ts # 用户状态（登录态、用户信息）
├── styles/             # 样式文件
│   ├── base.css        # CSS 变量定义（主题色）
│   ├── index.scss      # Element Plus 主题覆盖
│   └── main.css        # 全局工具类
├── types/              # TypeScript 类型定义
│   ├── loginForm.ts    # 登录表单类型
│   ├── menu.ts         # 菜单项类型
│   └── *.d.ts          # 第三方库类型声明
├── utils/              # 工具函数
│   └── message.ts      # Element Plus 消息封装
├── views/              # 页面视图
│   ├── LoginView.vue   # 登录页
│   ├── HomeLayout.vue  # 首页布局（含侧边栏）
│   ├── HomeIndex.vue   # 首页内容
│   ├── AboutView.vue   # 聊天室页面
│   ├── PlanView.vue    # 计划页面
│   ├── GameFactoryView.vue  # 游戏工厂
│   ├── LibraryView.vue # 图书馆
│   ├── SettingView.vue # 设置页面
│   └── setting/        # 设置子页面
│       ├── Basic.vue   # 基本信息
│       ├── Account.vue # 账户设置
│       └── Prefer.vue  # 偏好设置
├── App.vue             # 根组件
└── main.ts             # 应用入口
```

## 架构特点

### 1. 组件自动导入

项目使用 `unplugin-auto-import` 和 `unplugin-vue-components` 实现自动导入：

- **Element Plus 组件**: 无需手动导入，直接使用（如 `<el-button>`）
- **Element Plus API**: 自动导入，但全局类型声明在 `auto-imports.d.ts`
- **自定义组件**: 自动注册，详见 `components.d.ts`

### 2. 主题系统

- **亮色主题**: 米黄色背景 (#FDFAF5)，定义在 `base.css` :root
- **暗黑主题**: 深黑渐变背景，通过 `html.dark` 类切换
- **切换方式**: 使用 VueUse 的 `useDark`，存储键名为 `'theme'`
- **Element Plus 主题**: 主色调覆盖为 #e6952b（橙色）

### 3. 路由结构

```
/                       -> 重定向到 /login
/login                  -> 登录页
/home                   -> 首页布局（带侧边栏）
  ├── /home/index       -> 首页
  ├── /home/plan        -> 计划（日历）
  ├── /home/chat        -> 聊天室
  ├── /home/library     -> 图书馆
  ├── /home/game-factory -> 游戏工厂
  └── /home/setting     -> 设置（嵌套路由）
       ├── /home/setting/basic
       ├── /home/setting/account
       └── /home/setting/prefer
/*                      -> 404 重定向到 /login
```

**路由守卫逻辑**:
- `requiresAuth: true` 的路由需登录，未登录跳转登录页
- 已登录用户访问登录页自动跳转首页

### 4. 状态管理

使用 Pinia + Composition API 风格：

```typescript
// stores/useUserStore.ts
const useUserStore = defineStore('user', () => {
  const userInfo = reactive<UserInfo>({ username: '' })
  const loginState = ref(false)
  const getLoginState = computed(() => loginState.value)
  const setLoginState = (state: boolean) => { loginState.value = state }
  return { getLoginState, setLoginState, userInfo }
})
```

### 5. 响应式布局断点

项目使用以下媒体查询断点：

| 断点 | 宽度 | 行为 |
|------|------|------|
| 默认 | > 834px | 完整侧边栏 (256px)，显示标签文字 |
| 平板 | <= 834px | 折叠侧边栏 (70px)，隐藏标签文字 |
| 手机 | <= 576px | 隐藏侧边栏，显示底部导航栏 |

## 代码风格规范

### 文件命名

- **组件**: PascalCase (如 `Clock.vue`, `Sidebar.vue`)
- **组合式函数**: camelCase 以 `use` 开头 (如 `useLogin.ts`)
- **类型文件**: camelCase (如 `loginForm.ts`, `menu.ts`)
- **样式文件**: kebab-case 或 camelCase

### Vue 单文件组件规范

```vue
<script setup lang="ts">
// 1. 导入外部模块
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/useUserStore'

// 2. 类型导入
import type { MenuItem } from '@/types/menu'

// 3. 组合式函数调用
const userStore = useUserStore()

// 4. 响应式数据定义
const menuList = ref<MenuItem[]>([...])

// 5. 计算属性
const isActive = computed(() => (path: string) => { ... })

// 6. 方法定义
const handleClick = () => { ... }
</script>

<template>
  <!-- 使用 BEM 命名规范 -->
  <div class="sidebar-container">
    <nav class="sidebar-menu">
      <div class="menu-item menu-item--active">...</div>
    </nav>
  </div>
</template>

<style lang="scss" scoped>
// 使用 SCSS，scoped 样式
.sidebar-container {
  // ...
  .sidebar-menu {
    // ...
  }
}
</style>
```

### CSS 规范

- **预处理器**: 使用 SCSS
- **命名规范**: BEM (Block Element Modifier)
  - Block: `.sidebar-container`
  - Element: `.sidebar-menu`, `.menu-item`
  - Modifier: `.menu-item--active`
- **CSS 变量**: 定义在 `base.css`，按功能分类
- **暗黑主题**: 使用 `html.dark` 选择器覆盖变量

### TypeScript 规范

- 所有文件使用 `.ts` 扩展名
- Vue 组件使用 `lang="ts"`
- 类型定义优先使用 `type` 而非 `interface`（项目中混用）
- 路径别名 `@` 指向 `src` 目录

## 重要实现细节

### 1. Canvas 时钟 (Clock.vue)

- 使用 Canvas 2D API 绘制
- 支持高清屏适配（devicePixelRatio）
- 使用 `requestAnimationFrame` 实现流畅动画
- 组件卸载时清理动画和事件监听

### 2. 粒子背景 (Star.vue)

- 使用 tsParticles 库
- 仅在暗黑模式下显示（App.vue 中通过 `v-if="isDark"` 控制）
- 配置悬浮排斥效果（repulse）

### 3. 农历日历 (Plan.vue)

- 使用 `lunar-javascript` 库
- Element Plus Calendar 组件自定义日期单元格
- 显示农历日期、节气、节日

### 4. 侧边栏响应式

- 大屏 (256px): 显示图标 + 文字
- 中屏 (70px): 仅显示图标
- 小屏: 底部固定导航栏（`mini__footer__bar`）

## 配置说明

### Vite 配置 (vite.config.ts)

```typescript
export default defineConfig({
  server: { host: '0.0.0.0', port: 5173 },
  resolve: { alias: { '@': './src' } },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@use "@/styles/index.scss";'
      }
    }
  }
})
```

### TypeScript 配置

- `tsconfig.json`: 项目引用配置
- `tsconfig.app.json`: 应用代码配置，继承 `@vue/tsconfig/tsconfig.dom.json`
- `tsconfig.node.json`: 配置文件配置，继承 `@tsconfig/node24/tsconfig.json`

## 已知问题与注意事项

1. **登录功能**: 当前为模拟登录，仅设置 `loginState` 为 true，无后端验证
2. **用户头像**: 使用随机图片服务 `https://picsum.photos/200`
3. **API 层**: 项目中存在 `api/` 目录结构说明，但实际未实现后端接口调用

## 扩展建议

如需添加新页面：

1. 在 `src/views/` 创建页面组件
2. 在 `src/router/index.ts` 添加路由配置
3. 如需添加到侧边栏，在 `Sidebar.vue` 的 `menuList` 中添加菜单项
4. 如需要图标，在 `src/components/icons/` 创建 SVG 图标组件
