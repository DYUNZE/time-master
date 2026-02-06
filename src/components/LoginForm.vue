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
            <input autocomplete="username" v-model="userLoginForm.username" type="text" placeholder="请输入用户名"
                class="form-input" />
        </div>
        <div class="form-item">
            <label>密码</label>
            <input autocomplete="current-password" v-model="userLoginForm.password" type="password" placeholder="请输入密码"
                class="form-input" />
        </div>
        <button class="login-btn" type="submit">登录</button>
    </form>
</template>

<style lang="scss" scoped>
.login-form {
    .clock {
        margin-bottom: 2rem;
    }

    /* 表单标题 */
    .form-title {
        text-align: center;
        margin-bottom: 1.5rem;
        font-size: 1.5rem;
        color: var(--login-title-color);
        font-weight: bold;
        user-select: none;
    }

    /* 表单项 */
    .form-item {
        margin-bottom: 1.2rem;

        label {
            display: block;
            margin-bottom: 0.5rem;
        }

        .form-input {
            width: 100%;
            padding: 0.8rem;
            border: 1px solid #ddd;
            border-radius: 4px;
            outline: none;
        
            &:focus {
                box-shadow: 0 0 7px var(--login-btn-focus-color);
            }
        }
    }

    .login-btn {
        width: 100%;
        padding: 0.8rem;
        border: var(--login-btn-border);
        border-radius: .75rem;
        background: var(--login-btn-bg-color);
        color: #fff;
        font-size: 1rem;
        cursor: pointer;
        position: relative;

        &:hover {
            box-shadow: 0 0 7px #fff;
            &::before {
                left: 25%;
            }

            &::after {
                left: 75%;
            }
        }

        &::before {
            position: absolute;
            content: "";
            top: -2px;
            left: 75%;
            width: 15%;
            height: 2px;
            background: var(--color-background);
            transform: skewX(-50deg);
            transition: left 0.3s;
        }

        &::after {
            position: absolute;
            content: "";
            bottom: -2px;
            width: 15%;
            height: 2px;
            left: 20%;
            background: var(--color-background);
            transform: skewX(-60deg);
            transition: left 0.3s;
        }
    }
}

@media (max-width: 768px) {
    .form-input {
        padding: 1rem 4.5rem 1rem 1rem;
    }
}
</style>