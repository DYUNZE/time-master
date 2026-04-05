<script setup lang="ts">
import { reactive, watch } from 'vue';
import { useGlobalTheme } from '@/composables/useGlobalTheme';
import { usePreferenceStore, type FontSize } from '@/stores/usePreferenceStore';
import { ElMessage } from 'element-plus';

const { toggleDark, isDark } = useGlobalTheme();
const preferenceStore = usePreferenceStore();

// 本地状态与 store 同步
const preferences = reactive({
  theme: isDark.value ? 'dark' : 'light',
  fontSize: preferenceStore.fontSize,
  compactMode: preferenceStore.compactMode,
  soundEffects: preferenceStore.soundEffects,
  autoSave: preferenceStore.autoSave,
  desktopNotification: preferenceStore.desktopNotification,
  weeklyReport: preferenceStore.weeklyReport,
  updateReminder: preferenceStore.updateReminder,
});

// 字体大小选项
const fontSizeOptions: { label: string; value: FontSize }[] = [
  { label: '小', value: 'small' },
  { label: '中', value: 'medium' },
  { label: '大', value: 'large' },
];

// 同步到 store
watch(() => preferences.fontSize, (val) => {
  preferenceStore.fontSize = val;
  preferenceStore.applyFontSize();
});

watch(() => preferences.compactMode, (val) => {
  preferenceStore.compactMode = val;
  preferenceStore.applyCompactMode();
});

watch(() => preferences.soundEffects, (val) => {
  preferenceStore.soundEffects = val;
});

watch(() => preferences.autoSave, (val) => {
  preferenceStore.autoSave = val;
});

watch(() => preferences.desktopNotification, (val) => {
  preferenceStore.desktopNotification = val;
});

watch(() => preferences.weeklyReport, (val) => {
  preferenceStore.weeklyReport = val;
});

watch(() => preferences.updateReminder, (val) => {
  preferenceStore.updateReminder = val;
});

// 主题切换
const handleThemeChange = async (event: MouseEvent) => {
  const target = event.currentTarget as HTMLElement;
  const rect = target.getBoundingClientRect();
  
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;
  
  const doc = document as any;
  if (doc.startViewTransition) {
    const transition = doc.startViewTransition(() => {
      toggleDark();
      preferences.theme = isDark.value ? 'dark' : 'light';
    });
    
    await transition.ready;
    
    const maxRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );
    
    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${maxRadius}px at ${x}px ${y}px)`
        ]
      },
      {
        duration: 600,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        pseudoElement: '::view-transition-new(root)'
      }
    );
  } else {
    const body = document.body;
    body.style.opacity = '0';
    body.style.transform = 'scale(0.98)';
    body.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    
    setTimeout(() => {
      toggleDark();
      preferences.theme = isDark.value ? 'dark' : 'light';
      body.style.opacity = '1';
      body.style.transform = 'scale(1)';
      
      setTimeout(() => {
        body.style.transition = '';
        body.style.transform = '';
      }, 300);
    }, 300);
  }
};

const handleSave = () => {
  preferenceStore.savePreferences();
  ElMessage.success('偏好设置已保存');
};

const handleReset = () => {
  preferenceStore.resetPreferences();
  
  // 同步本地状态
  preferences.fontSize = preferenceStore.fontSize;
  preferences.compactMode = preferenceStore.compactMode;
  preferences.soundEffects = preferenceStore.soundEffects;
  preferences.autoSave = preferenceStore.autoSave;
  preferences.desktopNotification = preferenceStore.desktopNotification;
  preferences.weeklyReport = preferenceStore.weeklyReport;
  preferences.updateReminder = preferenceStore.updateReminder;
  
  // 应用更改
  preferenceStore.applyFontSize();
  preferenceStore.applyCompactMode();
  
  ElMessage.success('已恢复默认设置');
};
</script>

<template>
  <div class="prefer__box">
    <!-- 外观设置 -->
    <section class="prefer__section">
      <h2 class="prefer__title">外观</h2>
      <p class="prefer__desc">自定义界面显示效果</p>
      
      <div class="prefer__list">
        <!-- 主题切换 -->
        <div class="prefer__item">
          <div class="prefer__info">
            <h3 class="prefer__name">主题</h3>
            <p class="prefer__detail">切换亮色或暗黑模式</p>
          </div>
          <button 
            class="btn btn--secondary btn--small"
            @click="handleThemeChange($event)"
          >
            <span class="btn__icon">
              <svg v-if="!isDark" class="icon icon--sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
              <svg v-else class="icon icon--moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            </span>
            <span>{{ isDark ? '暗黑模式' : '亮色模式' }}</span>
          </button>
        </div>

        <!-- 字体大小 -->
        <div class="prefer__item">
          <div class="prefer__info">
            <h3 class="prefer__name">字体大小</h3>
            <p class="prefer__detail">调整界面文字大小</p>
          </div>
          <div class="prefer__control">
            <button
              v-for="size in fontSizeOptions"
              :key="size.value"
              class="btn btn--option"
              :class="{ 'btn--option--active': preferences.fontSize === size.value }"
              @click="preferences.fontSize = size.value"
            >
              {{ size.label }}
            </button>
          </div>
        </div>

        <!-- 紧凑模式 -->
        <div class="prefer__item">
          <div class="prefer__info">
            <h3 class="prefer__name">紧凑模式</h3>
            <p class="prefer__detail">减小间距，显示更多内容</p>
          </div>
          <el-switch
            v-model="preferences.compactMode"
            :active-color="isDark ? 'rgba(255,255,255,0.3)' : '#d4956a'"
          />
        </div>
      </div>
    </section>

    <div class="prefer__divider" />

    <!-- 功能设置 -->
    <section class="prefer__section">
      <h2 class="prefer__title">功能</h2>
      <p class="prefer__desc">配置应用功能行为</p>
      
      <div class="prefer__list">
        <div class="prefer__item">
          <div class="prefer__info">
            <h3 class="prefer__name">提示音效</h3>
            <p class="prefer__detail">操作反馈时播放声音</p>
          </div>
          <el-switch
            v-model="preferences.soundEffects"
            :active-color="isDark ? 'rgba(255,255,255,0.3)' : '#d4956a'"
          />
        </div>

        <div class="prefer__item">
          <div class="prefer__info">
            <h3 class="prefer__name">自动保存</h3>
            <p class="prefer__detail">定时自动保存编辑内容</p>
          </div>
          <el-switch
            v-model="preferences.autoSave"
            :active-color="isDark ? 'rgba(255,255,255,0.3)' : '#d4956a'"
          />
        </div>
      </div>
    </section>

    <div class="prefer__divider" />

    <!-- 通知设置 -->
    <section class="prefer__section">
      <h2 class="prefer__title">通知</h2>
      <p class="prefer__desc">管理消息通知方式</p>
      
      <div class="prefer__list">
        <div class="prefer__item">
          <div class="prefer__info">
            <h3 class="prefer__name">桌面通知</h3>
            <p class="prefer__detail">接收系统桌面弹窗提醒</p>
          </div>
          <el-switch
            v-model="preferences.desktopNotification"
            :active-color="isDark ? 'rgba(255,255,255,0.3)' : '#d4956a'"
          />
        </div>

        <div class="prefer__item">
          <div class="prefer__info">
            <h3 class="prefer__name">每周报告</h3>
            <p class="prefer__detail">每周一发送上周总结</p>
          </div>
          <el-switch
            v-model="preferences.weeklyReport"
            :active-color="isDark ? 'rgba(255,255,255,0.3)' : '#d4956a'"
          />
        </div>

        <div class="prefer__item">
          <div class="prefer__info">
            <h3 class="prefer__name">更新提醒</h3>
            <p class="prefer__detail">有新版本时通知我</p>
          </div>
          <el-switch
            v-model="preferences.updateReminder"
            :active-color="isDark ? 'rgba(255,255,255,0.3)' : '#d4956a'"
          />
        </div>
      </div>
    </section>

    <div class="prefer__divider" />

    <!-- 操作按钮 -->
    <section class="prefer__actions">
      <button class="btn btn--primary" @click="handleSave">
        保存设置
      </button>
      <button class="btn btn--ghost" @click="handleReset">
        恢复默认
      </button>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.prefer__box {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.prefer__title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 0.5rem;
}

.prefer__desc {
  font-size: 0.875rem;
  color: var(--color-text);
  opacity: 0.7;
  margin-bottom: 1.25rem;
}

.prefer__list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.prefer__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  background-color: var(--hover-btn-bg-color);
  border-radius: 10px;
  transition: all 0.3s ease;

  html.dark & {
    background-color: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.06);

    &:hover {
      background-color: rgba(255, 255, 255, 0.06);
    }
  }
}

.prefer__info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.prefer__name {
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--color-text);
}

.prefer__detail {
  font-size: 0.8rem;
  color: var(--color-text);
  opacity: 0.6;
}

.prefer__control {
  display: flex;
  gap: 0.5rem;
}

.prefer__divider {
  height: 1px;
  background-color: var(--setting-border-color);
  margin: 0.5rem 0;
}

.prefer__actions {
  display: flex;
  gap: 1rem;
  padding-top: 0.5rem;
}

// 自定义按钮样式
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
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

  // 主要按钮
  &--primary {
    background: linear-gradient(135deg, #e8a87c 0%, #d4956a 100%);
    color: #fff;
    box-shadow: 0 4px 14px rgba(212, 149, 106, 0.35);

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(212, 149, 106, 0.45);
    }

    html.dark & {
      background: rgba(255, 255, 255, 0.08);
      color: #ffffff;
      border: 1px solid rgba(255, 255, 255, 0.15);
      box-shadow: 
        0 4px 20px rgba(0, 0, 0, 0.4),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);

      &:hover:not(:disabled) {
        background: rgba(255, 255, 255, 0.12);
        border-color: rgba(255, 255, 255, 0.25);
      }
    }
  }

  // 幽灵按钮
  &--ghost {
    background-color: transparent;
    color: var(--color-text);
    border: 1px solid var(--setting-border-color);

    &:hover:not(:disabled) {
      background-color: var(--hover-btn-bg-color);
      border-color: var(--color-text);
    }

    html.dark & {
      color: rgba(255, 255, 255, 0.7);
      border-color: rgba(255, 255, 255, 0.15);

      &:hover:not(:disabled) {
        background-color: rgba(255, 255, 255, 0.05);
        border-color: rgba(255, 255, 255, 0.3);
        color: #ffffff;
      }
    }
  }

  // 次要按钮
  &--secondary {
    background-color: var(--hover-btn-bg-color);
    color: var(--color-text);
    border: 1px solid transparent;

    &:hover:not(:disabled) {
      border-color: var(--setting-border-color);
    }

    html.dark & {
      background: rgba(255, 255, 255, 0.06);
      color: rgba(255, 255, 255, 0.9);
      border: 1px solid rgba(255, 255, 255, 0.1);

      &:hover:not(:disabled) {
        background: rgba(255, 255, 255, 0.1);
        border-color: rgba(255, 255, 255, 0.2);
      }
    }
  }

  // 选项按钮
  &--option {
    padding: 0.5rem 1rem;
    background-color: transparent;
    color: var(--color-text);
    opacity: 0.7;
    border: 1px solid var(--setting-border-color);
    border-radius: 6px;
    font-size: 0.8rem;

    &:hover:not(:disabled) {
      opacity: 1;
      border-color: var(--color-text);
    }

    &--active {
      opacity: 1;
      background: linear-gradient(135deg, #e8a87c 0%, #d4956a 100%);
      color: #fff;
      border-color: transparent;

      html.dark & {
        background: rgba(255, 255, 255, 0.12);
        color: #ffffff;
        border: 1px solid rgba(255, 255, 255, 0.2);
      }
    }

    html.dark & {
      color: rgba(255, 255, 255, 0.7);
      border-color: rgba(255, 255, 255, 0.1);

      &:hover:not(:disabled) {
        border-color: rgba(255, 255, 255, 0.25);
        color: #ffffff;
      }
    }
  }

  // 小尺寸
  &--small {
    padding: 0.5rem 1rem;
    font-size: 0.8rem;
    border-radius: 6px;
  }

  &__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    
    .icon {
      width: 1.1em;
      height: 1.1em;
      transition: transform 0.3s ease;
      
      &--sun {
        color: #e8a87c;
      }
      
      &--moon {
        color: #c0c0c0;
      }
      
      html.dark &--sun {
        color: #d4a574;
      }
      
      html.dark &--moon {
        color: #e8e8e8;
      }
    }
    
    &:hover .icon {
      transform: rotate(15deg);
    }
  }
}

// 响应式适配
@media (max-width: 576px) {
  .prefer__box {
    padding: 1rem;
    gap: 1rem;
  }

  .prefer__item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .prefer__control {
    width: 100%;
    justify-content: flex-end;
  }

  .prefer__actions {
    flex-direction: column;
    
    .btn {
      width: 100%;
    }
  }
}
</style>
