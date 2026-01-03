<script setup lang="ts">
import { type Component, } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import HomeIcon from '@/components/icons/IconHome.vue';
import SearchIcon from '@/components/icons/IconSearch.vue';
import ChatIcon from '@/components/icons/IconChat.vue'
import NotificationIcon from '@/components/icons/IconNotification.vue'
import SettingIcon from '@/components/icons/IconSetting.vue'
import GiftIcon from '@/components/icons/IconGift.vue'
import CalendarIcon from './icons/IconCalendar.vue';

// 定义类型
interface MenuItem {
    path: string;
    name: string;
    label: string;
    icon: Component;
}

// 响应式变量
const router = useRouter();
const route = useRoute();

// 菜单数据
const menuList: MenuItem[] = [
    { path: '/home', name: 'Home', label: '首页', icon: HomeIcon },
    { path: '/home/chat', name: 'Browse', label: '浏览', icon: SearchIcon },
    { path: '', name: '', label: '计划', icon: CalendarIcon },
    { path: '/chat-room', name: 'ChatRoom', label: '聊天室', icon: ChatIcon },
    { path: '/notice', name: 'Notice', label: '通知', icon: NotificationIcon },
    { path: '/settings', name: 'Settings', label: '设置', icon: SettingIcon },
    { path: '/gift', name: 'Gift', label: '礼品', icon: GiftIcon },
];

// 判断路由激活
const isActive = (path: string): boolean => {
    return route.path === path;
};

</script>

<template>
    <!-- 侧边栏 -->
    <div class="sidebar-container collapsed">

        <div class="logo">
            <img src="@/assets/logo.svg" alt="">
        </div>

        <!-- 导航菜单列表 --> 
        <nav class="menu-list">
            <RouterLink v-for="item in menuList" :key="item.name" :to="item.path" class="menu-item"
                :class="{ 'active': isActive(item.path) }">
                <component :is="item.icon" class="menu-icon" />
                <span class="menu-label collapsed">
                    {{ item.label }}
                </span>
            </RouterLink>
        </nav>

        <!-- 底部会员信息 -->
        <div class="sidebar-footer">
            <img src="https://picsum.photos/200" alt="avatar" class="avatar" />
            <span class="footer-text collapsed">{{ 'Dssssss' }}</span>
        </div>
    </div>
</template>

<style scoped>
.logo{
    margin-top: .5rem;
    display: flex;
    justify-content: center;
    align-items: center;
}
.logo img{
    width: 25px; 
}
/* 侧边栏 */
.sidebar-container {
    height: 100vh;
    width: 256px;
    border-right: 1px solid #e5e7eb;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    position: relative;
}



/* 菜单列表 */
.menu-list {
    margin-top: .5rem;
    display: flex;
    flex-direction: column;
    flex: 1;
}

.menu-item {
    display: flex;
    align-items: center;
    gap: .9rem;
    padding: 1rem 1.5rem;
    color: var(--color-text);
    text-decoration: none;
}


.menu-item.active {
  background: #ee676e;
}


.menu-icon {
    width: 20px;
    flex-shrink: 0;
}

/* 侧边栏底部 */
.sidebar-footer {
    padding: 16px;
    border-top: 1px solid #e5e7eb;
    display: flex;
    align-items: center;
    gap: 12px;
}

.avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    flex-shrink: 0;
}
@media (max-width: 834px) {
    /* 折叠状态 */
    .sidebar-container.collapsed {
        width: 64px;
    }
    .menu-label.collapsed{
        display: none;
        pointer-events: none;
    }
    .sidebar-footer>.footer-text.collapsed{
        display: none;
        pointer-events: none;
    }
}
</style>