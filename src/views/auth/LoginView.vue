<script setup lang="ts">
import { ref, reactive } from 'vue'
import userAPI from '@/api/user'
import { UserRound, Mail, LockKeyhole } from 'lucide-vue-next'
import type { UserLogin, UserLoginError } from '@/types/user/UserLogin'
import { useUserStore } from '@/store/useUserStore.ts'

const userStore = useUserStore()

const formData: UserLogin = reactive({
    email: '',
    password: '',
})

const initialErrors: UserLoginError = reactive({
    email: '',
    password: '',
    global: '',
})

const errors: UserLoginError = reactive({ ...initialErrors })

// 이메일 인증 관련
const emailVerified = ref(false)

const validateForm = () => {

    Object.assign(errors, initialErrors) // 에러 초기화

    let valid: boolean = true

    if (!formData.email.trim()) {
        errors.email = '이메일을 입력해주세요'
        valid = false
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        errors.email = '올바른 이메일 형식이 아닙니다'
        valid = false
    }


    if (!formData.password) {
        errors.password = '비밀번호를 입력해주세요'
        valid = false
    } else if (formData.password.length < 8) {
        errors.password = '비밀번호는 8자 이상이어야 합니다'
        valid = false
    }

    return valid
}

/**
 * 로그인 처리
 */
const handleSubmit = async () => {

    if (validateForm()) {
        // 로그인 처리
        const response = await userAPI.requestLogin(formData)
        if (response.success) {
          // 로그인 성공 시 리다이렉트 등 처리
          userStore.login(response.results)
        } else {
            errors.global = response.message || '로그인에 실패했습니다. 다시 시도해주세요.'
        }
    }
}
</script>

<template>
    <div
        class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-4 py-12">
        <div class="max-w-md w-full">
            <div class="bg-white rounded-2xl shadow-xl p-8">
                <!-- 헤더 -->
                <div class="text-center mb-8">
                    <div class="inline-flex items-center justify-center w-16 h-16 bg-slate-600 rounded-full mb-4">
                        <UserRound class="w-8 h-8 text-white" />
                    </div>
                    <h1 class="text-3xl font-bold text-gray-900 mb-2">로그인</h1>
                </div>

                <!-- 폼 -->
                <form @submit.prevent="handleSubmit" class="space-y-5">

                    <!-- 이메일 입력 -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">이메일</label>
                        <div class="flex gap-2">
                            <div class="relative flex-1">
                                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail class="w-5 h-5 text-gray-400" />
                                </div>
                                <input v-model="formData.email" type="email" :disabled="emailVerified"
                                    :class="['block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition', errors.email || errors.global ? 'border-red-300' : emailVerified ? 'border-green-300 bg-green-50' : 'border-gray-300']"
                                    placeholder="example@email.com" />
                            </div>
                        </div>
                        <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
                    </div>


                    <!-- 비밀번호 입력 -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">비밀번호</label>
                        <div class="relative">
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <LockKeyhole class="w-5 h-5 text-gray-400" />
                            </div>
                            <input v-model="formData.password" type="password"
                                :class="['block w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition', errors.password || errors.global ? 'border-red-300' : 'border-gray-300']"
                                placeholder="8자 이상 입력" />
                        </div>
                        <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password }}</p>
                    </div>

                    <div class="text-center">
                        <p v-if="errors.global" class="text-sm text-red-600">{{ errors.global }}</p>
                    </div>

                    <!-- 가입 버튼 -->
                    <button type="submit"
                        class="w-full bg-slate-600 text-white py-3 rounded-lg font-semibold hover:bg-slate-700 transform hover:scale-[1.02] transition shadow-lg hover:cursor-pointer">
                        로그인
                    </button>
                </form>

                <!-- 로그인 링크 -->
                <div class="mt-6 text-center">
                    <p class="text-sm text-gray-600">
                        <RouterLink :to="{ name: 'signup' }">
                            <a class="text-slate-600 hover:text-slate-700 font-semibold">회원가입</a>
                        </RouterLink>
                        |
                        <RouterLink :to="{ path: 'email-find' }">
                            <a class="text-slate-600 hover:text-slate-700 font-semibold">이메일 찾기</a>
                        </RouterLink>
                        |
                        <RouterLink :to="{ path: 'password-reset' }">
                            <a class="text-slate-600 hover:text-slate-700 font-semibold">비밀번호 찾기</a>
                        </RouterLink>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
