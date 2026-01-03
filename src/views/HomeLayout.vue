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
.home-layout{
    display: flex;
    height: 100vh;
}
.home-content{
    flex: 1;
}
</style>