<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import HomeIcon from '@/components/icons/IconHome.vue';
import ChatIcon from '@/components/icons/IconChat.vue';
import SettingIcon from '@/components/icons/IconSetting.vue';
import CalendarIcon from '@/components/icons/IconCalendar.vue';
import LogoutIcon from '@/components/icons/IconLogout.vue';
import HammerIcon from '@/components/icons/IconHammer.vue';
import BookIcon from '@/components/icons/IconBook.vue';
import MoreIcon from '@/components/icons/IconMore.vue';
import CloseIcon from '@/components/icons/IconClose.vue';
import { useLogin } from '@/composables/useLogin';

import { type MenuItem } from '@/types/menu';

const route = useRoute();
const router = useRouter();
const { handleUserLogout } = useLogin();

// 遮罩显示状态
const showMoreMenu = ref(false);

// 菜单数据
const menuList: Readonly<MenuItem[]> = [
    { path: '/home/index', name: 'Index', label: '首页', icon: HomeIcon },
    { path: '/home/plan', name: 'Plan', label: '计划', icon: CalendarIcon },
    { path: '/home/chat', name: 'ChatRoom', label: '聊天室', icon: ChatIcon },
    { path: '/home/library', name: 'Library', label: '图书馆', icon: BookIcon },
    { path: '/home/game-factory', name: 'GameFactory', label: '游戏工厂', icon: HammerIcon },
    { path: '/home/setting', name: 'Setting', label: '设置', icon: SettingIcon },
];

// 激活判断
const isActive = computed(() => (path: string) => {
    const isExactMatch = route.path === path;
    const isParentMatch = path !== '/' && route.path.startsWith(`${path}/`);
    return isExactMatch || isParentMatch;
});

// 拆分菜单
const showMenuList = computed(() => {
    return menuList.slice(0, 4)
})
const foldMenuList = computed(() => {
    return menuList.slice(4)
})

// 打开更多菜单
const openMoreMenu = () => {
    showMoreMenu.value = true;
    document.body.style.overflow = 'hidden';
}

// 关闭更多菜单
const closeMoreMenu = () => {
    showMoreMenu.value = false;
    document.body.style.overflow = '';
}

// 点击菜单项
const handleMenuClick = (path: string) => {
    closeMoreMenu();
    router.push(path);
}
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
        <RouterLink v-for="item in showMenuList" :key="item.name" :to="item.path" class="menu-item" :class="{
            'menu-item--active': isActive(item.path)
        }">
            <component :is="item.icon" class="icon" :aria-label="`${item.label}图标`" />
        </RouterLink>
        <template v-if="foldMenuList.length > 0">
            <div class="menu-item" :class="{ 'menu-item--active': showMoreMenu }" @click="openMoreMenu">
                <MoreIcon class="icon" />
            </div>
        </template>
    </div>

    <!-- 全局遮罩菜单 -->
    <Teleport to="body">
        <Transition name="overlay">
            <div v-if="showMoreMenu" class="mobile-menu-overlay" @click.self="closeMoreMenu">
                <div class="mobile-menu-panel">
                    <div class="mobile-menu-header">
                        <h3 class="mobile-menu-title">更多功能</h3>
                        <button class="mobile-menu-close" @click="closeMoreMenu">
                            <CloseIcon class="icon" />
                        </button>
                    </div>
                    <nav class="mobile-menu-list">
                        <div
                            v-for="item in foldMenuList"
                            :key="item.name"
                            class="mobile-menu-item"
                            :class="{ 'mobile-menu-item--active': isActive(item.path) }"
                            @click="handleMenuClick(item.path)"
                        >
                            <div class="mobile-menu-icon">
                                <component :is="item.icon" class="icon" />
                            </div>
                            <span class="mobile-menu-label">{{ item.label }}</span>
                            <div class="mobile-menu-arrow">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="9,18 15,12 9,6" />
                                </svg>
                            </div>
                        </div>
                    </nav>
                    <div class="mobile-menu-footer">
                        <button class="mobile-logout-btn" @click="handleUserLogout">
                            <LogoutIcon class="icon" />
                            <span>退出登录</span>
                        </button>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>

</template>

<style lang="scss" scoped>
@mixin menu-item-style {
    display: flex;
    align-items: center;
    gap: 0.9rem;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    cursor: pointer;

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

/* ===========================移动端更多菜单遮罩====================================== */
.mobile-menu-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    z-index: 9999;
    display: flex;
    align-items: flex-end;
    justify-content: center;

    html.dark & {
        background: rgba(0, 0, 0, 0.7);
    }
}

.mobile-menu-panel {
    width: 100%;
    max-width: 500px;
    background: var(--color-background);
    border-radius: 20px 20px 0 0;
    padding: 1.25rem;
    box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.15);
    animation: slideUp 0.3s ease-out;

    html.dark & {
        background: #1a1a1a;
        box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.4);
    }
}

@keyframes slideUp {
    from {
        transform: translateY(100%);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}

.mobile-menu-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid var(--setting-border-color);

    html.dark & {
        border-color: rgba(255, 255, 255, 0.1);
    }
}

.mobile-menu-title {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--color-text);
    margin: 0;
}

.mobile-menu-close {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: none;
    background: var(--hover-btn-bg-color);
    color: var(--color-text);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;

    .icon {
        width: 18px;
        height: 18px;
    }

    &:active {
        transform: scale(0.95);
    }

    html.dark & {
        background: rgba(255, 255, 255, 0.1);
    }
}

.mobile-menu-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 1rem;
}

.mobile-menu-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    background: transparent;

    &:active {
        transform: scale(0.98);
    }

    &--active {
        background: var(--active-btn-bg-color);
        color: var(--active-btn-text-color);
    }

    &:not(&--active):hover {
        background: var(--hover-btn-bg-color);
    }
}

.mobile-menu-icon {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: linear-gradient(135deg, #e8a87c 0%, #d4956a 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    flex-shrink: 0;

    .icon {
        width: 20px;
        height: 20px;
    }

    html.dark & {
        background: rgba(255, 255, 255, 0.1);
    }
}

.mobile-menu-label {
    flex: 1;
    font-size: 1rem;
    font-weight: 500;
    color: var(--color-text);
}

.mobile-menu-arrow {
    width: 20px;
    height: 20px;
    color: var(--color-text);
    opacity: 0.4;
}

.mobile-menu-footer {
    padding-top: 0.75rem;
    border-top: 1px solid var(--setting-border-color);

    html.dark & {
        border-color: rgba(255, 255, 255, 0.1);
    }
}

.mobile-logout-btn {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.875rem;
    border-radius: 10px;
    border: 1px solid #d4b8b8;
    background: transparent;
    color: #c98b8b;
    font-size: 0.95rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;

    .icon {
        width: 18px;
        height: 18px;
    }

    &:active {
        transform: scale(0.98);
    }

    html.dark & {
        border-color: rgba(212, 160, 160, 0.3);
        color: #d4a0a0;
    }
}

/* 遮罩过渡动画 */
.overlay-enter-active,
.overlay-leave-active {
    transition: opacity 0.3s ease;
}

.overlay-enter-from,
.overlay-leave-to {
    opacity: 0;
}

.overlay-enter-active .mobile-menu-panel,
.overlay-leave-active .mobile-menu-panel {
    transition: transform 0.3s ease;
}

.overlay-enter-from .mobile-menu-panel,
.overlay-leave-to .mobile-menu-panel {
    transform: translateY(100%);
}
</style>