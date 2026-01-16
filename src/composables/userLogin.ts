import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/useUserStore";
import type { LoginForm } from "@/types/loginForm";

const router = useRouter();
const userStore = useUserStore();

/**
 * 用户登录
 * @param LoginForm 登录表单
 */
export const handleUserLogin = (LoginForm: LoginForm) => {
    if (!login()){
        // 失败->提示->退出
        return
    }
    // 成功->跳转
    router.push('/Home');
}

/**
 * 用户登出
 */
export const handleUserLogout = () => {
    userStore.setLoginState(false);
    if (!logout()){
        return
    }
    router.push('/Login');
}

const logout = ():boolean => {
    userStore.setLoginState(false);
    return true
}


/**
 * 登录请求逻辑(暂时先这么写,后面抽离请求)
 * 1.通过公钥加密密码
 * 2.发送登录请求
 * 3.拿到返回值-用户信息--将用户信息存储进sotre中
 * @returns 登录成功与否
 */
const login = ():boolean=>{
    userStore.setLoginState(true);
    return true;
}