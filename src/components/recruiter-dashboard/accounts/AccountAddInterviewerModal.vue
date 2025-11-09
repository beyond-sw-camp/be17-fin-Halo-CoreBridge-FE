<script setup lang="ts">
import { ref, computed, type Ref, watch } from 'vue'
import { defineProps, defineEmits } from 'vue'
import { UserRoundPlus, X, Search } from 'lucide-vue-next'
import adminAPI from '@/api/admin'
import type { Account, AccountInifiniteScrollResponse, AccountParam } from '@/types/user/Account'
import ScrollObserver from '@/components/ScrollObserver.vue'

const props = defineProps({
    openModal: Boolean,
})

const emits = defineEmits(['close', 'add'])

const isOpen = computed(() => {
    return props.openModal
})

const close: Ref<Boolean> = ref(isOpen)


const handleAccountCreate = async () => {

    if (selectedAccounts.value.length === 0) {
        alert('최소 1명 이상의 면접관을 선택해주세요')
        return
    }

    // 선택된 계정들을 부모 컴포넌트로 전달
    emits('add', selectedAccounts.value)
    handleClose()
}

const handleClose = () => {
    close.value = false
    selectedAccounts.value = [] // 선택 초기화
    searchQuery.value = '' // 검색어 초기화
    initAccounts() // 계정 리스트 초기화
    emits('close')
}

const interviewerAccounts = ref<AccountInifiniteScrollResponse>({
    accounts: [],
    currentPage: 0,
    hasNext: false
})

// 선택된 계정들을 저장하는 ref
const selectedAccounts = ref<Account[]>([])

// 특정 계정이 선택되었는지 확인
const isSelected = (accountId: number): boolean => {
    return selectedAccounts.value.some(account => account.id === accountId)
}

// 체크박스 토글 핸들러
const toggleAccount = (account: Account) => {
    const index = selectedAccounts.value.findIndex(a => a.id === account.id)

    if (index > -1) {
        // 이미 선택된 경우 제거
        selectedAccounts.value.splice(index, 1)
    } else {
        // 선택되지 않은 경우 추가
        selectedAccounts.value.push(account)
    }
}

const extractInitial = (name: string): string => {
    return name.charAt(0).toUpperCase()
}

const searchQuery = ref('')


const onSearch = async () => {

    const req: AccountParam = {
        search: searchQuery.value,
        page: 0,
        type: undefined
    }

    const response = await adminAPI.requestInterviewerAccounts(req)

    if (response.success) {
        interviewerAccounts.value.accounts = response.results.accounts
        interviewerAccounts.value.currentPage = response.results.currentPage
        interviewerAccounts.value.hasNext = response.results.hasNext
    } else {
        initAccounts()
    }

}

const initAccounts = () => {
    interviewerAccounts.value = {
        accounts: [],
        currentPage: 0,
        hasNext: false
    }
}

const setAccounts = (data: AccountInifiniteScrollResponse) => {
    interviewerAccounts.value.accounts.push(...data.accounts)
    interviewerAccounts.value.currentPage = data.currentPage
    interviewerAccounts.value.hasNext = data.hasNext
}

watch(isOpen, async (val) => {

    if (val) {

        const req: AccountParam = {
            search: '',
            page: 0,
            type: undefined
        }

        const response = await adminAPI.requestInterviewerAccounts(req)
        if (response.success) {
            interviewerAccounts.value.accounts = response.results.accounts
            interviewerAccounts.value.currentPage = response.results.currentPage
            interviewerAccounts.value.hasNext = response.results.hasNext
        } else {
            initAccounts()
        }

    }
})

const loadMore = async () => {

    // hasNext가 false면 더 이상 로드하지 않음
    if (!interviewerAccounts.value.hasNext) {
        return
    }

    const req: AccountParam = {
        search: searchQuery.value,
        page: interviewerAccounts.value.currentPage + 1,
        type: undefined
    }

    const response = await adminAPI.requestInterviewerAccounts(req)
    if (response.success) {
        setAccounts(response.results)
    } else {
        initAccounts()
    }

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
                            <h1 class="text-2xl font-bold text-slate-800">면접관 추가</h1>
                            <p class="text-sm text-slate-500">
                                면접관을 선택해주세요
                                <span v-if="selectedAccounts.length > 0" class="text-slate-700 font-semibold">
                                    ({{ selectedAccounts.length }}명 선택됨)
                                </span>
                            </p>
                        </div>
                    </div>
                    <button @click="handleClose"
                        class="p-2 hover:bg-slate-100 rounded-xl transition-all hover:cursor-pointer">
                        <X :size="24" class="text-slate-600" />
                    </button>
                </div>
            </Header>

            <div class="bg-white p-6 mb-6">
                <div class="flex gap-4">
                    <form class="relative flex-1" @submit.prevent="onSearch">
                        <Search :size="20" class="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                        <input type="text" placeholder="면접관 이름 검색" v-model="searchQuery"
                            class="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-600 focus:border-transparent transition-all" />
                    </form>
                </div>
            </div>

            <!-- account Cards -->
            <div class="flex flex-col space-y-4 mb-8 px-6 overflow-y-auto">
                <div v-if="interviewerAccounts.accounts.length == 0" class="text-center text-slate-500">
                    시스템에 등록된 면접관이 없습니다.
                </div>
                <div v-for="account in interviewerAccounts.accounts" :key="account.id" @click="toggleAccount(account)"
                    :class="[
                        'bg-white rounded-2xl p-4 border shadow hover:shadow-lg transition-all cursor-pointer mt-2',
                        isSelected(account.id)
                            ? 'border-slate-600 bg-slate-50 ring-2 ring-slate-600'
                            : 'border-slate-300 hover:border-slate-400'
                    ]">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-6 flex-1 justify-between">

                            <!-- Applicant Info -->
                            <div class="flex items-center space-x-4">
                                <!-- Checkbox -->
                                <div class="flex items-center">
                                    <input type="checkbox" :checked="isSelected(account.id)"
                                        @click.stop="toggleAccount(account)"
                                        class="w-5 h-5 rounded border-slate-300 text-slate-600 focus:ring-slate-600 focus:ring-2 cursor-pointer transition-all" />
                                </div>

                                <div :class="[
                                    'w-10 h-10 rounded-xl flex items-center justify-center transition-all',
                                    isSelected(account.id)
                                        ? 'bg-gradient-to-br from-slate-700 to-slate-900'
                                        : 'bg-gradient-to-br from-slate-600 to-slate-800'
                                ]">
                                    <span class="text-white font-semibold">{{ extractInitial(account.name) }}</span>
                                </div>
                                <div>
                                    <h3 :class="[
                                        'font-semibold mb-1 transition-colors',
                                        isSelected(account.id) ? 'text-slate-900' : 'text-slate-800'
                                    ]">
                                        {{ account.name }}
                                    </h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <ScrollObserver @show="loadMore" />
            </div>

            <!-- Footer -->
            <footer class="px-8 py-6 border-t border-slate-300 bg-white rounded-b-2xl">
                <button type="submit" :disabled="selectedAccounts.length === 0" :class="[
                    'w-full text-xl px-8 py-5 text-white rounded-xl font-medium shadow-lg transition-all',
                    selectedAccounts.length > 0
                        ? 'bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 hover:cursor-pointer'
                        : 'bg-slate-400 cursor-not-allowed'
                ]" @click="handleAccountCreate">
                    면접관 추가 {{ selectedAccounts.length > 0 ? `(${selectedAccounts.length}명)` : '' }}
                </button>
            </footer>
        </div>
    </div>
</template>
<style></style>