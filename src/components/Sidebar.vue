<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import HomeIcon from '@/components/icons/IconHome.vue';
import ChatIcon from '@/components/icons/IconChat.vue';
import SettingIcon from '@/components/icons/IconSetting.vue';
import CalendarIcon from '@/components/icons/IconCalendar.vue';
import LogoutIcon from '@/components/icons/IconLogout.vue';
import HammerIcon from '@/components/icons/IconHammer.vue';
import { useLogin } from '@/composables/useLogin';

import { type MenuItem } from '@/types/menu';

const route = useRoute();
const { handleUserLogout } = useLogin();

// 菜单数据
const menuList: Readonly<MenuItem[]> = [
    { path: '/home/index', name: 'Index', label: '首页', icon: HomeIcon },
    { path: '/home/plan', name: 'Plan', label: '计划', icon: CalendarIcon },
    { path: '/home/chat', name: 'ChatRoom', label: '聊天室', icon: ChatIcon },
    { path: '/home/game-factory', name: 'GameFactory', label: '游戏工厂', icon: HammerIcon },
    { path: '/home/setting', name: 'Setting', label: '设置', icon: SettingIcon },
];

// 激活判断
const isActive = computed(() => (path: string) => {
    const isExactMatch = route.path === path;
    const isParentMatch = path !== '/' && route.path.startsWith(`${path}/`);
    return isExactMatch || isParentMatch;
});

</script>

<template>
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
            <LogoutIcon class="logout icon" @click="handleUserLogout" />
        </div>
    </div>
    <div class="mini__footer__bar">
        <RouterLink v-for="item in menuList" :key="item.name" :to="item.path" class="menu-item" :class="{
            'menu-item--active': isActive(item.path)
        }">
            <component :is="item.icon" class="icon" :aria-label="`${item.label}图标`" />
        </RouterLink>
    </div>

</template>

<style lang="scss" scoped>
@mixin menu-item-style {
    display: flex;
    align-items: center;
    gap: 0.9rem;
    padding: 1rem 1.5rem;
    border-radius: 8px;

    &--active {
        color: var(--active-btn-text-color);
        background: var(--active-btn-bg-color);
    }

    &:not(.menu-item--active):hover {
        background-color: var(--hover-btn-bg-color);
    }
}

.mini__footer__bar {
    box-shadow: 0 0px 10px 3px var(--border-top-color);
    display: none;
    z-index: var(--top-z-index);
    position: fixed;
    bottom: 0;
    height: var(--bottom-menu-height);
    width: 100%;
    background: var(--color-background);
    justify-content: space-around;

    .menu-item {
        @include menu-item-style;
    }
}


/* ============================================================ */

/* 侧边栏容器：优化布局，添加过渡动画 */
.sidebar-container {
    height: 100vh;
    height: 100dvh;
    width: 256px;
    box-shadow: 10px 0 7px -8px var(--border-top-color);
    display: flex;
    flex-direction: column;
    position: relative;
    transition: width 0.3s ease-in-out;

    /* 菜单列表：优化弹性布局，占满剩余空间 */
    .sidebar-menu {
        margin-top: 2rem;
        display: flex;
        flex-direction: column;
        flex: 1;
        gap: 2px;

        /* 菜单项之间添加小间距，视觉更清晰 */
        /* 菜单项：优化样式、交互、禁用态 */
        .menu-item {
            @include menu-item-style;
        }

    }

    .sidebar-footer {
        padding: 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .user-info {
            border-top: 1px solid var(--border-color);
            display: flex;
            align-items: center;
            gap: 12px;

            .footer-avatar {
                width: 32px;
                height: 32px;
                border-radius: 50%;
                flex-shrink: 0;
                object-fit: cover;
            }
        }
    }

    .logout {
        cursor: pointer;
    }

}

/* ===========================底部样式====================================== */
@media (max-width: 834px) {
    .sidebar-container {
        width: 70px;
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
    .sidebar-container {
        display: none;
    }

    .mini__footer__bar {
        display: flex;
    }
}
</style>