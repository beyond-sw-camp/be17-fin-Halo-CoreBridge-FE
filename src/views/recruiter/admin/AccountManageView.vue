<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Search, Plus } from 'lucide-vue-next'
import AccountDropdown from '@/components/recruiter-dashboard/accounts/AccountDropdown.vue'
import AccountCreateModal from '@/components/recruiter-dashboard/accounts/AccountCreateModal.vue'
import adminAPI from '@/api/admin'
import type { AccountListResponse, AccountParam } from '@/types/user/Account'
import PaginationComp from '@/components/common/PaginationComp.vue'


const accounts = ref<AccountListResponse>({
    accounts: [],
    totalElements: 0,
    totalPages: 0,
    currentPage: 0,
})

const extractInitial = (name: string) => {
    return name.charAt(0).toUpperCase()
}

const isOpenModal = ref(false)
const openCreateModal = () => {
    isOpenModal.value = true
}

const closeModal = () => {
    isOpenModal.value = false
}

const deleteAccount = async (id: number) => {

    if (confirm('계정을 삭제하시겠습니까?')) {
        const response = await adminAPI.requestDeleteAccount(id)
        if (response.success) {
            alert('계정이 성공적으로 삭제되었습니다.')
            // 계정 삭제 후 목록 갱신
            await loadAccounts()
        } else {
            alert('계정 삭제에 실패했습니다. 다시 시도해주세요.')
        }
    }
}

const initAccounts = () => {
    accounts.value.accounts = []
    accounts.value.totalElements = 0
    accounts.value.totalPages = 0
    accounts.value.currentPage = 0
}

const setAccounts = (data: AccountListResponse) => {
    accounts.value.accounts = data.accounts
    accounts.value.totalElements = data.totalElements
    accounts.value.totalPages = data.totalPages
    accounts.value.currentPage = data.currentPage
}

onMounted(async () => {
    await loadAccounts()
})

const loadAccounts = async () => {
    const response = await adminAPI.requestAccounts(req.value)

    if (response.success) {
        setAccounts(response.results)
    } else {
        initAccounts()
    }
}


/**
 * ============================================
 * 권한 옵션
 * ============================================
 */

const roleOptions = ['전체', '채용 담당자', '면접관']
const selectedRole = ref<string>(roleOptions[0])

const onRoleChange = async (event: Event) => {
    const target = event.target as HTMLSelectElement
    selectedRole.value = target.value

    req.value.type = selectedRole.value

    const response = await adminAPI.requestAccounts(req.value)

    if (response.success) {
        setAccounts(response.results)
    } else {
        initAccounts()
    }
}

/**
 * ============================================
 * 페이지네이션
 * ============================================
 */
const onUpdatePage = async (newPage: number) => {

    req.value.page = newPage - 1

    const response = await adminAPI.requestAccounts(req.value)

    if (response.success) {
        setAccounts(response.results)
    } else {
        initAccounts()
    }
}

/**
 * ============================================
 * 검색
 * ============================================
 */

const searchQuery = ref('')

const onSearch = async () => {

    req.value.search = searchQuery.value
    req.value.page = 0

    const response = await adminAPI.requestAccounts(req.value)

    if (response.success) {
        setAccounts(response.results)
    } else {
        initAccounts()
    }
}

const req = ref<AccountParam>({
    type: selectedRole.value,
    page: accounts.value.currentPage,
    search: searchQuery.value,
})

</script>
<template>
    <AccountCreateModal @close="closeModal" :open-modal="isOpenModal" />
    <div class="min-h-screen flex flex-col">
        <!-- Header -->
        <header class="mb-3">
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-3xl font-bold text-slate-600 mb-2">계정 목록</h1>
                    <p class="text-sm text-slate-500 mt-1">전체 계정을 관리하세요</p>
                </div>
                <button @click="openCreateModal"
                    class="hover:cursor-pointer px-6 py-2.5 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white rounded-xl font-medium flex items-center space-x-2 shadow-sm transition-all">
                    <Plus :size="16" />
                    <span>계정 등록</span>
                </button>
            </div>
        </header>

        <!-- Content -->
        <main class="flex-1 flex flex-col">
            <!-- Filters -->
            <div class="bg-white rounded-2xl p-6 border border-slate-200 mb-6">
                <div class="flex gap-4">
                    <form class="relative flex-1" @submit.prevent="onSearch">
                        <Search :size="20" class="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                        <input type="text" placeholder="이름 또는 이메일로 검색" v-model="searchQuery"
                            class="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-600 focus:border-transparent transition-all" />
                    </form>
                    <select v-model="selectedRole" @change="onRoleChange"
                        class="hover:cursor-pointer px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-600 transition-all">
                        <option v-for="role in roleOptions" :key="role" :value="role">
                            {{ role }}
                        </option>
                    </select>
                </div>
                <div class="flex items-center justify-between mt-4 pt-4 border-t border-slate-200">
                    <p class="text-sm text-slate-600">
                        총 <span class="font-bold text-slate-800">{{ accounts.totalElements }}</span>개의 계정
                    </p>
                </div>
            </div>

            <!-- account Cards -->
            <div class="flex flex-col space-y-4 mb-8">
                <div v-if="accounts.totalElements == 0" class="text-center text-slate-500">등록된 계정이 없습니다.</div>
                <div v-for="account in accounts.accounts" :key="account.id"
                    class="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-lg transition-all ">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-6 flex-1 justify-between">

                            <!-- Applicant Info -->
                            <div class="flex items-center space-x-4">
                                <div
                                    class="w-12 h-12 bg-gradient-to-br from-slate-600 to-slate-800 rounded-xl flex items-center justify-center">
                                    <span class="text-white font-semibold">{{ extractInitial(account.name) }}</span>
                                </div>
                                <div>
                                    <h3 class="font-semibold text-slate-800 mb-1">
                                        {{ account.name }} | {{ account.email }}
                                    </h3>
                                    <p class="text-sm text-slate-500">{{ account.roleType }}</p>
                                </div>
                            </div>

                            <!-- account Info -->
                            <div>
                                <p class="font-sm text-slate-800 mb-1">등록일</p>
                                <!-- Date & Time -->
                                <p class="text-xs font-bold text-slate-800">{{ account.createdAt }}</p>
                            </div>
                        </div>

                        <!-- Actions -->
                        <div class="flex items-center space-x-3">
                            <AccountDropdown @delete-menu-click="deleteAccount(account.id)" />
                        </div>
                    </div>
                </div>
            </div>

            <div class="mt-auto pt-6 mb-3">
                <!-- Pagination -->
                <PaginationComp v-if="accounts.totalPages > 1" :total-pages="accounts.totalPages"
                    :current-page="accounts.currentPage + 1" :group-size="10" @update:current-page="onUpdatePage" />
            </div>

        </main>
    </div>
</template>

<style scoped></style>
