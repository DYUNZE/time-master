<script setup lang="ts">
import { useGlobalTheme } from '@/composables/useGlobalTheme';
import type { MenuItem } from '@/types/menu';


const { toggleDark, isDark } = useGlobalTheme();

const menuList: Readonly<MenuItem[]> = [
  { path: '/home/setting/basic', name: 'Basic', label: '基本信息' },
  { path: '/home/plan', name: 'Plan', label: '账户' },
  { path: '/home/chat', name: 'ChatRoom', label: '偏好设置' },
  { path: '/home/game-factory', name: 'GameFactory', label: '邮箱通知' },
  { path: '/home/setting', name: 'Setting', label: '反馈' },
  { path: '/home/setting', name: 'Setting', label: '关于' },
];

</script>

<template>
  <div class="setting__box">
    <div class="setting_title">
      <h2>设置</h2>
    </div>
    <div class="setting__bar">
      <RouterLink v-for="item in menuList" :key="item.name" :to="item.path" class="menu-item">
        <span class="menu-item__label title">{{ item.label }}</span>
      </RouterLink>
    </div>
    <div class="view__box">
      <router-view></router-view>
    </div>
    <!-- <el-button @click="toggleDark()">
      {{ isDark ? '切换到亮色模式' : '切换到暗色模式' }}
    </el-button> -->
  </div>


</template>

<style lang="scss" scoped>
.setting__box {
  .view__box {
    margin-top: 1rem;
    border-radius: 1rch;
    ;
    border: 1px solid var(--color-text);
  }

  // display: flex;
  .setting_title {
    margin-bottom: 1.5rem;
  }

  .setting__bar {
    display: flex;
    gap: 2rem;

    .menu-item {
      cursor: pointer;
      position: relative;
      display: inline-block;

      &::after {
        content: "";
        position: absolute;
        left: 0;
        bottom: -4px;
        width: 100%;
        height: 1px;
        background-color: aliceblue;
        transform-origin: center;
        transition: transform 0.3s ease;
        transform: scaleX(0);
      }

      &:hover {
        color: #b1b1b1;

        &::after {
          transform: scaleX(1);
        }
      }

      &:active::after {
        transform: scaleX(1);
      }
    }
  }
}
</style>