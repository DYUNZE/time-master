<script setup lang="ts">
import { ref } from 'vue';
import { ElMessage } from 'element-plus';

// 版本信息
const version = ref('1.0.0');
const buildDate = ref('2026-04-05');

// 快捷键列表
const shortcuts = [
  { key: 'Ctrl + K', action: '打开搜索' },
  { key: 'Ctrl + /', action: '显示快捷键帮助' },
  { key: 'Esc', action: '关闭弹窗/返回' },
];

// 清除缓存
const clearCache = () => {
  localStorage.removeItem('user_preferences');
  localStorage.removeItem('email_settings');
  localStorage.removeItem('email_notifications');
  ElMessage.success('缓存已清除，部分设置已重置');
};

// 导出数据
const exportData = () => {
  const data = {
    preferences: localStorage.getItem('user_preferences'),
    email: localStorage.getItem('email_settings'),
    theme: localStorage.getItem('theme'),
    exportDate: new Date().toISOString(),
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `time-master-backup-${Date.now()}.json`;
  link.click();
  URL.revokeObjectURL(url);
  
  ElMessage.success('数据已导出');
};
</script>

<template>
  <div class="more__box">
    <!-- 关于应用 -->
    <section class="more__section">
      <h2 class="more__title">关于</h2>
      <p class="more__desc">TimeMaster - 个人时间管理应用</p>
      
      <div class="more__card">
        <div class="more__info-item">
          <span class="more__info-label">版本</span>
          <span class="more__info-value">{{ version }}</span>
        </div>
        <div class="more__info-item">
          <span class="more__info-label">构建日期</span>
          <span class="more__info-value">{{ buildDate }}</span>
        </div>
        <div class="more__info-item">
          <span class="more__info-label">开发者</span>
          <span class="more__info-value">Dyz</span>
        </div>
      </div>
    </section>

    <div class="more__divider" />

    <!-- 快捷键 -->
    <section class="more__section">
      <h2 class="more__title">快捷键</h2>
      <p class="more__desc">支持的键盘快捷键</p>
      
      <div class="more__shortcuts">
        <div
          v-for="item in shortcuts"
          :key="item.key"
          class="more__shortcut-item"
        >
          <span class="more__shortcut-key">{{ item.key }}</span>
          <span class="more__shortcut-action">{{ item.action }}</span>
        </div>
      </div>
    </section>

    <div class="more__divider" />

    <!-- 数据管理 -->
    <section class="more__section">
      <h2 class="more__title">数据管理</h2>
      <p class="more__desc">管理您的本地数据</p>
      
      <div class="more__actions">
        <div class="more__action-item">
          <div class="more__action-info">
            <h3 class="more__action-name">导出数据</h3>
            <p class="more__action-desc">将所有设置和偏好导出为 JSON 文件</p>
          </div>
          <button class="btn btn--secondary btn--small" @click="exportData">
            导出
          </button>
        </div>
        
        <div class="more__action-item">
          <div class="more__action-info">
            <h3 class="more__action-name">清除缓存</h3>
            <p class="more__action-desc">清除所有本地存储的设置和数据</p>
          </div>
          <button class="btn btn--danger btn--small" @click="clearCache">
            清除
          </button>
        </div>
      </div>
    </section>

    <div class="more__divider" />

    <!-- 开源协议 -->
    <section class="more__section">
      <h2 class="more__title">开源协议</h2>
      <p class="more__desc">本项目使用以下开源技术</p>
      
      <div class="more__licenses">
        <a
          href="https://vuejs.org/"
          target="_blank"
          rel="noopener"
          class="more__license-link"
        >
          Vue 3
        </a>
        <a
          href="https://element-plus.org/"
          target="_blank"
          rel="noopener"
          class="more__license-link"
        >
          Element Plus
        </a>
        <a
          href="https://pinia.vuejs.org/"
          target="_blank"
          rel="noopener"
          class="more__license-link"
        >
          Pinia
        </a>
        <a
          href="https://vueuse.org/"
          target="_blank"
          rel="noopener"
          class="more__license-link"
        >
          VueUse
        </a>
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.more__box {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.more__title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 0.5rem;
}

.more__desc {
  font-size: 0.875rem;
  color: var(--color-text);
  opacity: 0.7;
  margin-bottom: 1.25rem;
}

.more__card {
  background-color: var(--hover-btn-bg-color);
  border-radius: 12px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  html.dark & {
    background-color: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.06);
  }
}

.more__info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--setting-border-color);

  &:last-child {
    border-bottom: none;
  }

  html.dark & {
    border-color: rgba(255, 255, 255, 0.1);
  }
}

.more__info-label {
  font-size: 0.875rem;
  color: var(--color-text);
  opacity: 0.7;
}

.more__info-value {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text);
}

.more__shortcuts {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.more__shortcut-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.875rem 1rem;
  background-color: var(--hover-btn-bg-color);
  border-radius: 8px;

  html.dark & {
    background-color: rgba(255, 255, 255, 0.04);
  }
}

.more__shortcut-key {
  font-family: 'SF Mono', Monaco, monospace;
  font-size: 0.8rem;
  padding: 0.25rem 0.5rem;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  color: var(--color-text);

  html.dark & {
    background-color: rgba(255, 255, 255, 0.1);
  }
}

.more__shortcut-action {
  font-size: 0.875rem;
  color: var(--color-text);
}

.more__actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.more__action-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  background-color: var(--hover-btn-bg-color);
  border-radius: 10px;

  html.dark & {
    background-color: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.06);
  }
}

.more__action-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.more__action-name {
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--color-text);
}

.more__action-desc {
  font-size: 0.8rem;
  color: var(--color-text);
  opacity: 0.6;
}

.more__licenses {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.more__license-link {
  padding: 0.5rem 1rem;
  background-color: var(--hover-btn-bg-color);
  border-radius: 20px;
  font-size: 0.8rem;
  color: var(--color-text);
  text-decoration: none;
  transition: all 0.3s ease;

  &:hover {
    background-color: var(--active-btn-bg-color);
    transform: translateY(-2px);
  }

  html.dark & {
    background-color: rgba(255, 255, 255, 0.06);

    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
  }
}

.more__divider {
  height: 1px;
  background-color: var(--setting-border-color);
  margin: 0.5rem 0;
}

// 按钮样式
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  outline: none;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &--secondary {
    background-color: var(--hover-btn-bg-color);
    color: var(--color-text);
    border: 1px solid var(--setting-border-color);

    &:hover:not(:disabled) {
      border-color: #d4956a;
    }

    html.dark & {
      background: rgba(255, 255, 255, 0.06);
      border-color: rgba(255, 255, 255, 0.15);
      color: rgba(255, 255, 255, 0.9);

      &:hover:not(:disabled) {
        border-color: rgba(255, 255, 255, 0.3);
      }
    }
  }

  &--danger {
    background-color: transparent;
    color: #c98b8b;
    border: 1px solid #d4b8b8;

    &:hover:not(:disabled) {
      background-color: rgba(201, 139, 139, 0.1);
      border-color: #c98b8b;
    }

    html.dark & {
      color: #d4a0a0;
      border-color: rgba(212, 160, 160, 0.3);

      &:hover:not(:disabled) {
        background-color: rgba(212, 160, 160, 0.1);
      }
    }
  }

  &--small {
    padding: 0.5rem 1rem;
    font-size: 0.8rem;
  }
}

// 响应式
@media (max-width: 576px) {
  .more__box {
    padding: 1rem;
  }

  .more__action-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .more__action-item .btn {
    width: 100%;
  }

  .more__licenses {
    justify-content: center;
  }
}
</style>
