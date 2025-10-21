<template>
    <div class="bg-gray-50 min-h-screen">
        <!-- Main Content -->
        <main>

            <!-- Kanban Board -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">

                <!-- Search and Filter -->
                <div class="flex gap-4 mb-6">
                    <div class="flex-1 relative">
                        <input v-model="searchQuery" type="text" placeholder="지원자 이름, 이메일 검색..."
                            class="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600 focus:border-transparent" />
                        <Search class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    </div>
                    <button @click="toggleFilter"
                        class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                        <Filter class="w-5 h-5" />
                        필터
                    </button>
                </div>

                <div class="flex gap-4 overflow-x-auto">
                    <div v-for="stage in stages" :key="stage.id" class="flex-shrink-0 w-80">
                        <!-- Column Header -->
                        <div :class="['rounded-lg p-4 mb-4 shadow-md', stage.headerClass]">
                            <div class="flex items-center justify-between mb-2">
                                <h3 class="font-bold text-slate-600 flex items-center gap-2">
                                    <span :class="['w-3 h-3 rounded-full', stage.dotClass]"></span>
                                    {{ stage.name }}
                                </h3>
                                <span class="text-sm text-gray-600 bg-white px-2 py-1 rounded">
                                    {{ getStageApplicants(stage.id).length }}
                                </span>
                            </div>
                        </div>

                        <!-- Applicant Cards -->
                        <div class="space-y-3 min-h-[500px]">
                            <div v-for="applicant in getStageApplicants(stage.id)" :key="applicant.id"
                                @click="viewApplicant(applicant.id)"
                                class="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:-translate-y-1 hover:shadow-lg transition-all duration-200 shadow-sm">
                                <div class="flex items-start justify-between mb-3">
                                    <div class="flex items-center gap-3">
                                        <div :class="[
                                            'w-10 h-10 rounded-full flex items-center justify-center text-white font-medium',
                                            stage.id === 'final' ? 'bg-green-600' : 'bg-slate-600'
                                        ]">
                                            {{ applicant.name.charAt(0) }}
                                        </div>
                                        <div>
                                            <div class="font-medium text-slate-600">{{ applicant.name }}</div>
                                            <div class="text-xs text-gray-500">{{ applicant.experience }}년 경력</div>
                                        </div>
                                    </div>
                                    <!-- <button @click.stop="openMenu(applicant.id)"
                                        class="text-gray-400 hover:text-gray-600">
                                        <MoreVertical class="w-5 h-5" />
                                    </button> -->
                                    <div :class="[
                                        'flex items-center gap-2',
                                        stage.id === 'final' ? 'text-green-600' : 'text-gray-600'
                                    ]">
                                        <Calendar class="w-4 h-4" />
                                        {{ applicant.statusText }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import {
    Briefcase,
    MapPin,
    Calendar,
    Search,
    Filter,
    Mail,
    MoreVertical
} from 'lucide-vue-next';

interface Applicant {
    id: string;
    name: string;
    email: string;
    experience: number;
    stageId: string;
    appliedDate: string;
    interviewDate?: string;
    statusText: string;
    skills: string[];
}

interface Stage {
    id: string;
    name: string;
    bgClass: string;
    textClass: string;
    headerClass: string;
    dotClass: string;
}

const router = useRouter();

// ✅ 공통 상태
const userInitial = ref('A');
const activeTab = ref('applicants');
const searchQuery = ref('');

// ✅ 탭 목록 (JobHeader와 공유 가능)
const tabs = ref([
    { id: 'info', name: '공고 정보' },
    { id: 'applicants', name: '지원자 관리' },
    { id: 'applicants-list', name: '지원자 목록' },
    { id: 'post-schedule', name: '공고 일정' },
    { id: 'process-setting', name: '프로세스 설정' }
]);

// ✅ 단계와 지원자 더미 데이터
const stages = ref<Stage[]>([
    {
        id: 'applied',
        name: '지원 완료',
        bgClass: 'bg-gray-50',
        textClass: 'text-slate-600',
        headerClass: 'bg-gray-100',
        dotClass: 'bg-gray-500'
    },
    {
        id: 'screening',
        name: '서류 검토',
        bgClass: 'bg-blue-50',
        textClass: 'text-blue-600',
        headerClass: 'bg-blue-100',
        dotClass: 'bg-blue-500'
    },
    {
        id: 'interview1',
        name: '1차 면접',
        bgClass: 'bg-purple-50',
        textClass: 'text-purple-600',
        headerClass: 'bg-purple-100',
        dotClass: 'bg-purple-500'
    },
    {
        id: 'interview2',
        name: '2차 면접',
        bgClass: 'bg-orange-50',
        textClass: 'text-orange-600',
        headerClass: 'bg-orange-100',
        dotClass: 'bg-orange-500'
    },
    {
        id: 'final',
        name: '최종 합격',
        bgClass: 'bg-green-50',
        textClass: 'text-green-600',
        headerClass: 'bg-green-100',
        dotClass: 'bg-green-500'
    }
]);

const applicants = ref<Applicant[]>([
    {
        id: '1',
        name: '김민수',
        email: 'minsu.kim@email.com',
        experience: 5,
        stageId: 'applied',
        appliedDate: '2025-10-10',
        statusText: '1일전',
        skills: ['Java', 'Spring', 'AWS']
    },
    {
        id: '2',
        name: '이지은',
        email: 'jieun.lee@email.com',
        experience: 3,
        stageId: 'applied',
        appliedDate: '2025-10-11',
        statusText: '1일전',
        skills: ['Node.js', 'Python', 'Docker']
    },
    {
        id: '3',
        name: '박서준',
        email: 'seojun.park@email.com',
        experience: 7,
        stageId: 'applied',
        appliedDate: '2025-10-12',
        statusText: '1일전',
        skills: ['Go', 'Kubernetes']
    },
    {
        id: '4',
        name: '최유진',
        email: 'yujin.choi@email.com',
        experience: 4,
        stageId: 'screening',
        appliedDate: '2025-10-13',
        statusText: '1일전',
        skills: ['C++', 'Redis']
    },
    {
        id: '5',
        name: '정현우',
        email: 'hyunwoo.jung@email.com',
        experience: 6,
        stageId: 'interview1',
        appliedDate: '2025-10-10',
        interviewDate: '2025-10-18',
        statusText: '1일전',
        skills: ['Scala', 'Kafka']
    }
]);

// ✅ 필터/검색
const filteredApplicants = computed(() => {
    if (!searchQuery.value) return applicants.value;

    const query = searchQuery.value.toLowerCase();
    return applicants.value.filter(
        (applicant) =>
            applicant.name.toLowerCase().includes(query) ||
            applicant.email.toLowerCase().includes(query)
    );
});

// ✅ 각 단계별 지원자 수
const getStageCount = (stageId: string) => {
    return applicants.value.filter((a) => a.stageId === stageId).length;
};

const getStageApplicants = (stageId: string) => {
    return filteredApplicants.value.filter((a) => a.stageId === stageId);
};

// ✅ 페이지 이동 및 이벤트
const viewApplicant = (applicantId: string) => {
    router.push(`/recruiter/applicants/${applicantId}`);
};
</script>
