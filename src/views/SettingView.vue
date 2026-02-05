<script setup lang="ts">
import { useToggle,useDark } from '@vueuse/core'


const isDark = useDark({
  storageKey: 'theme',
  valueLight: 'light'
})
const toggleDark = useToggle(isDark)
</script>

<template>
  <el-button @click="toggleDark()">
    {{ isDark ? '切换到亮色模式' : '切换到暗色模式' }}
  </el-button>
</template>

<style scoped></style>