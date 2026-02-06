<script setup lang="ts">
import type { MenuItem } from '@/types/menu';
import { useRoute } from 'vue-router';

const menuList: Readonly<MenuItem[]> = [
  { path: '/home/setting/basic', name: 'Basic', label: '基本信息' },
  { path: '/home/setting/account', name: 'Account', label: '账户' },
  { path: '/home/setting/prefer', name: 'Prefer', label: '偏好设置' },
  { path: '/home/game-factory', name: 'GameFactory', label: '邮箱通知' },
  { path: '/home/setting', name: 'Setting', label: '更多' },
];

const route = useRoute();
const isActive = (path: string) => {
  return path === route.path;
};
</script>

<template>
  <div class="setting__container">
    <div class="setting__box">
      <div class="setting_title">
        <h1>设置</h1>
      </div>
      <div class="setting__bar">
        <RouterLink v-for="item in menuList" :key="item.name" :to="item.path" class="menu-item" :class="{
            'menu-item--active': isActive(item.path)
        }">
          <span>{{ item.label }}</span>
        </RouterLink>
      </div>
      <div class="view__box">
        <router-view></router-view>
      </div>
    </div>
  </div>



</template>

<style lang="scss" scoped>
.setting__container{
  display: flex;
  justify-content: center;
}
.setting__box {
  max-width: 834px;
  width: 100%;
  .view__box {
    margin-top: 1rem;
    border-radius: 1rch;
    border: 1px solid var(--setting-border-color);
  }

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
      &--active::after {
        transform: scaleX(1);
      }
    }
  }
}

@media (max-width: 576px) {
  .setting__box {
    .setting__bar {
      gap: .8rem;

      .menu-item {
        font-size: .95rem;
      }
    }
  }
}
</style>