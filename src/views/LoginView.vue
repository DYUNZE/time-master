<script setup lang='ts'>
import LoginForm from '@/components/LoginForm.vue';
</script>

<template>
    <div class="login-page">
        <div class="login-img-wrapper">
            <!-- 后期可以考虑将图片分成若干份，通过动画来更直观的切换黑夜和白天 -->
            <!-- 比如月亮和太阳 -->
            <img src="@/assets/img/mountain.svg" class="login-img">
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

    .login-img-wrapper {
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
    .login-img-wrapper {
        display: none;
    }

    .login-form-wrapper {
        box-shadow: none;
    }
}
</style>