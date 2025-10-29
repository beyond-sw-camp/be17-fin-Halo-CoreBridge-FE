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
      router.push('/')
    }

    const logout = () => {
      isLogin.value = false
      sessionStorage.removeItem('user')
      router.push('/login')
    }

    const isApplicant = () => {
      return userInfo.value.role === 'ROLE_APPLICANT'
    }

    const getIsLogin = () => {
      return isLogin.value
    }

    return { userInfo, logout, login, isApplicant, getIsLogin }
  },
  {
    persist: {
      storage: sessionStorage,
    }
  }
)
