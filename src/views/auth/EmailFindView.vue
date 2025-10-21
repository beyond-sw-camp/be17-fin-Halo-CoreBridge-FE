<script setup lang="ts">
import { reactive, ref } from 'vue'
import authAPI from '@/api/auth'
import { UserRound, Phone } from 'lucide-vue-next'
import type { EmailFindForm, EmailFindFormErrors } from '@/types/user/Email'

const formData: EmailFindForm = reactive({
    name: '',
    phone: ''
})

const initialErrors: EmailFindFormErrors = reactive({
    name: '',
    phone: '',
    global: ''
})

const errors: EmailFindFormErrors = reactive({ ...initialErrors })

const flag = reactive({
    findSuccess: false
})

const findEmail = ref('')

// 휴대폰 번호 포맷팅
const formatPhoneNumber = (e: Event) => {
    const value = (e.target as HTMLInputElement).value.replace(/[^0-9]/g, '')

    if (value.length <= 3) {
        formData.phone = value
    } else if (value.length <= 7) {
        formData.phone = value.slice(0, 3) + '-' + value.slice(3)
    } else {
        formData.phone = value.slice(0, 3) + '-' + value.slice(3, 7) + '-' + value.slice(7, 11)
    }
}

const validateForm = () => {

    Object.assign(errors, initialErrors) // 에러 초기화

    let valid: boolean = true

    if (!formData.name.trim()) {
        errors.name = '이름을 입력해주세요'
        valid = false
    }

    if (!formData.phone) {
        errors.phone = '휴대폰 번호를 입력해주세요'
        valid = false
    } else if (!/^010-\d{4}-\d{4}$/.test(formData.phone)) {
        errors.phone = '올바른 휴대폰 번호 형식이 아닙니다'
        valid = false
    }

    return valid
}

/**
 * 회원 가입 처리
 */
const handleSubmit = async () => {

    if (validateForm()) {

        // 이메일 찾기 조회
        const response = await authAPI.findEmail(formData)

        if (response.success) {
            flag.findSuccess = true
            findEmail.value = response.results.findEmail
        } else {
            flag.findSuccess = false
            errors.global = '사용자를 찾을 수 없습니다.'
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
                    <h1 class="text-3xl font-bold text-gray-900 mb-2">이메일 찾기</h1>
                </div>

                <!-- 폼 -->
                <form @submit.prevent="handleSubmit" class="space-y-2">

                    <div v-if="!flag.findSuccess" class="flex flex-col gap-6">
                        <!-- 이름 입력 -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">이름</label>
                            <div class="relative">
                                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <UserRound class="w-5 h-5 text-gray-400" />
                                </div>
                                <input v-model="formData.name" type="text"
                                    :class="['block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition', errors.name ? 'border-red-300' : 'border-gray-300']"
                                    placeholder="홍길동" />
                            </div>
                            <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
                        </div>

                        <!-- 휴대폰 번호 -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">휴대폰 번호</label>
                            <div class="relative">
                                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <phone class="w-5 h-5 text-gray-400" />
                                </div>
                                <input v-model="formData.phone" @input="formatPhoneNumber" type="tel" maxlength="13"
                                    :class="['block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition', errors.phone ? 'border-red-300' : 'border-gray-300']"
                                    placeholder="010-1234-5678" />
                            </div>
                            <p v-if="errors.phone" class="mt-1 text-sm text-red-600">{{ errors.phone }}</p>
                        </div>

                        <!-- 요청 버튼 -->
                        <button type="submit" @click="handleSubmit"
                            class="w-full bg-slate-600 text-white py-3 rounded-lg font-semibold hover:bg-slate-700 transform hover:scale-[1.02] transition shadow-lg hover:cursor-pointer">
                            요청
                        </button>
                    </div>
                    <div v-else class="text-center flex flex-col gap-5 mb-5">
                        <p class="font-bold">
                            요청하신 정보의 이메일은 다음과 같습니다.
                        </p>
                        <p class="text-2xl">
                            {{ findEmail }}
                        </p>
                    </div>

                    <!-- 취소 버튼 -->
                    <RouterLink :to="{ path: '/login' }">
                        <button type="button"
                            class="w-full border-slate-600 py-3 rounded-lg font-semibold border transform hover:scale-[1.02] transition shadow-md hover:cursor-pointer">
                            돌아가기
                        </button>
                    </RouterLink>
                </form>
            </div>
        </div>
    </div>
</template>

<style scoped></style>