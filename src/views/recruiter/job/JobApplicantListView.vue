<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { ArrowLeft, Users, FileText, CheckCircle, Clock, Search, Filter } from 'lucide-vue-next';
import ApplicantListCard from '@/components/applicant/ApplicantListCard.vue';

import {
    Building2,
    MapPin,
    Briefcase,
    DollarSign,
    Calendar,
    User,
    Mail
} from 'lucide-vue-next'

interface Applicant {
    id: number;
    name: string;
    email: string;
    appliedAt: string;
    status: string;
    statusColor: string;
    careerYears: number;
    education: string;
    certificates: number;
    skills: string[];
}


// Applicant List Data (from ApplicantListView)
const applicants = ref<Applicant[]>([
    {
        id: 1,
        name: '김철수',
        email: 'kimcs@email.com',
        appliedAt: '2024-10-10',
        status: '서류 심사',
        statusColor: 'blue',
        careerYears: 3,
        education: '학사',
        certificates: 2,
        skills: ['Vue.js', 'TypeScript', 'React', 'Node.js', 'Git']
    },
    {
        id: 2,
        name: '이영희',
        email: 'leeyh@email.com',
        appliedAt: '2024-10-12',
        status: '서류 통과',
        statusColor: 'green',
        careerYears: 5,
        education: '석사',
        certificates: 3,
        skills: ['React', 'TypeScript', 'Next.js', 'GraphQL', 'AWS']
    },
    {
        id: 3,
        name: '박민수',
        email: 'parkms@email.com',
        appliedAt: '2024-10-13',
        status: '면접 대기',
        statusColor: 'yellow',
        careerYears: 2,
        education: '학사',
        certificates: 1,
        skills: ['Vue.js', 'JavaScript', 'CSS', 'HTML', 'Figma']
    },
    {
        id: 4,
        name: '정수진',
        email: 'jeongsj@email.com',
        appliedAt: '2024-10-14',
        status: '서류 심사',
        statusColor: 'blue',
        careerYears: 4,
        education: '학사',
        certificates: 2,
        skills: ['Angular', 'TypeScript', 'RxJS', 'SCSS', 'Docker']
    },
    {
        id: 5,
        name: '최준호',
        email: 'choijh@email.com',
        appliedAt: '2024-10-11',
        status: '서류 통과',
        statusColor: 'green',
        careerYears: 6,
        education: '석사',
        certificates: 4,
        skills: ['React', 'Vue.js', 'TypeScript', 'Webpack', 'Jest']
    }
]);

const searchQuery = ref('');
const statusFilter = ref('all');

const statusOptions = [
    { value: 'all', label: '전체' },
    { value: 'pending', label: '서류 심사' },
    { value: 'passed', label: '서류 통과' },
    { value: 'interview', label: '면접 대기' },
    { value: 'rejected', label: '불합격' }
];

// Computed
const filteredApplicants = computed(() => {
    return applicants.value.filter(applicant => {
        const matchesSearch = applicant.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            applicant.email.toLowerCase().includes(searchQuery.value.toLowerCase());
        const matchesStatus = statusFilter.value === 'all' || applicant.status === getStatusLabel(statusFilter.value);
        return matchesSearch && matchesStatus;
    });
});

const stats = computed(() => ({
    total: applicants.value.length,
    pending: applicants.value.filter(a => a.status === '서류 심사').length,
    passed: applicants.value.filter(a => a.status === '서류 통과').length,
    interview: applicants.value.filter(a => a.status === '면접 대기').length
}));

// Methods
const getStatusLabel = (status: string): string => {
    const statusMap: { [key: string]: string } = {
        'pending': '서류 심사',
        'passed': '서류 통과',
        'interview': '면접 대기',
        'rejected': '불합격'
    };
    return statusMap[status] || '';
};

const viewApplicantDetail = (id: number) => {
    console.log('지원자 상세 보기:', id);
    // router.push(`/recruiter/applicant/${id}`)
};

const activeTab = ref('info');

const tabs = ref([
    { id: 'info', name: '공고 정보' },
    { id: 'applicants', name: '지원자 관리' },
    { id: 'applicants-list', name: '지원자 목록' },
    { id: 'post-schedule', name: '공고 일정' },
    { id: 'proccess-setting', name: '프로세스 설정' },
]);

onMounted(() => {
    console.log('지원자 리스트 로드');
});
</script>


<template>
    <div class="bg-gray-50 min-h-screen">
        <!-- Main Content -->
        <main>
            <!-- Applicant List Content (when applicants-list tab is active) -->
            <div>
                <!-- Stats Cards -->
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <div class="flex items-center gap-3">
                            <div class="p-2 bg-blue-50 rounded-lg">
                                <Users :size="24" class="text-blue-600" />
                            </div>
                            <div>
                                <p class="text-sm text-gray-600">전체 지원자</p>
                                <p class="text-2xl font-bold text-slate-700">{{ stats.total }}</p>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <div class="flex items-center gap-3">
                            <div class="p-2 bg-yellow-50 rounded-lg">
                                <FileText :size="24" class="text-yellow-600" />
                            </div>
                            <div>
                                <p class="text-sm text-gray-600">서류 심사</p>
                                <p class="text-2xl font-bold text-slate-700">{{ stats.pending }}</p>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <div class="flex items-center gap-3">
                            <div class="p-2 bg-green-50 rounded-lg">
                                <CheckCircle :size="24" class="text-green-600" />
                            </div>
                            <div>
                                <p class="text-sm text-gray-600">서류 통과</p>
                                <p class="text-2xl font-bold text-slate-700">{{ stats.passed }}</p>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <div class="flex items-center gap-3">
                            <div class="p-2 bg-purple-50 rounded-lg">
                                <Clock :size="24" class="text-purple-600" />
                            </div>
                            <div>
                                <p class="text-sm text-gray-600">면접 대기</p>
                                <p class="text-2xl font-bold text-slate-700">{{ stats.interview }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Filter Section -->
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                    <div class="flex flex-col md:flex-row gap-4">
                        <div class="flex-1 relative">
                            <Search :size="20"
                                class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input type="text" v-model="searchQuery" placeholder="이름, 이메일로 검색..."
                                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent" />
                        </div>
                        <div class="flex gap-2">
                            <div class="relative">
                                <Filter :size="20"
                                    class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <select v-model="statusFilter"
                                    class="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent appearance-none bg-white cursor-pointer">
                                    <option v-for="option in statusOptions" :key="option.value" :value="option.value">
                                        {{ option.label }}
                                    </option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Applicants List -->
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 class="text-xl font-semibold text-slate-600 mb-4">
                        지원자 목록 ({{ filteredApplicants.length }})
                    </h2>
                    <div v-if="filteredApplicants.length > 0" class="space-y-4">
                        <ApplicantListCard v-for="applicant in filteredApplicants" :key="applicant.id"
                            :applicant="applicant" @click="viewApplicantDetail(applicant.id)" />
                    </div>
                    <div v-else class="text-center py-12">
                        <p class="text-gray-500">검색 결과가 없습니다.</p>
                    </div>
                </div>
            </div>

        </main>
    </div>
</template>

