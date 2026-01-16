src/
├── api/                # 接口请求层：所有后端接口统一管理
│   ├── user/           # 按业务模块拆分（用户相关）
│   │   ├── index.ts    # 导出用户相关接口（登录、获取信息）
│   │   └── type.ts     # 用户接口的 TS 类型定义
│   ├── order/          # 订单相关接口
│   ├── common.ts       # 通用请求配置（拦截器、axios 实例）
│   └── index.ts        # 统一导出所有接口（可选）
├── assets/             # 静态资源：图片、样式、字体等
│   ├── images/         # 图片资源（svg/png/jpg）
│   ├── styles/         # 全局样式（重置样式、变量、通用类）
│   │   ├── reset.scss  # 重置样式
│   │   ├── variables.scss # 全局变量（颜色、字体、尺寸）
│   │   └── common.scss # 通用样式类（居中、清除浮动等）
│   └── icons/          # 图标资源（svg 图标、字体图标）
├── components/         # 通用组件：全局复用的 UI 组件
│   ├── common/         # 基础组件（按钮、输入框、弹窗等）
│   │   ├── Button.vue
│   │   └── Input.vue
│   ├── business/       # 业务组件（和业务强相关，如登录表单、订单列表）
│   │   ├── LoginForm.vue
│   │   └── OrderTable.vue
│   └── icons/          # 图标组件（如 IconLogout.vue、IconUser.vue）
├── composables/        # Hooks 目录（Vue3 官方推荐命名，也可叫 hooks/）
│   ├── useLogin.ts     # 登录相关 Hooks（交互逻辑、加载状态）
│   ├── useRequest.ts   # 通用请求 Hooks（封装 axios 加载/错误处理）
│   ├── useForm.ts      # 表单相关 Hooks（校验、重置）
│   └── user/           # 复杂业务可按模块拆分（可选）
│       └── useUserInfo.ts
├── directives/         # 自定义指令：全局指令（如权限指令 v-auth）
│   ├── auth.ts         # 权限控制指令
│   └── index.ts        # 注册所有自定义指令
├── enums/              # 枚举常量：全局枚举（如登录状态、订单类型）
│   ├── userEnum.ts     # 用户相关枚举（登录状态、角色类型）
│   └── orderEnum.ts    # 订单相关枚举
├── hooks/              # 兼容命名：如果习惯用 hooks/ 而非 composables/（二选一）
├── router/             # 路由配置：路由规则、守卫、路由类型
│   ├── index.ts        # 路由实例、路由规则
│   ├── guard.ts        # 路由守卫（登录守卫、权限守卫）
│   └── type.ts         # 路由相关 TS 类型
├── stores/             # Pinia 状态仓库：全局状态管理
│   ├── user/           # 按业务模块拆分（用户模块）
│   │   ├── useUserStore.ts # 用户状态（登录状态、用户名）
│   │   └── type.ts     # 用户仓库的 TS 类型
│   ├── app/            # 全局配置模块（主题、语言、布局）
│   │   └── useAppStore.ts
│   └── index.ts        # 统一导出所有仓库（方便组件导入）
├── types/              # 全局类型定义：所有通用 TS 接口/类型
│   ├── user.ts         # 用户相关类型（UserInfo、LoginParams）
│   ├── api.ts          # 接口响应通用类型（BaseResponse）
│   └── global.ts       # 全局类型（如 Props 通用类型）
├── utils/              # 工具函数：通用工具（时间、加密、格式化）
│   ├── date.ts         # 时间格式化工具
│   ├── auth.ts         # 权限/Token 工具（存 localStorage）
│   └── common.ts       # 通用工具（深拷贝、防抖节流）
├── views/              # 页面视图：和路由一一对应
│   ├── login/          # 登录页面
│   │   ├── index.vue   # 登录页面组件
│   │   └── login.scss  # 页面专属样式（可选）
│   ├── home/           # 首页
│   ├── user/           # 用户相关页面（个人中心、用户列表）
│   └── layout/         # 布局页面（通用布局、侧边栏、头部）
│       ├── index.vue   # 布局入口
│       ├── Sidebar.vue
│       └── Header.vue
├── App.vue             # 根组件
├── main.ts             # 入口文件（创建实例、注册插件）
└── vite-env.d.ts       # Vite 类型声明（TS 项目必备）