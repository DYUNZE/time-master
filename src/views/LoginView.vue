<script setup lang='ts'>
import LoginForm from '@/components/LoginForm.vue';
import { useGlobalTheme } from '@/composables/useGlobalTheme';

const {isDark} = useGlobalTheme();


</script>

<template>
    <div class="login-page">
        <div class="login-bg-wrapper">
            <img v-if="!isDark" class="login-img" src="@/assets/img/mountain.svg">
        </div>
        <div class="login-form-wrapper">
            <LoginForm />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.login-page {
    display: flex;
    width: 100vw;
    height: 100vh;

    .login-bg-wrapper {
        flex: 7;
        height: 100%;
        overflow: hidden;

        .login-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: center;
        }
    }

    .login-form-wrapper {
        flex: 3;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0 2rem;
        box-shadow: 0px 15px 10px var(--login-wrapper-box-shadow-color);
    }
}

@media (max-width: 768px) {
    .login-bg-wrapper {
        display: none;
    }

    .login-form-wrapper {
        box-shadow: none;
    }
}
</style>