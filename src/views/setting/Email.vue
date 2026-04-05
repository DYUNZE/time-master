<script setup lang="ts">
import { reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { useGlobalTheme } from '@/composables/useGlobalTheme';

const { isDark } = useGlobalTheme();

// 邮箱设置
const emailForm = reactive({
  email: '',
  verified: false,
  notificationEnabled: true,
  weeklyDigest: true,
  mentionNotify: true,
  systemUpdate: false,
  marketing: false,
});

// 验证状态
const isEditing = ref(false);
const verificationCode = ref('');
const countdown = ref(0);
const loading = ref(false);

// 发送验证码
const sendVerificationCode = () => {
  if (!emailForm.email || !validateEmail(emailForm.email)) {
    ElMessage.error('请输入有效的邮箱地址');
    return;
  }
  
  loading.value = true;
  
  // 模拟发送
  setTimeout(() => {
    ElMessage.success('验证码已发送，请查收邮件');
    loading.value = false;
    countdown.value = 60;
    
    const timer = setInterval(() => {
      countdown.value--;
      if (countdown.value <= 0) {
        clearInterval(timer);
      }
    }, 1000);
  }, 1000);
};

// 验证邮箱
const verifyEmail = () => {
  if (!verificationCode.value) {
    ElMessage.error('请输入验证码');
    return;
  }
  
  loading.value = true;
  
  setTimeout(() => {
    emailForm.verified = true;
    isEditing.value = false;
    loading.value = false;
    ElMessage.success('邮箱验证成功');
    
    // 保存到本地存储
    localStorage.setItem('email_settings', JSON.stringify({
      email: emailForm.email,
      verified: true,
    }));
  }, 1000);
};

// 切换编辑状态
const toggleEdit = () => {
  if (isEditing.value) {
    // 取消编辑
    isEditing.value = false;
    verificationCode.value = '';
  } else {
    // 开始编辑
    isEditing.value = true;
  }
};

// 解绑邮箱
const unbindEmail = () => {
  emailForm.email = '';
  emailForm.verified = false;
  verificationCode.value = '';
  localStorage.removeItem('email_settings');
  ElMessage.success('邮箱已解绑');
};

// 验证邮箱格式
const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// 保存通知设置
const saveNotificationSettings = () => {
  localStorage.setItem('email_notifications', JSON.stringify({
    notificationEnabled: emailForm.notificationEnabled,
    weeklyDigest: emailForm.weeklyDigest,
    mentionNotify: emailForm.mentionNotify,
    systemUpdate: emailForm.systemUpdate,
    marketing: emailForm.marketing,
  }));
  ElMessage.success('通知设置已保存');
};

// 加载已保存的设置
const loadSettings = () => {
  const saved = localStorage.getItem('email_settings');
  if (saved) {
    const parsed = JSON.parse(saved);
    emailForm.email = parsed.email || '';
    emailForm.verified = parsed.verified || false;
  }
  
  const notificationSaved = localStorage.getItem('email_notifications');
  if (notificationSaved) {
    const parsed = JSON.parse(notificationSaved);
    emailForm.notificationEnabled = parsed.notificationEnabled ?? true;
    emailForm.weeklyDigest = parsed.weeklyDigest ?? true;
    emailForm.mentionNotify = parsed.mentionNotify ?? true;
    emailForm.systemUpdate = parsed.systemUpdate ?? false;
    emailForm.marketing = parsed.marketing ?? false;
  }
};

loadSettings();
</script>

<template>
  <div class="email__box">
    <!-- 邮箱绑定区域 -->
    <section class="email__section">
      <h2 class="email__title">邮箱绑定</h2>
      <p class="email__desc">绑定邮箱后可接收通知和找回密码</p>
      
      <div class="email__card">
        <!-- 已绑定状态 -->
        <template v-if="emailForm.verified && !isEditing">
          <div class="email__bound">
            <div class="email__bound-info">
              <div class="email__bound-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="2" y="5" width="20" height="14" rx="2"/>
                  <polyline points="2,5 12,13 22,5"/>
                </svg>
              </div>
              <div class="email__bound-detail">
                <h3 class="email__bound-address">{{ emailForm.email }}</h3>
                <span class="email__bound-status">
                  <span class="email__verified-dot" />
                  已验证
                </span>
              </div>
            </div>
            <div class="email__bound-actions">
              <button class="btn btn--ghost btn--small" @click="toggleEdit">
                修改
              </button>
              <button class="btn btn--danger btn--small" @click="unbindEmail">
                解绑
              </button>
            </div>
          </div>
        </template>
        
        <!-- 编辑/未绑定状态 -->
        <template v-else>
          <div class="email__form">
            <div class="email__input-group">
              <label class="email__label">邮箱地址</label>
              <input
                v-model="emailForm.email"
                type="email"
                class="email__input"
                placeholder="请输入邮箱地址"
                :disabled="loading"
              />
            </div>
            
            <div v-if="isEditing || !emailForm.verified" class="email__verify-group">
              <div class="email__input-group">
                <label class="email__label">验证码</label>
                <div class="email__verify-row">
                  <input
                    v-model="verificationCode"
                    type="text"
                    class="email__input email__input--code"
                    placeholder="请输入验证码"
                    maxlength="6"
                    :disabled="loading"
                  />
                  <button
                    class="btn btn--secondary"
                    :disabled="countdown > 0 || loading || !emailForm.email"
                    @click="sendVerificationCode"
                  >
                    {{ countdown > 0 ? `${countdown}s` : '获取验证码' }}
                  </button>
                </div>
              </div>
            </div>
            
            <div class="email__form-actions">
              <button
                class="btn btn--primary"
                :disabled="loading || !verificationCode"
                @click="verifyEmail"
              >
                <span v-if="loading" class="btn__spinner" />
                <span v-else>验证并绑定</span>
              </button>
              <button v-if="isEditing" class="btn btn--ghost" @click="toggleEdit">
                取消
              </button>
            </div>
          </div>
        </template>
      </div>
    </section>

    <div class="email__divider" />

    <!-- 通知设置区域 -->
    <section class="email__section">
      <h2 class="email__title">通知设置</h2>
      <p class="email__desc">选择您希望接收的邮件通知类型</p>
      
      <div class="email__settings">
        <!-- 总开关 -->
        <div class="email__setting-item email__setting-item--master">
          <div class="email__setting-info">
            <h3 class="email__setting-name">启用邮件通知</h3>
            <p class="email__setting-desc">开启后将会收到以下类型的邮件</p>
          </div>
          <el-switch
            v-model="emailForm.notificationEnabled"
            :active-color="isDark ? 'rgba(255,255,255,0.3)' : '#d4956a'"
          />
        </div>

        <!-- 分割线 -->
        <div class="email__settings-divider" />

        <!-- 各类型通知 -->
        <div class="email__setting-list" :class="{ 'email__setting-list--disabled': !emailForm.notificationEnabled }">
          <div class="email__setting-item">
            <div class="email__setting-info">
              <h3 class="email__setting-name">每周摘要</h3>
              <p class="email__setting-desc">每周一发送上周计划和完成情况总结</p>
            </div>
            <el-switch
              v-model="emailForm.weeklyDigest"
              :disabled="!emailForm.notificationEnabled"
              :active-color="isDark ? 'rgba(255,255,255,0.3)' : '#d4956a'"
            />
          </div>

          <div class="email__setting-item">
            <div class="email__setting-info">
              <h3 class="email__setting-name">@提及通知</h3>
              <p class="email__setting-desc">当有人在聊天室中@您时发送通知</p>
            </div>
            <el-switch
              v-model="emailForm.mentionNotify"
              :disabled="!emailForm.notificationEnabled"
              :active-color="isDark ? 'rgba(255,255,255,0.3)' : '#d4956a'"
            />
          </div>

          <div class="email__setting-item">
            <div class="email__setting-info">
              <h3 class="email__setting-name">系统更新</h3>
              <p class="email__setting-desc">应用更新、维护公告等重要通知</p>
            </div>
            <el-switch
              v-model="emailForm.systemUpdate"
              :disabled="!emailForm.notificationEnabled"
              :active-color="isDark ? 'rgba(255,255,255,0.3)' : '#d4956a'"
            />
          </div>

          <div class="email__setting-item">
            <div class="email__setting-info">
              <h3 class="email__setting-name">产品动态</h3>
              <p class="email__setting-desc">新功能介绍、使用技巧等营销邮件</p>
            </div>
            <el-switch
              v-model="emailForm.marketing"
              :disabled="!emailForm.notificationEnabled"
              :active-color="isDark ? 'rgba(255,255,255,0.3)' : '#d4956a'"
            />
          </div>
        </div>
      </div>
    </section>

    <div class="email__divider" />

    <!-- 保存按钮 -->
    <section class="email__actions">
      <button class="btn btn--primary" @click="saveNotificationSettings">
        保存设置
      </button>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.email__box {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.email__title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 0.5rem;
}

.email__desc {
  font-size: 0.875rem;
  color: var(--color-text);
  opacity: 0.7;
  margin-bottom: 1.25rem;
}

.email__card {
  background-color: var(--hover-btn-bg-color);
  border-radius: 12px;
  padding: 1.5rem;

  html.dark & {
    background-color: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.06);
  }
}

// 已绑定状态
.email__bound {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
}

.email__bound-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.email__bound-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #e8a87c 0%, #d4956a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;

  svg {
    width: 24px;
    height: 24px;
  }

  html.dark & {
    background: rgba(255, 255, 255, 0.1);
  }
}

.email__bound-detail {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.email__bound-address {
  font-size: 1rem;
  font-weight: 500;
  color: var(--color-text);
}

.email__bound-status {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.8rem;
  color: #67c23a;
}

.email__verified-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #67c23a;
}

.email__bound-actions {
  display: flex;
  gap: 0.75rem;
}

// 表单样式
.email__form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 400px;
}

.email__input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.email__label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text);
}

.email__input {
  padding: 0.75rem 1rem;
  border: 1px solid var(--setting-border-color);
  border-radius: 8px;
  font-size: 0.875rem;
  color: var(--color-text);
  background-color: transparent;
  transition: all 0.3s ease;
  outline: none;

  &::placeholder {
    color: var(--color-text);
    opacity: 0.4;
  }

  &:focus {
    border-color: #d4956a;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  html.dark & {
    border-color: rgba(255, 255, 255, 0.15);

    &:focus {
      border-color: rgba(255, 255, 255, 0.4);
    }
  }
}

.email__verify-row {
  display: flex;
  gap: 0.75rem;
}

.email__input--code {
  flex: 1;
  text-align: center;
  letter-spacing: 0.5em;
}

.email__form-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

// 设置列表
.email__settings {
  display: flex;
  flex-direction: column;
  gap: 0;
  background-color: var(--hover-btn-bg-color);
  border-radius: 12px;
  padding: 1rem;

  html.dark & {
    background-color: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.06);
  }
}

.email__setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 0.5rem;
  transition: opacity 0.3s ease;

  &--master {
    padding-top: 0.5rem;
  }
}

.email__settings-divider {
  height: 1px;
  background-color: var(--setting-border-color);
  margin: 0.5rem 0;

  html.dark & {
    background-color: rgba(255, 255, 255, 0.1);
  }
}

.email__setting-list {
  display: flex;
  flex-direction: column;
  transition: opacity 0.3s ease;

  &--disabled {
    opacity: 0.5;
    pointer-events: none;
  }
}

.email__setting-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.email__setting-name {
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--color-text);
}

.email__setting-desc {
  font-size: 0.8rem;
  color: var(--color-text);
  opacity: 0.6;
}

.email__divider {
  height: 1px;
  background-color: var(--setting-border-color);
  margin: 0.5rem 0;
}

.email__actions {
  display: flex;
  gap: 1rem;
  padding-top: 0.5rem;
}

// 按钮样式
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
      border: 1px solid rgba(255, 255, 255, 0.15);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);

      &:hover:not(:disabled) {
        background: rgba(255, 255, 255, 0.12);
        border-color: rgba(255, 255, 255, 0.25);
      }
    }
  }

  &--secondary {
    background-color: var(--hover-btn-bg-color);
    color: var(--color-text);
    border: 1px solid var(--setting-border-color);
    white-space: nowrap;

    &:hover:not(:disabled) {
      border-color: #d4956a;
    }

    &:disabled {
      opacity: 0.5;
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

  &--ghost {
    background-color: transparent;
    color: var(--color-text);
    border: 1px solid var(--setting-border-color);

    &:hover:not(:disabled) {
      background-color: var(--hover-btn-bg-color);
    }

    html.dark & {
      color: rgba(255, 255, 255, 0.7);
      border-color: rgba(255, 255, 255, 0.15);

      &:hover:not(:disabled) {
        background-color: rgba(255, 255, 255, 0.05);
        color: #fff;
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

  &__spinner {
    width: 1rem;
    height: 1rem;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

// 响应式
@media (max-width: 576px) {
  .email__box {
    padding: 1rem;
  }

  .email__bound {
    flex-direction: column;
    align-items: flex-start;
  }

  .email__bound-actions {
    width: 100%;
    
    .btn {
      flex: 1;
    }
  }

  .email__verify-row {
    flex-direction: column;
  }

  .email__setting-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .email__actions .btn {
    width: 100%;
  }
}
</style>
