<script setup lang='ts'>
import Sidebar from '@/components/Sidebar.vue';

</script>

<template>
    <div class="home-layout">
        <Sidebar />
        <div class="home-content">
            <div class="ad__bar" style="">留白</div>
            <el-scrollbar>
                <div class="real__content">
                    <router-view v-slot="{ Component }">
                        <transition name="fade" mode="out-in">
                            <!-- 只取/home后面的第一级路径,孙路由变化完全不影响 -->
                            <component :is="Component" :key="$route.matched[1]?.path || $route.path" />
                        </transition>
                    </router-view>
                </div>

            </el-scrollbar>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.fade-enter-from {
    opacity: 0;
    transform: translateY(20px);
}

.fade-enter-active {
    transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-leave-from {
    opacity: 1;
    transform: translateY(0);
}

.fade-leave-active {
    transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-leave-to {
    opacity: 0;
    transform: translateY(-20px);
}

/* ------------------ */
.home-layout {
    display: flex;
    height: 100vh;
    height: 100dvh;
}

.home-content {
    background: var(--home-content-bg-color);
    display: flex;
    justify-content: center;
    flex-direction: column;
    padding: .7rem 0;
    flex: 1;

    .real__content {
        margin: 0 3rem;
    }
}

/* ------------------ */
.ad__bar {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 64px;
    overflow: hidden;
}

@media (max-width: 576px) {
    .home-content {
        padding-bottom: var(--bottom-menu-height);

        .real__content {
            margin: 0 1.2rem;
        }
    }
}
</style>