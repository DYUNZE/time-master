<script setup lang='ts'>
import Sidebar from '@/components/Sidebar.vue';

</script>

<template>
    <div class="home-layout">
        <Sidebar />
        <div class="home-content">
            <RouterView />
        </div>
    </div>
</template>

<style scoped>
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
    .home-layout{
        flex-direction: column;
    }
}
</style>