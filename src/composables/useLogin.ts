import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/useUserStore";
import type { LoginForm } from "@/types/loginForm";


export const useLogin = ()=>{
    const router = useRouter();
    const userStore = useUserStore();

    /**
     * 用户登录
     * @param LoginForm 登录表单
     */
    const handleUserLogin = (LoginForm: LoginForm) => {
        userStore.setLoginState(true);
        router.push('/Home');
    }

    /**
     * 用户登出
     */
    const handleUserLogout = () => {
        userStore.setLoginState(false);
        router.push('/Login');
    }

    return {handleUserLogin, handleUserLogout}
}