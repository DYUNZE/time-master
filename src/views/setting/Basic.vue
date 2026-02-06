<script setup lang='ts'>
import { reactive } from 'vue';

const userInfo = reactive({
    nickname: "David",
    e_mail: "dyz@wsw.cn",
    avatar_url: "https://picsum.photos/200"
})

</script>

<template>
    <div class="basic__box">
        <h2>个人资料信息</h2>
        <img class="avatar" src="https://picsum.photos/200" alt="用户头像" loading="lazy" />
        <div class="nickname">
            <h3>昵称</h3>
            <el-input v-model="userInfo.nickname" placeholder="please input Nickname" />
        </div>
        <div class="e-mail">
            <h3>邮箱</h3>
            <el-input v-model="userInfo.e_mail" placeholder="please input e-mail" />
        </div>
        <el-button style="width: 70px;margin-top: 1rem;">保存</el-button>
    </div>
</template>

<style lang="scss" scoped>
.basic__box {
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;

    .avatar {
        width: 170px;
        height: 170px;
        border-radius: 50%;
        object-fit: cover;
        cursor: pointer;
    }
    .nickname,.e-mail{
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }
}
</style>