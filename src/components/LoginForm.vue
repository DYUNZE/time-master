<script setup lang='ts'>
import Clock from '@/components/Clock.vue';
import { reactive } from 'vue';
import { useLogin } from '@/composables/useLogin';
import type { LoginForm } from '@/types/loginForm';


const userLoginForm = reactive<LoginForm>({
    username: '',
    password: ''
});

const { handleUserLogin } = useLogin();


</script>

<template>
    <form class="login-form" @submit.prevent="handleUserLogin(userLoginForm)">
        <Clock class="clock" />
        <h2 class="form-title">Time Master</h2>
        <div class="form-item">
            <label>用户名</label>
            <input autocomplete="username" v-model="userLoginForm.username" type="text" placeholder="请输入用户名" class="form-input" />
        </div>
        <div class="form-item">
            <label>密码</label>
            <input autocomplete="current-password" v-model="userLoginForm.password" type="password" placeholder="请输入密码" class="form-input" />
        </div>
        <button class="login-btn" type="submit">登录</button>
    </form>
</template>

<style scoped>
/* 表单标题 */
.form-title {
    text-align: center;
    margin-bottom: 1.5rem;
    font-size: 1.5rem;
    color: #333;
    font-weight: bold;
    user-select: none;
}

/* 表单项 */
.form-item {
    margin-bottom: 1.2rem;
}

.form-item label {
    display: block;
    margin-bottom: 0.5rem;
}

.form-input {
    width: 100%;
    padding: 0.8rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    outline: none;
    box-shadow: 8px 8px 25px rgba(61, 196, 230, 0.2);
}

.form-input:focus {
    border-color: #57b6db;
}

/* 登录按钮 */
.login-btn {
    width: 100%;
    padding: 0.8rem;
    border: none;
    border-radius: .75rem;
    background: linear-gradient(135deg, #91d5ff, #1890ff);
    color: #fff;
    font-size: 1rem;
    cursor: pointer;
    box-shadow: 8px 8px 25px rgba(61, 196, 230, 0.2);
}

.login-btn:hover {
    background: linear-gradient(135deg, #a7d9ff, #0f88f0);
}

@media (max-width: 1024px) {
    .form-input {
        padding: 1rem 4.5rem 1rem 1rem;
    }
}
</style>