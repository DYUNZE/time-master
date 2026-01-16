import { ref, computed, reactive } from 'vue'
import { defineStore } from 'pinia'

export interface UserInfo{
  username: string
}

export const useUserStore = defineStore('user', () => {
  const userInfo = reactive<UserInfo>({
    username: '',
  })

  const loginState = ref(false)


  const setLoginState = (state:boolean)=>{
    loginState.value = state
  }

  /**
   * 获取登录状态(只读)
   */
  const getLoginState = computed(() => loginState.value)

  

  return { getLoginState,setLoginState,userInfo}
})
