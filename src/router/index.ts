import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/useUserStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/login',
      name: 'Login',
      component: ()=> import('@/views/LoginView.vue'),
      meta:{
        requiresAuth: false,
        title:'登录',
  
      }
    },
    {
      path: '/home',
      component: () => import('@/views/HomeLayout.vue'),
      meta:{
        requiresAuth: true,
        title:'首页'
      },
      children:[
        {path:'',redirect:'/home/index'},
        {
          path: 'index',
          name: 'Index',
          component: () => import('@/views/HomeIndex.vue'),
        },
        {
          path: 'chat',
          name: 'Chat',
          component: () => import('@/views/AboutView.vue'),
          meta:{title:'聊天室'}
        },
        {
          path: 'plan',
          name: 'Plan',
          component: ()=> import('@/views/PlanView.vue'),
          meta:{title:'计划'}
        },
        {
          path: 'game-factory',
          name: 'GameFactory',
          component: ()=> import('@/views/GameFactoryView.vue'),
          meta:{title:'游戏工厂'}
        },
        {
          path: 'setting',
          component: ()=> import('@/views/SettingView.vue'),
          meta:{title:'设置'},
          children:[
            {
              path: '',
              redirect: '/home/setting/basic'
            },
            {
              path: 'basic',
              name: 'Basic',
              component: ()=> import('@/views/setting/Basic.vue'),
            }
          ]
        }
      ]
    },
    {
      path: '/:pathMatch(.*)',
      redirect: '/login'
    }
  ],
})

router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = (to.meta.title as string || '')+' | TimeMaster';

  // TODO 验证登录(使用pinia即可)
  const userStore = useUserStore()
  const isLoggedIn = userStore.getLoginState;
  // 需要登录但未登录 -> 登录页
  if (to.meta.requiresAuth && !isLoggedIn) {
    next('/login')
  } 
  // 已登录但访问登录页 -> 首页
  else if(to.path === '/login' && isLoggedIn) {
    next('/home')
  }
  // 其他 -> 正常跳转
  else{
    next()
  }
})

export default router
