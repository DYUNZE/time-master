<script setup lang='ts'>
import Sidebar from '@/components/Sidebar.vue';

</script>

<template>
    <div class="home-layout">
        <Sidebar />
        <div class="home-content">
            <div class="ad__bar" style="">留白</div>
            <el-scrollbar>
                <router-view v-slot="{ Component }">
                    <transition name="fade" mode="out-in">
                        <component :is="Component" :key="$route.fullPath" />
                    </transition>
                </router-view>
            </el-scrollbar>
        </div>
    </div>
</template>

<style scoped>

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
    padding: .7rem .7rem;
    flex: 1;
}
/* ------------------ */
.ad__bar{
    display: flex;
    justify-content: center;
    align-items: center;
    height: 64px;
    overflow: hidden;
}
@media (max-width: 576px) { 
    .home-content {
        padding-bottom: var(--bottom-menu-height);
    }
}


</style>