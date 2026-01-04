<script setup lang='ts'>
import Sidebar from '@/components/Sidebar.vue';
import MenuIcon from '@/components/icons/IconMenu.vue'
import CloseIcon from '@/components/icons/IconClose.vue'

</script>

<template>
    <div class="mask"></div>
    <div class="home-layout">
        <!-- <div class="min__menu">
            <MenuIcon class="icon" />
        </div> -->
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