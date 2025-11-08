<script setup lang="ts">
import { ref, computed, type Ref, reactive } from 'vue'
import { defineProps, defineEmits } from 'vue'
import { UserRoundPlus, X } from 'lucide-vue-next'
import type { UserForSystemForm, UserForSystemFormErrors } from '@/types/user/UserForm'
import adminAPI from '@/api/admin'

const props = defineProps({
    openModal: Boolean,
})

const emits = defineEmits(['close'])

const formData = reactive<UserForSystemForm>({
    name: '',
    email: '',
    roleType: ''
})

const roleOptions = ['채용 담당자', '면접관']

const isOpen = computed(() => {
    return props.openModal
})

const close: Ref<Boolean> = ref(isOpen)

const initialErrors: UserForSystemFormErrors = reactive({
    name: '',
    email: '',
    roleType: '',
    global: ''
})

const errors: UserForSystemFormErrors = reactive({ ...initialErrors })

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

    if (!formData.roleType) {
        errors.roleType = '권한을 선택해주세요'
        valid = false
    }

    return valid
}


const handleAccountCreate = async () => {

    if (!validateForm()) {
        return
    }

    const response = await adminAPI.requestAccountAdd(formData)
    if (response.success) {
        alert('계정이 생성되었습니다')
        handleClose()
    } else {
        errors.global = response.message
    }

}

const handleClose = () => {
    close.value = false
    emits('close')
}

const onRoleChange = (event: Event) => {
    const selectedRole = (event.target as HTMLSelectElement).value
    formData.roleType = selectedRole
}
</script>
<template>
    <div v-if="close" class="fixed inset-0 bg-black/50 flex items-center justify-center p-8 z-40">
        <div
            class="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col">

            <!-- header -->
            <Header class="px-8 py-6 border-b border-slate-200">
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                        <div
                            class="w-12 h-12 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl flex items-center justify-center">
                            <UserRoundPlus :size="24" class="text-white" />
                        </div>
                        <div>
                            <h1 class="text-2xl font-bold text-slate-800">계정 등록</h1>
                            <p class="text-sm text-slate-500">계정을 등록하세요</p>
                        </div>
                    </div>
                    <button @click="handleClose"
                        class="p-2 hover:bg-slate-100 rounded-xl transition-all hover:cursor-pointer">
                        <X :size="24" class="text-slate-600" />
                    </button>
                </div>
            </Header>

            <div class=" bg-white p-6">
                <div class="flex flex-col gap-5 bg-slate-50 rounded-xl p-6 border border-slate-200">
                    <p v-if="errors.global" class="mt-2 text-red-600">{{ errors.global }}</p>
                    <div>
                        <h3 class="font-bold text-slate-800 mb-4 flex items-center w-full">
                            <User :size="16" class="mr-2" />
                            계정 권한
                        </h3>
                        <div>
                            <select v-model="formData.roleType" @change="onRoleChange"
                                class="w-full px-4 py-3 border  rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-600 bg-white"
                                :class="[errors.roleType ? 'border-red-300' : 'border-slate-300']">
                                <option :value="null">권한을 선택하세요</option>
                                <option v-for="role in roleOptions" :key="role" :value="role">
                                    {{ role }}
                                </option>
                            </select>
                        </div>
                        <p v-if="errors.roleType" class="mt-2 text-red-600">{{ errors.roleType }}</p>
                    </div>

                    <div class="flex justify-between gap-5">
                        <div class="flex-1">
                            <h3 class="font-bold text-slate-800 mb-4 flex items-center w-full">
                                <User :size="16" class="mr-2" />
                                이메일
                            </h3>
                            <div>
                                <input v-model="formData.email" type="email" placeholder="이메일을 입력하세요"
                                    class="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-600 bg-white"
                                    :class="[errors.email ? 'border-red-300' : 'border-slate-300']" />
                            </div>
                            <p v-if="errors.email" class="mt-2 text-red-600">{{ errors.email }}</p>
                        </div>
                        <div class="flex-1">
                            <h3 class="font-bold text-slate-800 mb-4 flex items-center">
                                <User :size="16" class="mr-2" />
                                이름
                            </h3>
                            <div>
                                <input v-model="formData.name" type="text" placeholder="이름을 입력하세요"
                                    class="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-600 bg-white"
                                    :class="[errors.name ? 'border-red-300' : 'border-slate-300']" required />
                            </div>
                            <p v-if="errors.name" class="mt-2 text-red-600">{{ errors.name }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Footer -->
            <footer class="px-8 py-6 border-t border-slate-300 bg-white rounded-b-2xl">
                <button type="submit"
                    class="w-full text-xl hover:cursor-pointer px-8 py-5 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white rounded-xl font-medium shadow-lg transition-all"
                    @click="handleAccountCreate">
                    계정 등록
                </button>
            </footer>
        </div>
    </div>
</template>
<style></style>
