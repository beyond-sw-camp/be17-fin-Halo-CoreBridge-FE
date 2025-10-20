<template>
    <div class="p-8 bg-slate-50 min-h-screen text-slate-800">
        <header class="mb-10">
            <h1 class="text-3xl font-bold text-slate-800 mb-2">채용 공고 관리</h1>
            <p class="text-slate-600">진행 중인 공고와 지원자 현황을 한눈에 확인하세요.</p>
        </header>

        <!-- Summary Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <div v-for="(card, i) in summaryCards" :key="i"
                class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition">
                <div class="flex items-center justify-between mb-4">
                    <div>
                        <p class="text-slate-500 text-sm">{{ card.label }}</p>
                        <p class="text-2xl font-bold text-slate-800 mt-1">{{ card.value }}</p>
                    </div>
                    <div class="bg-slate-100 p-3 rounded-full">
                        <component :is="card.icon" class="text-slate-600" size="24" />
                    </div>
                </div>
                <div class="text-sm flex items-center">
                    <span :class="card.trend === 'up' ? 'text-green-600' : 'text-red-600'">
                        {{ card.trend === 'up' ? '▲' : '▼' }} {{ card.change }}
                    </span>
                    <span class="text-slate-500 ml-1">{{ card.description }}</span>
                </div>
            </div>
        </div>

        <!-- Active Job Postings -->
        <section class="mb-12">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-xl font-semibold text-slate-800">진행 중인 채용 공고</h2>
                <button class="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition font-medium">
                    + 새 공고 등록
                </button>
            </div>

            <div class="flex flex-col gap-6">
                <div v-for="(job, i) in jobs" :key="i"
                    class="bg-white rounded-lg shadow border border-slate-200 hover:shadow-lg transition p-6">
                    <div class="flex justify-between items-start mb-3">
                        <h3 class="text-lg font-semibold text-slate-800">{{ job.title }}</h3>
                        <span :class="[
                            'px-2 py-1 text-xs font-medium rounded',
                            job.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'
                        ]">
                            {{ job.status === 'active' ? '진행중' : '마감' }}
                        </span>
                    </div>
                    <p class="text-slate-600 text-sm mb-4">{{ job.team }}</p>
                    <div class="flex justify-between items-center border-t border-slate-200 pt-3">
                        <div class="flex items-center text-sm text-slate-600">
                            <Users size="16" class="mr-1" /> {{ job.applicants }}명 지원
                        </div>
                        <button class="text-slate-600 hover:text-slate-800 font-medium text-sm">상세보기 →</button>
                    </div>
                </div>
            </div>
        </section>

    </div>
</template>

<script setup lang="ts">
import { Users, Briefcase, Calendar, TrendingUp } from 'lucide-vue-next'

const summaryCards = [
    { label: '진행중 공고', value: '12개', change: '+3', trend: 'up', description: '이번 주 신규', icon: Briefcase },
    { label: '신규 지원자', value: '48명', change: '+12%', trend: 'up', description: '지난주 대비', icon: Users },
    { label: '예정된 면접', value: '7건', change: '+2', trend: 'up', description: '이번 주', icon: Calendar },
    { label: '최종 합격률', value: '68%', change: '+5%', trend: 'up', description: '지난달 대비', icon: TrendingUp },
]

const jobs = [
    { title: '프론트엔드 개발자', team: '개발팀', applicants: 24, status: 'active' },
    { title: '백엔드 개발자', team: '서버팀', applicants: 18, status: 'active' },
    { title: 'UX 디자이너', team: '디자인팀', applicants: 15, status: 'active' },
    { title: '프로덕트 매니저', team: '기획팀', applicants: 12, status: 'closed' },
]

const candidates = [
    { name: '김철수', position: '프론트엔드 개발자', stage: '1차 면접', date: '2025.10.10', score: 'A' },
    { name: '이영희', position: '백엔드 개발자', stage: '2차 면접', date: '2025.10.08', score: 'A+' },
    { name: '박민수', position: 'UX 디자이너', stage: '서류 검토', date: '2025.10.12', score: 'B+' },
    { name: '정지은', position: '프로덕트 매니저', stage: '최종 합격', date: '2025.10.05', score: 'A' },
]
</script>
