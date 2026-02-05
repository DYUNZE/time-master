<script setup lang="ts">
import { useGlobalTheme } from '@/composables/useGlobalTheme';


const {toggleDark,isDark} = useGlobalTheme();
</script>

<template>
  <el-button @click="toggleDark()">
    {{ isDark ? '切换到亮色模式' : '切换到暗色模式' }}
  </el-button>
</template>

<style scoped></style>