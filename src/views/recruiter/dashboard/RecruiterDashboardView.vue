<template>
    <div class="flex min-h-screen bg-gray-50">
        <!-- Main Content -->
        <main class="flex-1 overflow-hidden">
            <!-- Header -->
            <header class="px-6 py-4">
                <div class="flex items-center justify-between">
                    <div>
                        <h1 class="text-2xl font-semibold text-gray-900">대시보드</h1>
                        <p class="text-sm text-gray-500 mt-1">채용 활동 현황을 한눈에 확인하세요</p>
                    </div>
                    <div class="flex items-center space-x-3">
                        <div class="flex items-center space-x-2 text-sm text-gray-600">
                            <Calendar class="w-4 h-4" />
                            <span>{{ currentDate }}</span>
                        </div>
                    </div>
                </div>
            </header>

            <!-- Dashboard Content -->
            <div class="p-6 overflow-y-auto">
                <!-- Main Stats Grid -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div v-for="stat in mainStats" :key="stat.label"
                        class="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm font-medium text-gray-500 mb-1">{{ stat.label }}</p>
                                <p class="text-3xl font-bold" :class="stat.valueColor">{{ stat.value }}</p>
                                <p class="text-sm mt-1" :class="stat.trendColor">
                                    <component :is="stat.trendIcon" class="w-3 h-3 inline mr-1" />
                                    {{ stat.trendText }}
                                </p>
                            </div>
                            <div class="w-12 h-12 rounded-xl flex items-center justify-center" :class="stat.iconBg">
                                <component :is="stat.icon" class="w-6 h-6" :class="stat.iconColor" />
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Charts and Recent Activity -->
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <!-- Chart Section -->
                    <div class="lg:col-span-2">
                        <div class="bg-white rounded-xl border border-gray-200 p-6">
                            <div class="flex items-center justify-between mb-6">
                                <h3 class="text-lg font-semibold text-gray-900">지원자 현황</h3>
                                <div class="flex items-center space-x-2">
                                    <button @click="setChartPeriod('weekly')"
                                        :class="chartPeriod === 'weekly' ? 'px-3 py-1 text-sm text-slate-600 bg-slate-100 rounded-md' : 'px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-md'">
                                        주간
                                    </button>
                                    <button @click="setChartPeriod('monthly')"
                                        :class="chartPeriod === 'monthly' ? 'px-3 py-1 text-sm text-slate-600 bg-slate-100 rounded-md' : 'px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-md'">
                                        월간
                                    </button>
                                </div>
                            </div>
                            <!-- Chart Placeholder -->
                            <div
                                class="h-64 bg-gray-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                                <div class="text-center">
                                    <BarChart3 class="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                    <p class="text-gray-500">차트 영역</p>
                                    <p class="text-sm text-gray-400">지원자 수 추이 그래프</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Recent Activity -->
                    <div class="bg-white rounded-xl border border-gray-200 p-6">
                        <h3 class="text-lg font-semibold text-gray-900 mb-6">최근 활동</h3>
                        <div class="space-y-4">
                            <div v-for="activity in recentActivities" :key="activity.id"
                                class="flex items-start space-x-3">
                                <div class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                                    :class="activity.iconBg">
                                    <component :is="activity.icon" class="w-4 h-4" :class="activity.iconColor" />
                                </div>
                                <div class="flex-1">
                                    <p class="text-sm font-medium text-gray-900">{{ activity.message }}</p>
                                    <p class="text-xs text-gray-500">{{ activity.details }}</p>
                                </div>
                            </div>
                        </div>

                        <button
                            class="w-full mt-4 py-2 text-sm text-slate-600 hover:text-slate-700 border-t border-gray-200 pt-4">
                            모든 활동 보기
                        </button>
                    </div>
                </div>

                <!-- Current Job Listings and Quick Actions -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <!-- Active Job Listings -->
                    <div class="bg-white rounded-xl border border-gray-200 p-6">
                        <div class="flex items-center justify-between mb-6">
                            <h3 class="text-lg font-semibold text-gray-900">진행 중인 채용</h3>
                            <a href="#" class="text-sm text-slate-600 hover:text-slate-700">전체 보기</a>
                        </div>
                        <div class="space-y-4">
                            <div v-for="job in activeJobs" :key="job.id"
                                class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div class="flex items-center space-x-3">
                                    <div class="w-10 h-10 rounded-lg flex items-center justify-center"
                                        :class="job.iconBg">
                                        <component :is="job.icon" class="w-5 h-5" :class="job.iconColor" />
                                    </div>
                                    <div>
                                        <p class="font-medium text-gray-900">{{ job.title }}</p>
                                        <p class="text-sm text-gray-500">{{ job.applicants }}명 지원 • {{ job.deadline }}
                                            마감</p>
                                    </div>
                                </div>
                                <span class="px-2 py-1 text-xs rounded-full" :class="getJobStatusClass(job.status)">
                                    {{ getJobStatusText(job.status) }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Quick Actions -->
                    <div class="bg-white rounded-xl border border-gray-200 p-6">
                        <h3 class="text-lg font-semibold text-gray-900 mb-6">빠른 작업</h3>
                        <div class="grid grid-cols-2 gap-4">
                            <button v-for="action in quickActions" :key="action.label" @click="action.onClick"
                                class="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                <div class="w-8 h-8 rounded-lg flex items-center justify-center mb-3"
                                    :class="action.iconBg">
                                    <component :is="action.icon" class="w-5 h-5" :class="action.iconColor" />
                                </div>
                                <p class="font-medium text-gray-900">{{ action.label }}</p>
                                <p class="text-sm text-gray-500 mt-1">{{ action.description }}</p>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Interview Schedule -->
                <div class="bg-white rounded-xl border border-gray-200 p-6">
                    <div class="flex items-center justify-between mb-6">
                        <h3 class="text-lg font-semibold text-gray-900">이번 주 면접 일정</h3>
                        <a href="#" class="text-sm text-slate-600 hover:text-slate-700">전체 일정 보기</a>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div v-for="schedule in weeklySchedule" :key="schedule.date"
                            class="border border-gray-200 rounded-lg p-4">
                            <div class="flex items-center justify-between mb-3">
                                <span class="text-sm font-medium text-gray-900">{{ schedule.label }}</span>
                                <span class="px-2 py-1 text-xs rounded-full"
                                    :class="getScheduleCountClass(schedule.count)">
                                    {{ schedule.count }}건
                                </span>
                            </div>
                            <div v-if="schedule.interviews.length > 0" class="space-y-2">
                                <div v-for="interview in schedule.interviews" :key="interview.id"
                                    class="flex items-center text-sm">
                                    <div class="w-2 h-2 rounded-full mr-2" :class="interview.colorClass"></div>
                                    <span class="text-gray-900">{{ interview.time }} {{ interview.name }} ({{
                                        interview.position }})</span>
                                </div>
                            </div>
                            <div v-else class="text-center py-4">
                                <Calendar class="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                <p class="text-sm text-gray-500">{{ schedule.date }}</p>
                                <p class="text-xs text-gray-400">{{ schedule.count }}건의 면접이 예정되어 있습니다</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import {
    Users,
    Calendar,
    FileText,
    Video,
    Trophy,
    TrendingUp,
    CheckCircle,
    BarChart3,
    UserPlus,
    CalendarCheck,
    FilePlus,
    Clock,
    Code,
    Palette,
    BarChart,
    PlusCircle,
    CalendarPlus,
    Download
} from 'lucide-vue-next'

// Types
interface User {
    name: string
    role: string
}

interface QuickStats {
    newApplications: number
    scheduledInterviews: number
}

interface MainStat {
    label: string
    value: number
    valueColor: string
    trendText: string
    trendColor: string
    trendIcon: unknown
    icon: unknown
    iconBg: string
    iconColor: string
}

interface RecentActivity {
    id: number
    message: string
    details: string
    icon: unknown
    iconBg: string
    iconColor: string
}

interface ActiveJob {
    id: number
    title: string
    applicants: number
    deadline: string
    status: 'recruiting' | 'urgent' | 'closed'
    icon: unknown
    iconBg: string
    iconColor: string
}

interface QuickAction {
    label: string
    description: string
    icon: unknown
    iconBg: string
    iconColor: string
    onClick: () => void
}

interface Interview {
    id: number
    time: string
    name: string
    position: string
    colorClass: string
}

interface WeeklySchedule {
    date: string
    label: string
    count: number
    interviews: Interview[]
}

// Reactive data
const chartPeriod = ref<'weekly' | 'monthly'>('weekly')

const user: User = reactive({
    name: '이상호',
    role: 'Recruiter'
})

const quickStats: QuickStats = reactive({
    newApplications: 12,
    scheduledInterviews: 5
})

const mainStats: MainStat[] = reactive([
    {
        label: '전체 공고',
        value: 24,
        valueColor: 'text-slate-600',
        trendText: '+12% 지난 달 대비',
        trendColor: 'text-green-600',
        trendIcon: TrendingUp,
        icon: FileText,
        iconBg: 'bg-orange-100',
        iconColor: 'text-orange-600'
    },
    {
        label: '전체 지원자',
        value: 387,
        valueColor: 'text-blue-600',
        trendText: '+8% 지난 주 대비',
        trendColor: 'text-green-600',
        trendIcon: TrendingUp,
        icon: Users,
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600'
    },
    {
        label: '면접 진행',
        value: 42,
        valueColor: 'text-purple-600',
        trendText: '이번 주 15건',
        trendColor: 'text-blue-600',
        trendIcon: Calendar,
        icon: Video,
        iconBg: 'bg-purple-100',
        iconColor: 'text-purple-600'
    },
    {
        label: '최종 합격',
        value: 28,
        valueColor: 'text-green-600',
        trendText: '이번 달 목표 달성',
        trendColor: 'text-green-600',
        trendIcon: CheckCircle,
        icon: Trophy,
        iconBg: 'bg-green-100',
        iconColor: 'text-green-600'
    }
])

const recentActivities: RecentActivity[] = reactive([
    {
        id: 1,
        message: '김철수님이 지원했습니다',
        details: '백엔드 개발자 • 5분 전',
        icon: UserPlus,
        iconBg: 'bg-green-100',
        iconColor: 'text-green-600'
    },
    {
        id: 2,
        message: '면접 일정이 확정되었습니다',
        details: '이영희 • 15분 전',
        icon: CalendarCheck,
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600'
    },
    {
        id: 3,
        message: '새로운 공고가 게시되었습니다',
        details: 'UX 디자이너 • 1시간 전',
        icon: FilePlus,
        iconBg: 'bg-purple-100',
        iconColor: 'text-purple-600'
    },
    {
        id: 4,
        message: '마감 임박 공고가 있습니다',
        details: '프론트엔드 개발자 • 2시간 전',
        icon: Clock,
        iconBg: 'bg-yellow-100',
        iconColor: 'text-yellow-600'
    }
])

const activeJobs: ActiveJob[] = reactive([
    {
        id: 1,
        title: '시니어 백엔드 개발자',
        applicants: 47,
        deadline: '2025.11.15',
        status: 'recruiting',
        icon: Code,
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600'
    },
    {
        id: 2,
        title: 'UX/UI 디자이너',
        applicants: 23,
        deadline: '2025.10.31',
        status: 'urgent',
        icon: Palette,
        iconBg: 'bg-purple-100',
        iconColor: 'text-purple-600'
    },
    {
        id: 3,
        title: '데이터 분석가',
        applicants: 35,
        deadline: '2025.11.20',
        status: 'recruiting',
        icon: BarChart,
        iconBg: 'bg-green-100',
        iconColor: 'text-green-600'
    }
])

const quickActions: QuickAction[] = [
    {
        label: '새 공고 작성',
        description: '채용 공고를 새로 작성합니다',
        icon: PlusCircle,
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600',
        onClick: () => console.log('새 공고 작성')
    },
    {
        label: '면접 일정',
        description: '면접 일정을 관리합니다',
        icon: CalendarPlus,
        iconBg: 'bg-green-100',
        iconColor: 'text-green-600',
        onClick: () => console.log('면접 일정 관리')
    },
    {
        label: '지원자 관리',
        description: '지원자 현황을 확인합니다',
        icon: Users,
        iconBg: 'bg-purple-100',
        iconColor: 'text-purple-600',
        onClick: () => console.log('지원자 관리')
    },
    {
        label: '리포트 다운로드',
        description: '채용 현황 리포트를 다운로드합니다',
        icon: Download,
        iconBg: 'bg-orange-100',
        iconColor: 'text-orange-600',
        onClick: () => console.log('리포트 다운로드')
    }
]

const weeklySchedule: WeeklySchedule[] = reactive([
    {
        date: '10/16',
        label: '오늘 (10/16)',
        count: 3,
        interviews: [
            { id: 1, time: '14:00', name: '김철수', position: '백엔드', colorClass: 'bg-blue-400' },
            { id: 2, time: '15:30', name: '이영희', position: '디자인', colorClass: 'bg-green-400' },
            { id: 3, time: '16:00', name: '박민수', position: '기획', colorClass: 'bg-purple-400' }
        ]
    },
    {
        date: '10/17',
        label: '내일 (10/17)',
        count: 2,
        interviews: [
            { id: 4, time: '10:00', name: '최지훈', position: 'DevOps', colorClass: 'bg-orange-400' },
            { id: 5, time: '14:00', name: '한소영', position: '데이터', colorClass: 'bg-red-400' }
        ]
    },
    {
        date: '18일 ~ 20일',
        label: '이번 주 나머지',
        count: 8,
        interviews: []
    }
])

// Computed properties
const userInitials = computed(() => {
    return user.name.slice(0, 2)
})

const currentDate = computed(() => {
    const today = new Date()
    return `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`
})

// Methods
const setChartPeriod = (period: 'weekly' | 'monthly') => {
    chartPeriod.value = period
}

const createNewJob = () => {
    console.log('새 채용 공고 생성')
}

const getJobStatusClass = (status: string) => {
    switch (status) {
        case 'recruiting':
            return 'bg-green-100 text-green-700'
        case 'urgent':
            return 'bg-yellow-100 text-yellow-700'
        case 'closed':
            return 'bg-gray-100 text-gray-700'
        default:
            return 'bg-gray-100 text-gray-700'
    }
}

const getJobStatusText = (status: string) => {
    switch (status) {
        case 'recruiting':
            return '모집중'
        case 'urgent':
            return '마감임박'
        case 'closed':
            return '마감'
        default:
            return '알 수 없음'
    }
}

const getScheduleCountClass = (count: number) => {
    if (count === 0) return 'bg-gray-100 text-gray-700'
    if (count <= 2) return 'bg-green-100 text-green-700'
    if (count <= 5) return 'bg-blue-100 text-blue-700'
    return 'bg-purple-100 text-purple-700'
}
</script>

<style scoped>
/* Custom styles if needed */
</style>