import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { UserLoginResponse } from '@/types/user/UserLogin.ts'
import { useRouter } from 'vue-router'

export const useUserStore = defineStore('user', () => {

    const router = useRouter()

    const userInfo = ref<UserLoginResponse>({
      name: '',
      role: ''
    })
    const isLogin = ref(false)

    const login = ({ name, role }: UserLoginResponse) => {
      userInfo.value.name = name
      userInfo.value.role = role
      isLogin.value = true
    }

    const logout = () => {
      isLogin.value = false
      userInfo.value.name = ''
      userInfo.value.role = ''

      sessionStorage.removeItem('user')
      router.push('/login')
    }

    return { userInfo, logout, login }
  },
  {
    persist: {
      storage: sessionStorage,
    }
  }
)
