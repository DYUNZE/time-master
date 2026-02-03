<script setup lang='ts'>
import Sidebar from '@/components/Sidebar.vue';

</script>

<template>
    <div class="home-layout">
        <Sidebar />
        <div class="home-content">
            <router-view v-slot="{ Component }">
                <transition name="fade" mode="out-in">
                    <component :is="Component" :key="$route.fullPath" />
                </transition>
            </router-view>
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
    overflow: hidden;
}

.home-content {
    display: flex;
    justify-content: center;
    padding: 64px .7rem;
    flex: 1;
}

@media (max-width: 576px) {
    .home-layout {
        flex-direction: column;
    }
}
</style>