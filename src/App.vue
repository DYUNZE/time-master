<script setup lang="ts">
import Star from './components/effects/Star.vue';
import { useGlobalTheme } from './composables/useGlobalTheme';

const {isDark} = useGlobalTheme();
</script>

<template>
    <Star v-if="isDark"/>
    <router-view />
   
</template>

<style scoped>


</style>
