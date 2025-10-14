<script setup lang="ts">
import { ref, onMounted } from 'vue';
import StatCard from '@/components/RecruiterDashboard/StatCard.vue';
import ApplicantCard from '@/components/RecruiterDashboard/ApplicantCard.vue';
import InterviewCard from '@/components/RecruiterDashboard/InterviewCard.vue';
import JobPostingRow from '@/components/RecruiterDashboard/JobPostingRow.vue';

// Types
interface Stat {
    label: string;
    value: string | number;
    change: string;
    icon: string;
}

interface Applicant {
    id: number;
    name: string;
    position: string;
    experience: string;
    status: string;
    statusColor: string;
    timeAgo: string;
    initial: string;
}

interface Interview {
    id: number;
    name: string;
    position: string;
    time: string;
    isToday: boolean;
}

interface JobPosting {
    id: number;
    position: string;
    requirement: string;
    department: string;
    applicants: number;
    documentPassed: number;
    interviewing: number;
    status: string;
    statusColor: string;
}

// Reactive Data
const stats = ref<Stat[]>([
    {
        label: '진행 중인 공고',
        value: 24,
        change: '↑ 3개 증가',
        icon: 'document'
    },
    {
        label: '총 지원자',
        value: 387,
        change: '↑ 12% 증가',
        icon: 'users'
    },
    {
        label: '심사 대기',
        value: 52,
        change: '긴급 확인 필요',
        icon: 'clock'
    },
    {
        label: '면접 예정',
        value: 18,
        change: '이번 주 일정',
        icon: 'calendar'
    }
]);

const recentApplicants = ref<Applicant[]>([
    {
        id: 1,
        name: '김철수',
        position: '프론트엔드 개발자',
        experience: '경력 3년',
        status: '서류 심사',
        statusColor: 'blue',
        timeAgo: '2시간 전',
        initial: '김'
    },
    {
        id: 2,
        name: '이영희',
        position: '백엔드 개발자',
        experience: '경력 5년',
        status: '1차 합격',
        statusColor: 'green',
        timeAgo: '5시간 전',
        initial: '이'
    },
    {
        id: 3,
        name: '박민수',
        position: 'UI/UX 디자이너',
        experience: '경력 2년',
        status: '면접 대기',
        statusColor: 'purple',
        timeAgo: '어제',
        initial: '박'
    },
    {
        id: 4,
        name: '정수진',
        position: '데이터 분석가',
        experience: '경력 4년',
        status: '서류 심사',
        statusColor: 'blue',
        timeAgo: '어제',
        initial: '정'
    }
]);

const upcomingInterviews = ref<Interview[]>([
    {
        id: 1,
        name: '이영희',
        position: '백엔드 개발자',
        time: '오늘 14:00',
        isToday: true
    },
    {
        id: 2,
        name: '박민수',
        position: 'UI/UX 디자이너',
        time: '내일 10:00',
        isToday: true
    },
    {
        id: 3,
        name: '최준호',
        position: '프로덕트 매니저',
        time: '10월 16일 15:00',
        isToday: false
    },
    {
        id: 4,
        name: '강민지',
        position: '마케팅 매니저',
        time: '10월 17일 11:00',
        isToday: false
    }
]);

const jobPostings = ref<JobPosting[]>([
    {
        id: 1,
        position: '프론트엔드 개발자',
        requirement: '경력 3년 이상',
        department: '개발팀',
        applicants: 48,
        documentPassed: 12,
        interviewing: 5,
        status: '진행중',
        statusColor: 'green'
    },
    {
        id: 2,
        position: '백엔드 개발자',
        requirement: '경력 5년 이상',
        department: '개발팀',
        applicants: 62,
        documentPassed: 18,
        interviewing: 8,
        status: '진행중',
        statusColor: 'green'
    },
    {
        id: 3,
        position: 'UI/UX 디자이너',
        requirement: '경력 2년 이상',
        department: '디자인팀',
        applicants: 35,
        documentPassed: 10,
        interviewing: 3,
        status: '진행중',
        statusColor: 'green'
    },
    {
        id: 4,
        position: '데이터 분석가',
        requirement: '경력 3년 이상',
        department: '데이터팀',
        applicants: 28,
        documentPassed: 8,
        interviewing: 2,
        status: '마감임박',
        statusColor: 'yellow'
    }
]);

// Methods
const viewAllApplicants = () => {
    console.log('전체 지원자 보기');
    // 라우터 이동 로직 추가
};

const viewApplicantDetail = (id: number) => {
    console.log('지원자 상세 보기:', id);
    // 라우터 이동 로직 추가
};

const viewPostingDetail = (id: number) => {
    console.log('공고 상세 보기:', id);
    // 라우터 이동 로직 추가
};

// Lifecycle
onMounted(() => {
    // API 호출하여 데이터 로드
    console.log('대시보드 데이터 로드');
});
</script>
<template>
    <div class="min-h-screen bg-gray-50 p-6">
        <!-- Header -->
        <div class="mb-8">
            <h1 class="text-3xl font-bold text-slate-600 mb-2">채용 관리 대시보드</h1>
            <p class="text-gray-600">실시간 채용 현황을 한눈에 확인하세요</p>
        </div>

        <!-- Stats Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard v-for="stat in stats" :key="stat.label" :label="stat.label" :value="stat.value"
                :change="stat.change" :icon="stat.icon" />
        </div>

        <!-- Main Content Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <!-- Recent Applications -->
            <div class="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-xl font-semibold text-slate-600">최근 지원자</h2>
                    <button @click="viewAllApplicants"
                        class="text-sm text-slate-600 hover:text-slate-700 transition hover:cursor-pointer">
                        전체 보기
                    </button>
                </div>
                <div class="space-y-4">
                    <ApplicantCard v-for="applicant in recentApplicants" :key="applicant.id" :applicant="applicant"
                        @click="viewApplicantDetail(applicant.id)" />
                </div>
            </div>

            <!-- Upcoming Interviews -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 class="text-xl font-semibold text-slate-600 mb-6">다가오는 면접</h2>
                <div class="space-y-4">
                    <InterviewCard v-for="interview in upcomingInterviews" :key="interview.id" :interview="interview" />
                </div>
            </div>
        </div>

        <!-- Job Postings Status -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between mb-6">
                <h2 class="text-xl font-semibold text-slate-600 ">공고별 현황</h2>
                <button @click="viewAllApplicants"
                    class="text-sm text-slate-600 hover:text-slate-700 transition hover:cursor-pointer">
                    전체 보기
                </button>
            </div>

            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead>
                        <tr class="border-b border-gray-200">
                            <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">포지션</th>
                            <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">부서</th>
                            <th class="text-center py-3 px-4 text-sm font-semibold text-gray-700">지원자</th>
                            <th class="text-center py-3 px-4 text-sm font-semibold text-gray-700">서류 통과</th>
                            <th class="text-center py-3 px-4 text-sm font-semibold text-gray-700">면접 진행</th>
                            <th class="text-center py-3 px-4 text-sm font-semibold text-gray-700">상태</th>
                        </tr>
                    </thead>
                    <tbody>
                        <JobPostingRow v-for="posting in jobPostings" :key="posting.id" :posting="posting"
                            @click="viewPostingDetail(posting.id)" />
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>



<style scoped>
/* 추가 스타일이 필요한 경우 여기에 작성 */
</style>
