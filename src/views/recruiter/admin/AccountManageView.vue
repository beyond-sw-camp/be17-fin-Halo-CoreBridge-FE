<script setup lang="ts">
import { ref } from 'vue'
import { Search, Plus, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import AccountDropdown from '@/components/recruiter-dashboard/accounts/AccountDropdown.vue'
import AccountCreateModal from '@/components/recruiter-dashboard/accounts/AccountCreateModal.vue'

interface Account {
    id: number
    name: string
    email: string
    createAt: string
    roleType: string
}

const accounts = ref<Account[]>([])

const extractInitial = (name: string) => {
    const names = name.split('')
    let initials = ''
    names.forEach(n => {
        initials += n.charAt(0).toUpperCase()
    })
    return initials
}

const isOpenModal = ref(false)
const openCreateModal = () => {
    isOpenModal.value = true
}

const closeModal = () => {
    isOpenModal.value = false
}

const deleteAccount = (id: number) => {
}

</script>
<template>
    <AccountCreateModal @close="closeModal" :open-modal="isOpenModal" />
    <div class="min-h-screen ">
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
        <main>
            <!-- Filters -->
            <div class="bg-white rounded-2xl p-6 border border-slate-200 mb-6">
                <div class="flex gap-4">
                    <div class="relative flex-1">
                        <Search :size="20" class="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                        <input type="text" placeholder="이름 또는 이메일로 검색"
                            class="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-600 focus:border-transparent transition-all" />
                    </div>
                    <select
                        class="px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-600 transition-all">
                        <option>전체</option>
                        <option>채용 담당자</option>
                        <option>면접관</option>
                    </select>
                </div>
                <div class="flex items-center justify-between mt-4 pt-4 border-t border-slate-200">
                    <p class="text-sm text-slate-600">
                        총 <span class="font-bold text-slate-800">156</span>개의 계정
                    </p>
                </div>
            </div>

            <!-- account Cards -->
            <div class="flex flex-col space-y-4 mb-8">
                <div v-for="account in accounts" :key="account.id"
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
                                    <h3 class="font-semibold text-slate-800 mb-1">{{ account.name }} |
                                        admin01@core-bridge.co.kr</h3>
                                    <p class="text-sm text-slate-500">{{ account.roleType }}</p>
                                </div>
                            </div>

                            <!-- account Info -->
                            <div class="w-44">
                                <p class="text-sm font-medium text-slate-800 mb-1">등록일</p>
                                <!-- Date & Time -->
                                <p class="text-lg font-bold text-slate-800">{{ account.createAt }}</p>
                            </div>
                        </div>

                        <!-- Actions -->
                        <div class="flex items-center space-x-3">
                            <AccountDropdown @delete-menu-click="deleteAccount(account.id)" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- Pagination -->
            <div class="mt-8 flex items-center justify-center">
                <div class="flex items-center space-x-2">
                    <button class="p-2 hover:bg-slate-100 rounded-xl transition-all disabled:opacity-50" disabled>
                        <ChevronLeft :size="20" />
                    </button>
                    <button class="px-4 py-2 bg-slate-600 text-white rounded-xl font-medium">1</button>
                    <button class="px-4 py-2 hover:bg-slate-100 rounded-xl font-medium transition-all">2</button>
                    <button class="px-4 py-2 hover:bg-slate-100 rounded-xl font-medium transition-all">3</button>
                    <button class="px-4 py-2 hover:bg-slate-100 rounded-xl font-medium transition-all">4</button>
                    <button class="p-2 hover:bg-slate-100 rounded-xl transition-all">
                        <ChevronRight :size="20" />
                    </button>
                </div>
            </div>
        </main>
    </div>
</template>

<style scoped></style>
