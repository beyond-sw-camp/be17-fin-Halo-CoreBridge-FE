<script setup lang="ts">
import { ref, reactive, type Ref } from 'vue'
import authAPI from '@/api/auth'
import userAPI from '@/api/user'
import { UserRound, Mail, LockKeyhole, Eye, EyeOff, Calendar, Phone, Check } from 'lucide-vue-next'
import type { UserForm, UserFormErrors } from '@/types/user/UserForm'
import { genders } from '@/types/user/Gender'
import router from '@/router'

const formData: UserForm = reactive({
    name: '',
    email: '',
    birth: '',
    gender: '',
    phone: '',
    password: '',
})

const selectGender = (gender: string) => {
    formData.gender = gender
}

const confirmPassword: Ref<string> = ref('')

const showPassword = ref(false)
const showConfirmPassword = ref(false)
const agreeTerms = ref(false)

const initialErrors: UserFormErrors = reactive({
    name: '',
    email: '',
    birth: '',
    gender: '',
    phone: '',
    password: '',
    confirmPassword: '',
    verificationCode: '',
    terms: '',
})

const errors: UserFormErrors = reactive({ ...initialErrors })

// 이메일 인증 관련
const verificationSent = ref(false)
const verificationCode = ref('')
const emailVerified = ref(false)

const sendVerificationCode = async () => {

    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
        errors.email = '올바른 이메일을 입력해주세요'
        return
    }

    const response: ApiResponse = await authAPI.sendAuthCodeToEmail({ email: formData.email })
    if (response.success) {
        alert('인증 코드가 전송되었습니다. 이메일을 확인해주세요.');
        verificationSent.value = true
    } else {
        alert(response.message);
    }

}

const verifyEmail = async () => {
    // 실제로는 여기서 API로 인증번호 확인
    const response: ApiResponse = await authAPI.verifyEmailCode({
        email: formData.email,
        code: verificationCode.value
    })

    if (response.success) {
        emailVerified.value = true
        alert('이메일 인증이 완료되었습니다!')
        errors.verificationCode = ''
    } else {
        console.log(response)
        errors.verificationCode = response.message
    }
}

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

    if (!formData.email.trim()) {
        errors.email = '이메일을 입력해주세요'
        valid = false
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        errors.email = '올바른 이메일 형식이 아닙니다'
        valid = false
    }

    if (!emailVerified.value) {
        errors.email = '이메일 인증을 완료해주세요'
        valid = false
    }

    if (!formData.birth) {
        errors.birth = '생년월일을 선택해주세요'
        valid = false
    }

    if (!formData.gender) {
        errors.gender = '성별을 선택해주세요'
        valid = false
    }

    if (!formData.phone) {
        errors.phone = '휴대폰 번호를 입력해주세요'
        valid = false
    } else if (!/^010-\d{4}-\d{4}$/.test(formData.phone)) {
        errors.phone = '올바른 휴대폰 번호 형식이 아닙니다'
        valid = false
    }

    if (!formData.password) {
        errors.password = '비밀번호를 입력해주세요'
        valid = false
    } else if (formData.password.length < 8) {
        errors.password = '비밀번호는 8자 이상이어야 합니다'
        valid = false
    }

    if (formData.password !== confirmPassword.value) {
        errors.confirmPassword = '비밀번호가 일치하지 않습니다'
        valid = false
    }

    if (!agreeTerms.value) {
        errors.terms = '이용약관에 동의해주세요'
        valid = false
    }

    return valid
}

/**
 * 회원 가입 처리
 */
const handleSubmit = async () => {

    if (validateForm()) {
        // 회원가입 처리
        const response = await userAPI.requestSignup(formData)
        if (response.success) {
            alert('회원가입이 완료되었습니다! 🎉')
            // 추가로 로그인 페이지로 리다이렉트 등 처리

            router.push({ name: 'login' })
        } else {
            alert('회원가입에 실패했습니다: ' + response.message)
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
                    <h1 class="text-3xl font-bold text-gray-900 mb-2">회원가입</h1>
                </div>

                <!-- 폼 -->
                <form @submit.prevent="handleSubmit" class="space-y-5">
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

                    <!-- 이메일 입력 및 인증 -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">이메일</label>
                        <div class="flex gap-2">
                            <div class="relative flex-1">
                                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail class="w-5 h-5 text-gray-400" />
                                </div>
                                <input v-model="formData.email" type="email" :disabled="emailVerified"
                                    :class="['block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition', errors.email ? 'border-red-300' : emailVerified ? 'border-green-300 bg-green-50' : 'border-gray-300']"
                                    placeholder="example@email.com" />
                            </div>
                            <button v-if="!emailVerified" type="button" @click="sendVerificationCode"
                                :disabled="!formData.email || verificationSent"
                                class="px-4 py-3 bg-slate-600 text-white rounded-lg font-medium hover:bg-slate-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition whitespace-nowrap text-sm">
                                인증 요청
                            </button>
                            <div v-else class="flex items-center px-3 bg-green-50 rounded-lg border border-green-300">
                                <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        </div>
                        <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
                        <p v-if="verificationSent && !emailVerified" class="mt-1 text-sm text-slate-600">인증번호가 발송되었습니다
                        </p>
                    </div>

                    <!-- 이메일 인증번호 입력 -->
                    <div v-if="verificationSent && !emailVerified">
                        <label class="block text-sm font-medium text-gray-700 mb-2">인증번호</label>
                        <div class="flex gap-2">
                            <input v-model="verificationCode" type="text" maxlength="6"
                                :class="['flex-1 block w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition', errors.verificationCode ? 'border-red-300' : 'border-gray-300']"
                                placeholder="6자리 인증번호" />
                            <button type="button" @click="verifyEmail"
                                class="px-4 py-3 bg-slate-600 text-white rounded-lg font-medium hover:bg-slate-700 transition whitespace-nowrap text-sm">
                                확인
                            </button>
                        </div>
                        <p v-if="errors.verificationCode" class="mt-1 text-sm text-red-600">
                            {{ errors.verificationCode }}
                        </p>
                    </div>

                    <!-- 생년월일 -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">생년월일</label>
                        <div class="relative">
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Calendar class="w-5 h-5 text-gray-400" />
                            </div>
                            <input v-model="formData.birth" type="date"
                                :class="['block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition', errors.birth ? 'border-red-300' : 'border-gray-300']" />
                        </div>
                        <p v-if="errors.birth" class="mt-1 text-sm text-red-600">{{ errors.birth }}</p>
                    </div>

                    <!-- 성별 선택 -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">성별</label>
                        <div class="grid grid-cols-2 gap-3">
                            <button type="button" @click="selectGender(gender.code)" v-for="gender in genders"
                                :key="gender.code"
                                :class="['py-3 px-4 border-2 rounded-lg font-medium transition flex items-center justify-center gap-2', formData.gender === gender.code ? 'border-slate-600 bg-slate-50 text-slate-700' : 'border-gray-300 text-gray-700 hover:border-gray-400']">
                                <UserRound class="w-5 h-5 text-gray-400" />
                                {{ gender.name }}
                            </button>
                        </div>
                        <p v-if="errors.gender" class="mt-1 text-sm text-red-600">{{ errors.gender }}</p>
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

                    <!-- 비밀번호 입력 -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">비밀번호</label>
                        <div class="relative">
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <LockKeyhole class="w-5 h-5 text-gray-400" />
                            </div>
                            <input v-model="formData.password" :type="showPassword ? 'text' : 'password'"
                                :class="['block w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition', errors.password ? 'border-red-300' : 'border-gray-300']"
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
                            <input v-model="confirmPassword" :type="showConfirmPassword ? 'text' : 'password'"
                                :class="['block w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition', errors.confirmPassword ? 'border-red-300' : 'border-gray-300']"
                                placeholder="비밀번호 재입력" />
                            <button type="button" @click="showConfirmPassword = !showConfirmPassword"
                                class="absolute inset-y-0 right-0 pr-3 flex items-center">
                                <EyeOff v-if="showConfirmPassword" class="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                <Eye v-else class="h-5 w-5 text-gray-400 hover:text-gray-600" />
                            </button>
                        </div>
                        <p v-if="errors.confirmPassword" class="mt-1 text-sm text-red-600">{{ errors.confirmPassword }}
                        </p>
                    </div>

                    <!-- 약관 동의 -->
                    <div>
                        <label class="flex items-start cursor-pointer">
                            <div class="relative flex items-center">
                                <input v-model="agreeTerms" type="checkbox" class="sr-only" />
                                <div
                                    :class="['w-5 h-5 border-2 rounded flex items-center justify-center transition', agreeTerms ? 'bg-slate-600 border-slate-600' : errors.terms ? 'border-red-300' : 'border-gray-300']">
                                    <Check v-if="agreeTerms" class="w-3 h-3 text-white">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3"
                                            d="M5 13l4 4L19 7" />
                                    </Check>
                                </div>
                            </div>
                            <span class="ml-3 text-sm text-gray-700">
                                <a href="#" class="text-slate-600 hover:text-slate-700 font-medium">이용약관</a> 및
                                <a href="#" class="text-slate-600 hover:text-slate-700 font-medium">개인정보처리방침</a>에 동의합니다
                            </span>
                        </label>
                        <p v-if="errors.terms" class="mt-1 text-sm text-red-600">{{ errors.terms }}</p>
                    </div>

                    <!-- 가입 버튼 -->
                    <button type="submit"
                        class="w-full bg-slate-600 text-white py-3 rounded-lg font-semibold hover:bg-slate-700 transform hover:scale-[1.02] transition shadow-lg">
                        회원가입
                    </button>
                </form>

                <!-- 로그인 링크 -->
                <div class="mt-6 text-center">
                    <p class="text-sm text-gray-600">
                        이미 계정이 있으신가요?
                        <a href="#" class="text-slate-600 hover:text-slate-700 font-semibold">로그인</a>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>