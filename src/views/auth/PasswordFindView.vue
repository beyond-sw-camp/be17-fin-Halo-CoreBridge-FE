<script setup lang="ts">
import { ref, reactive } from 'vue'
import authAPI from '@/api/auth'
import { UserRound, Mail } from 'lucide-vue-next'
import type { EmailForm, EmailFormErrors } from '@/types/user/Email'

const emailForm: EmailForm = reactive({
    email: '',
})

const initialErrors: EmailFormErrors = reactive({
    email: '',
})

const isSendEmail = ref(false)

const errors: EmailFormErrors = reactive({ ...initialErrors })

// 이메일 인증 관련
const verificationSent = ref(false)
const emailVerified = ref(false)

const sendPasswordResetLink = async () => {

    if (validateForm()) {
        const response: ApiResponse = await authAPI.sendPasswordResetLink({ email: emailForm.email })
        if (response.success) {
            isSendEmail.value = true
        } else {
            alert(response.message);
        }
    }
}

const validateForm = () => {

    Object.assign(errors, initialErrors) // 에러 초기화

    let valid: boolean = true

    if (!emailForm.email.trim()) {
        errors.email = '이메일을 입력해주세요'
        valid = false
    } else if (!/\S+@\S+\.\S+/.test(emailForm.email)) {
        errors.email = '올바른 이메일 형식이 아닙니다'
        valid = false
    }

    return valid
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
                    <h1 class="text-3xl font-bold text-gray-900 mb-2">비밀번호 찾기</h1>
                </div>

                <!-- 폼 -->
                <form @submit.prevent="sendPasswordResetLink" class="space-y-5">

                    <!-- 이메일 입력 및 인증 -->
                    <div v-if="!isSendEmail">
                        <label class="block text-sm font-medium text-gray-700 mb-2">이메일</label>
                        <div class="flex gap-2">
                            <div class="relative flex-1">
                                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail class="w-5 h-5 text-gray-400" />
                                </div>
                                <input v-model="emailForm.email" type="email" :disabled="emailVerified"
                                    :class="['block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition', errors.email ? 'border-red-300' : emailVerified ? 'border-green-300 bg-green-50' : 'border-gray-300']"
                                    placeholder="example@email.com" />
                            </div>

                        </div>
                        <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
                        <p v-if="verificationSent && !emailVerified" class="mt-1 text-sm text-slate-600">인증번호가 발송되었습니다
                        </p>
                    </div>
                    <div v-else class="text-center">
                        <p class="text-2xl font-bold">
                            비밀번호 재설정 링크 전송 완료
                        </p>
                        <p>
                            이메일로 전송된 링크를 확인해주세요.
                        </p>
                    </div>

                    <!-- 버튼 -->
                    <div class="flex gap-2 flex-col">
                        <button type="submit" @click="sendPasswordResetLink"
                            :disabled="!emailForm.email || verificationSent"
                            class="w-full bg-slate-600 text-white py-3 rounded-lg font-semibold hover:bg-slate-700 transform hover:scale-[1.02] transition shadow-lg hover:cursor-pointer"
                            v-if="!isSendEmail">
                            요청
                        </button>
                        <div class="flex gap-2 justify-between" v-else>
                            <p class="text-slate-400">
                                링크를 받지 못하셨나요?
                            </p>
                            <button class="hover:cursor-pointer text-slate-600" @click="sendPasswordResetLink">
                                재전송
                            </button>
                        </div>

                        <!-- 취소 버튼 -->
                        <RouterLink :to="{ path: '/login' }">
                            <button type="button"
                                class="w-full border-slate-600 py-3 rounded-lg font-semibold border transform hover:scale-[1.02] transition shadow-md hover:cursor-pointer">
                                돌아가기
                            </button>
                        </RouterLink>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<style scoped></style>