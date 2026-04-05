<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useUserStore } from '@/stores/useUserStore';
import { ElMessage } from 'element-plus';
import { useGlobalTheme } from '@/composables/useGlobalTheme';

const userStore = useUserStore();
const { isDark } = useGlobalTheme();

// 密码修改表单
const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
});

// 表单验证规则
const passwordRules = {
  oldPassword: [
    { required: true, message: '请输入原密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少6位', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    {
      validator: (_rule: unknown, value: string, callback: (error?: Error) => void) => {
        if (value !== passwordForm.newPassword) {
          callback(new Error('两次输入的密码不一致'));
        } else {
          callback();
        }
      },
      trigger: 'blur'
    }
  ]
};

const passwordFormRef = ref();
const loading = ref(false);

// 提交密码修改
const handlePasswordSubmit = async () => {
  if (!passwordFormRef.value) return;
  
  await passwordFormRef.value.validate((valid: boolean) => {
    if (valid) {
      loading.value = true;
      // 模拟API调用
      setTimeout(() => {
        ElMessage.success('密码修改成功');
        // 清空表单
        passwordForm.oldPassword = '';
        passwordForm.newPassword = '';
        passwordForm.confirmPassword = '';
        passwordFormRef.value?.resetFields();
        loading.value = false;
      }, 800);
    }
  });
};

// 账户安全选项
const securityOptions = reactive([
  {
    title: '登录保护',
    description: '开启后，在新设备登录需要验证',
    enabled: true
  },
  {
    title: '双重验证',
    description: '使用验证码或安全密钥进行二次验证',
    enabled: false
  },
  {
    title: '登录通知',
    description: '登录时发送邮件通知',
    enabled: true
  }
]);

const handleSecurityToggle = (index: number) => {
  const option = securityOptions[index];
  if (option) {
    option.enabled = !option.enabled;
    ElMessage.success(`${option.title}已${option.enabled ? '开启' : '关闭'}`);
  }
};
</script>

<template>
  <div class="account__box">
    <!-- 修改密码区域 -->
    <section class="account__section">
      <h2 class="account__title">修改密码</h2>
      <p class="account__desc">定期更换密码可以保护您的账户安全</p>
      
      <el-form
        ref="passwordFormRef"
        :model="passwordForm"
        :rules="passwordRules"
        class="account__form"
        label-position="top"
      >
        <el-form-item label="原密码" prop="oldPassword">
          <el-input
            v-model="passwordForm.oldPassword"
            type="password"
            placeholder="请输入原密码"
            show-password
            class="account__input"
          />
        </el-form-item>
        
        <el-form-item label="新密码" prop="newPassword">
          <el-input
            v-model="passwordForm.newPassword"
            type="password"
            placeholder="请输入新密码（至少6位）"
            show-password
            class="account__input"
          />
        </el-form-item>
        
        <el-form-item label="确认新密码" prop="confirmPassword">
          <el-input
            v-model="passwordForm.confirmPassword"
            type="password"
            placeholder="请再次输入新密码"
            show-password
            class="account__input"
          />
        </el-form-item>
        
        <el-form-item>
          <button
            :disabled="loading"
            class="btn btn--primary account__submit"
            @click="handlePasswordSubmit"
          >
            <span v-if="loading" class="btn__spinner" />
            <span v-else>保存修改</span>
          </button>
        </el-form-item>
      </el-form>
    </section>

    <!-- 分隔线 -->
    <div class="account__divider" />

    <!-- 账户安全区域 -->
    <section class="account__section">
      <h2 class="account__title">账户安全</h2>
      <p class="account__desc">管理您的账户安全设置</p>
      
      <div class="security__list">
        <div
          v-for="(item, index) in securityOptions"
          :key="index"
          class="security__item"
        >
          <div class="security__info">
            <h3 class="security__name">{{ item.title }}</h3>
            <p class="security__desc">{{ item.description }}</p>
          </div>
          <el-switch
            v-model="item.enabled"
            :active-color="isDark ? '#909399' : '#d4956a'"
            @change="handleSecurityToggle(index)"
          />
        </div>
      </div>
    </section>

    <!-- 分隔线 -->
    <div class="account__divider" />

    <!-- 危险操作区域 -->
    <section class="account__section account__section--danger">
      <h2 class="account__title account__title--danger">危险操作</h2>
      <p class="account__desc">以下操作不可逆，请谨慎操作</p>
      
      <div class="danger__list">
        <div class="danger__item">
          <div class="danger__info">
            <h3 class="danger__name">退出所有设备</h3>
            <p class="danger__desc">强制所有已登录设备退出登录状态</p>
          </div>
          <button class="btn btn--warning btn--small">
            退出登录
          </button>
        </div>
        
        <div class="danger__item">
          <div class="danger__info">
            <h3 class="danger__name">注销账户</h3>
            <p class="danger__desc">永久删除您的账户和所有数据，此操作无法恢复</p>
          </div>
          <button class="btn btn--danger btn--small">
            注销账户
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.account__box {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.account__section {
  &--danger {
    .account__title--danger {
      color: #f56c6c;
    }
  }
}

.account__title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 0.5rem;
}

.account__desc {
  font-size: 0.875rem;
  color: var(--color-text);
  opacity: 0.7;
  margin-bottom: 1.25rem;
}

.account__form {
  max-width: 400px;
}

.account__input {
  :deep(.el-input__wrapper) {
    border-radius: 8px;
  }
}

.account__submit {
  width: 120px;
  border-radius: 8px;
  margin-top: 0.5rem;
}

.account__divider {
  height: 1px;
  background-color: var(--setting-border-color);
  margin: 0.5rem 0;
}

// 安全选项列表
.security__list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.security__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background-color: var(--hover-btn-bg-color);
  border-radius: 8px;
  transition: background-color 0.3s ease;

  html.dark & {
    background-color: rgba(255, 255, 255, 0.05);
  }
}

.security__info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.security__name {
  font-size: 1rem;
  font-weight: 500;
  color: var(--color-text);
}

.security__desc {
  font-size: 0.8rem;
  color: var(--color-text);
  opacity: 0.6;
}

// 危险操作区域
.danger__list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.danger__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border: 1px solid var(--setting-border-color);
  border-radius: 8px;
  transition: border-color 0.3s ease;

  &:hover {
    border-color: #f56c6c;
  }
}

.danger__info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.danger__name {
  font-size: 1rem;
  font-weight: 500;
  color: var(--color-text);
}

.danger__desc {
  font-size: 0.8rem;
  color: var(--color-text);
  opacity: 0.6;
}

// 自定义按钮样式
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
  position: relative;
  overflow: hidden;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  // 主要按钮 - 温暖杏色渐变
  &--primary {
    background: linear-gradient(135deg, #e8a87c 0%, #d4956a 100%);
    color: #fff;
    box-shadow: 0 4px 14px rgba(212, 149, 106, 0.35);

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(212, 149, 106, 0.45);
    }

    &:active:not(:disabled) {
      transform: translateY(0);
    }

    html.dark & {
      background: rgba(255, 255, 255, 0.08);
      color: #ffffff;
      border: 1px solid rgba(255, 255, 255, 0.15);
      box-shadow: 
        0 4px 20px rgba(0, 0, 0, 0.4),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);

      &:hover:not(:disabled) {
        background: rgba(255, 255, 255, 0.12);
        border-color: rgba(255, 255, 255, 0.25);
        box-shadow: 
          0 6px 24px rgba(0, 0, 0, 0.5),
          inset 0 1px 0 rgba(255, 255, 255, 0.15);
      }
    }
  }

  // 警告按钮 - 温暖琥珀色
  &--warning {
    background-color: transparent;
    color: #d4a574;
    border: 1px solid #e8c9a0;

    &:hover:not(:disabled) {
      background-color: rgba(212, 165, 116, 0.1);
      border-color: #d4a574;
    }

    html.dark & {
      background: rgba(230, 162, 60, 0.08);
      color: #f0c070;
      border: 1px solid rgba(230, 162, 60, 0.25);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);

      &:hover:not(:disabled) {
        background: rgba(230, 162, 60, 0.12);
        border-color: rgba(230, 162, 60, 0.4);
      }
    }
  }

  // 危险按钮 - 温暖珊瑚色
  &--danger {
    background-color: transparent;
    color: #d48888;
    border: 1px solid #e8c0c0;

    &:hover:not(:disabled) {
      background-color: rgba(212, 136, 136, 0.1);
      border-color: #d48888;
    }

    html.dark & {
      background: rgba(245, 108, 108, 0.08);
      color: #ff9999;
      border: 1px solid rgba(245, 108, 108, 0.25);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);

      &:hover:not(:disabled) {
        background: rgba(245, 108, 108, 0.12);
        border-color: rgba(245, 108, 108, 0.4);
      }
    }
  }

  // 小尺寸
  &--small {
    padding: 0.5rem 1rem;
    font-size: 0.8rem;
    border-radius: 6px;
  }

  // 加载动画
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

// 响应式适配
@media (max-width: 576px) {
  .account__box {
    padding: 1rem;
    gap: 1rem;
  }

  .account__form {
    max-width: 100%;
  }

  .account__submit {
    width: 100%;
  }

  .security__item,
  .danger__item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
}
</style>
