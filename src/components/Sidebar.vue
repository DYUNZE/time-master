<script setup lang="ts">
import {computed,ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import HomeIcon from '@/components/icons/IconHome.vue';
import SearchIcon from '@/components/icons/IconSearch.vue';
import ChatIcon from '@/components/icons/IconChat.vue';
import NotificationIcon from '@/components/icons/IconNotification.vue';
import SettingIcon from '@/components/icons/IconSetting.vue';
import GiftIcon from '@/components/icons/IconGift.vue';
import CalendarIcon from '@/components/icons/IconCalendar.vue';
import CloseIcon from '@/components/icons/IconClose.vue';
import MenuIcon from '@/components/icons/IconMenu.vue';
import LogoutIcon from '@/components/icons/IconLogout.vue';
import { useMediaQuery } from '@vueuse/core';
import { useLogin } from '@/composables/useLogin';

import {type MenuItem} from '@/types/menu';

const route = useRoute();
const {handleUserLogout} = useLogin();

// 菜单数据
const menuList: Readonly<MenuItem[]> = [
    { path: '/home', name: 'Home', label: '首页', icon: HomeIcon },
    { path: '/home/chat', name: 'Browse', label: '浏览', icon: SearchIcon },
    { path: '/home/plan', name: 'Plan', label: '计划', icon: CalendarIcon },
    { path: '', name: 'ChatRoom', label: '聊天室', icon: ChatIcon },
    { path: '', name: 'Notice', label: '通知', icon: NotificationIcon },
    { path: '', name: 'Settings', label: '设置', icon: SettingIcon },
    { path: '', name: 'Gift', label: '礼品', icon: GiftIcon },
];

// 激活判断
const isActive = computed(() => (path: string) => {
    return route.path === path;
});


// 移动端菜单状态管理
const isMobileMenuOpen = ref(false);

const maskEl = ref();

const isMobile = useMediaQuery('(max-width: 576px)');
// 打开折叠菜单
const openMenu = () => {
    document.body.style.overflow = 'hidden ';
    isMobileMenuOpen.value = true;
};
// 关闭折叠菜单
const closeMenu = () => {
    isMobileMenuOpen.value = false;
    document.body.style.overflow = ''; 
};

// 监听路由变化和媒体变化,自动关闭移动端菜单
watch([() => route.path,isMobile], () => {
    if (isMobileMenuOpen.value) closeMenu();
});

</script>

<template>

    <div class="min__menu">
        <MenuIcon class="min__menu__icon" @click="openMenu" aria-label="打开导航菜单" />
    </div>

    <!-- 针对于小屏的折叠菜单 -->
    <!-- 后期看情况优化 -->
    <div ref="maskEl" class="mask" :class="{ 'open': isMobileMenuOpen }">
       <CloseIcon class="close__icon" @click="closeMenu" aria-label="关闭导航菜单" />
       <div class="mask__nav">
        <RouterLink v-for="item in menuList" :key="item.name" :to="item.path" class="mask__nav__item" :class="{
                'menu-item--active': isActive(item.path)
            }">
                <!-- 图标：添加aria-label提升可访问性 -->
                <component :is="item.icon" class="icon" :aria-label="`${item.label}图标`" />
                <!-- 文字：优化class命名，语义更清晰 -->
                <span class="title">{{ item.label }}</span>
        </RouterLink>
       </div>
       <div class="mask__footer">
            <img src="https://picsum.photos/200" alt="用户头像" class="footer-avatar" loading="lazy" />
            <span class="title">David</span>
            <LogoutIcon class="logout icon" @click="handleUserLogout"/>
       </div>
    </div>

    <!-- 侧边导航栏 -->
    <div class="sidebar-container">
        <!-- 导航菜单 -->
        <nav class="sidebar-menu">
            <RouterLink v-for="item in menuList" :key="item.name" :to="item.path" class="menu-item" :class="{
                'menu-item--active': isActive(item.path)
            }">
                <!-- 图标：添加aria-label提升可访问性 -->
                <component :is="item.icon" class="icon" :aria-label="`${item.label}图标`" />
                <!-- 文字：优化class命名，语义更清晰 -->
                <span class="menu-item__label title">{{ item.label }}</span>
            </RouterLink>
        </nav>

        <!-- 底部会员信息：优化class命名，添加语义 -->
        <div class="sidebar-footer">
            <div class="user-info">
                <img src="https://picsum.photos/200" alt="用户头像" class="footer-avatar" loading="lazy" />
                <span class="footer-username title">David</span>
            </div>
            <LogoutIcon class="logout icon" @click="handleUserLogout"/>
        </div>
    </div>
</template>

<style scoped>
.min__menu{
    padding: 1rem 0 0 1rem;
    display: none;
}
.min__menu__icon{
    width: calc(var(--icon-size) + .7rem);
    cursor: pointer;
}

/* 遮罩全屏导航菜单 */
.mask{
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    position: fixed;
    width: 100vw;
    height: 100vh;
    transform: translateY(-100%);
    background: var(--color-background);
    /* display: none; */
    transition: transform .2s ease;
}
.mask.open{
    /* display: flex; */
    transform: translateY(0);
}
.mask__nav{
    margin-top: 7rem;
    /* display: flex; */
    /* flex-direction: column; */
    flex: 1;
    letter-spacing: .2rem;
}
.close__icon{
    position: absolute;
    top: 1rem;
    right: 1rem;
    cursor: pointer;
    width: calc(var(--icon-size) + .7rem);
    border-radius: 50%;
}
.close__icon:hover{
    background-color: var(--hover-btn-bg-color);
}
.mask__nav__item{
    display: flex;
    gap: 2rem;
    padding: 1rem 8rem;
    text-decoration: none;
    border-radius: 8px;
    color: var(--color-text);
}


.mask__nav__item:not(.menu-item--active):hover{
    background-color: var(--hover-btn-bg-color);
}
.mask__footer{
    padding: 16px;
    border-top: 1px solid var(--border-color);
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 64px;
}
.mask__footer .logout{
    width: calc(var(--icon-size) + .7rem);
}


.mask__nav__item span,
.mask__footer span{
    font-size: 1.2rem;
}

.mask__nav__item .icon{
    width: calc(var(--icon-size) + .2rem);
}

.mask__footer .footer-avatar{
    width: 50px;
    height: 50px;
    box-shadow: 1px 1px 10px 1px rgba(0, 0, 0, 0.1);
}


/* ============================================================ */

/* 侧边栏容器：优化布局，添加过渡动画 */
.sidebar-container {
    height: 100vh;
    width: 256px;
    box-shadow: 10px 0 10px -8px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    position: relative;
    transition: width 0.3s ease-in-out;
}

/* 菜单列表：优化弹性布局，占满剩余空间 */
.sidebar-menu {
    margin-top: 2rem;
    display: flex;
    flex-direction: column;
    flex: 1;
    gap: 2px;
    /* 菜单项之间添加小间距，视觉更清晰 */
}

/* 菜单项：优化样式、交互、禁用态 */
.menu-item {
    display: flex;
    align-items: center;
    gap: 0.9rem;
    padding: 1rem 1.5rem;
    text-decoration: none;
    border-radius: 8px;
    color: var(--color-text);
}

/* 激活态：优化样式，添加hover反馈 */
.menu-item--active {
    color: var(--active-btn-text-color);
    background: var(--active-btn-bg-color);
}


/* 正常态hover：提升交互体验 */
.menu-item:not(.menu-item--active):hover {
    background-color: var(--hover-btn-bg-color);
}

/* ===========================底部样式====================================== */


.sidebar-footer{
    padding: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

/* 侧边栏底部：优化样式 */
.sidebar-footer .user-info {
    border-top: 1px solid var(--border-color);
    display: flex;
    align-items: center;
    gap: 12px;
}
.logout{
    cursor: pointer;
}

.footer-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    flex-shrink: 0;
    object-fit: cover;
    /* 头像裁剪，防止拉伸 */
}

@media (max-width: 834px) {
    .sidebar-container {
        width: 64px;
    }

    .menu-item__label,
    .footer-username {
        display: none;
    }

    .sidebar-footer {
        flex-direction: column;
        gap: 1.2rem;
    }

    /* 折叠时菜单项内间距优化 */
    .menu-item {
        padding: 1rem;
    }
}

@media (max-width: 576px) {
    .sidebar-container{
        display: none;
    }
    
    .min__menu{
        display: block;
    }
}

</style>