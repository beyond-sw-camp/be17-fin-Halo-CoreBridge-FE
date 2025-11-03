<script setup lang="ts">
import { ref, reactive, type Ref } from 'vue'
import authAPI from '@/api/auth'
import { UserRound, LockKeyhole, Eye, EyeOff } from 'lucide-vue-next'
import router from '@/router'
import type { PasswordChange, PasswordChangeErrors } from '@/types/user/UserUpdateForm'
import { useRoute } from 'vue-router'

const route = useRoute();

const formData: PasswordChange = reactive({
    email: route.query.email?.toString(),
    password: '',
    token: route.query.token?.toString()
})


const confirmPassword: Ref<string> = ref('')

const showPassword = ref(false)
const showConfirmPassword = ref(false)

const initialErrors: PasswordChangeErrors = reactive({
    password: '',
    passwordConfirm: '',
    global: ''
})

const errors: PasswordChangeErrors = reactive({ ...initialErrors })

const validateForm = () => {

    Object.assign(errors, initialErrors) // 에러 초기화

    let valid: boolean = true

    if (!formData.password) {
        errors.password = '비밀번호를 입력해주세요'
        valid = false
    } else if (formData.password.length < 8) {
        errors.password = '비밀번호는 8자 이상이어야 합니다'
        valid = false
    }

    if (formData.password !== confirmPassword.value) {
        errors.passwordConfirm = '비밀번호가 일치하지 않습니다'
        valid = false
    }

    return valid
}

/**
 * 비밀번호 재설정 요청
 */
const handleSubmit = async () => {

    if (validateForm()) {

        // 응답 처리
        const response = await authAPI.resetPassword(formData)
        if (response.success) {

            alert('비밀번호 재설정 성공! 로그인 화면으로 이동합니다!')
            router.push({ path: '/login' })

        } else {
            errors.global = "비밀번호 설정 세션이 만료되었습니다."
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
                    <h1 class="text-3xl font-bold text-gray-900 mb-2">비밀번호 재설정</h1>
                </div>

                <!-- 폼 -->
                <form @submit.prevent="handleSubmit" class="space-y-5">

                    <!-- 비밀번호 입력 -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">비밀번호</label>
                        <div class="relative">
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <LockKeyhole class="w-5 h-5 text-gray-400" />
                            </div>
                            <input v-model="formData.password" :type="showPassword ? 'text' : 'password'"
                                :class="['block w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition', errors.password || errors.global ? 'border-red-300' : 'border-gray-300']"
                                placeholder="8자 이상 입력" />
                            <button type="button" @click="showPassword = !showPassword"
                                class="absolute inset-y-0 right-0 pr-3 flex items-center">

                                <EyeOff v-if="showPassword" class="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                <Eye v-else class="h-5 w-5 text-gray-400 hover:text-gray-600" />

                            </button>
                        </div>
                        <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password }}</p>
                    </div>

                    <!-- 비밀번호 확인 -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">비밀번호 확인</label>
                        <div class="relative">
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <LockKeyhole class="w-5 h-5 text-gray-400" />
                            </div>
                            <input v-model="confirmPassword" :type="showConfirmPassword ? 'text' : 'password'" :class="['block w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition',
                                errors.passwordConfirm || errors.global ? 'border-red-300' : 'border-gray-300']"
                                placeholder="비밀번호 재입력" />
                            <button type="button" @click="showConfirmPassword = !showConfirmPassword"
                                class="absolute inset-y-0 right-0 pr-3 flex items-center">
                                <EyeOff v-if="showConfirmPassword" class="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                <Eye v-else class="h-5 w-5 text-gray-400 hover:text-gray-600" />
                            </button>
                        </div>
                        <p v-if="errors.passwordConfirm" class="mt-1 text-sm text-red-600">{{ errors.passwordConfirm }}
                        </p>
                    </div>

                    <div class="text-center">
                        <p v-if="errors.global" class="text-sm text-red-600">{{ errors.global }}</p>
                    </div>

                    <!-- 확인 버튼 -->
                    <button type="submit"
                        class="w-full bg-slate-600 text-white py-3 rounded-lg font-semibold hover:bg-slate-700 transform hover:scale-[1.02] transition shadow-lg">
                        확인
                    </button>
                </form>
            </div>
        </div>
    </div>
</template>

<style scoped></style>