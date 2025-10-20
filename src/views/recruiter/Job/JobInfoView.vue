<script setup lang="ts">
import { ref } from 'vue'
import JobInfoHeader from './components/JobInfo/JobInfoHeader.vue'
import JobInfoMain from './components/JobInfo/JobInfoMain.vue'
import JobInfoSidebar from './components/JobInfo/JobInfoSidebar.vue'

// 💾 더미 데이터
const jobPosting = ref({
    title: '시니어 프론트엔드 개발자',
    status: '채용중',
    department: '개발팀',
    employmentType: '정규직',
    location: '서울시 강남구 테헤란로 123',
    experience: '5년 이상',
    position: '대리',
    techStack: ['Vue.js', 'TypeScript', 'Tailwind CSS', 'Nuxt.js', 'Pinia'],
    salary: '6,000만원 ~ 8,000만원',
    salaryNegotiable: '면접 후 결정',
    description: '우리 팀에서 함께 성장할 시니어 프론트엔드 개발자를 찾습니다.',
    responsibilities: ['Vue.js 기반 개발', 'TypeScript 적용', 'API 연동'],
    requirements: [
        'Vue.js (Vue 2 또는 Vue 3) 실무 경험 5년 이상',
        'TypeScript 활용 경험',
        'HTML5, CSS3, JavaScript(ES6+) 능숙자',
        'Git을 활용한 협업 경험',
        '반응형 웹 디자인 구현 경험'
    ],
    preferred: [
        'Tailwind CSS 사용 경험',
        'Nuxt.js 프레임워크 경험',
        '테스트 코드 작성 경험 (Jest, Vitest 등)',
        'CI/CD 파이프라인 구축 경험',
        '오픈소스 기여 경험'
    ],
    benefits: ['유연 근무제 (코어타임 11:00-16:00)',
        '재택근무 가능 (주 2회)',
        '최신 개발 장비 지원 (맥북 프로 등)',
        '교육비 지원 (연 200만원)',
        '도서 구매비 무제한',
        '점심 식대 지원',
        '건강검진 지원'],
    additionalInfo: '서류는 채용 목적 외 사용되지 않습니다.',
    postedDate: '2025-10-01',
    applicationPeriod: '2025.10.01 ~ 10.31',
    deadline: '2025-10-31',
    headcount: 2,
    applicantCount: 23,
    workingHours: '09:00 - 18:00',
    workingDays: '주 5일',
    contact: { name: '홍길동', email: 'hr@company.com' }
})

const recruitmentProcess = ref([
    { name: '접수', color: 'bg-gray-400' },
    { name: '과제 평가', color: 'bg-orange-500' },
    { name: '직무 인터뷰', color: 'bg-yellow-500' },
    { name: '컬쳐핏 인터뷰', color: 'bg-green-500' },
    { name: '처우 협의', color: 'bg-cyan-500' },
    { name: '최종합격', color: 'bg-blue-500' }
])

const tabs = ref([
    { id: 'info', name: '공고 정보' },
    { id: 'applicants', name: '지원자 관리' },
    { id: 'applicants-list', name: '지원자 목록' },
    { id: 'post-schedule', name: '공고 일정' },
    { id: 'proccess-setting', name: '프로세스 설정' },
])

const activeTab = ref('info')

// 액션
const handleEdit = () => alert('공고 수정 페이지로 이동')
const handlePause = () => alert('공고가 모집 중단 상태로 변경되었습니다.')
const handleDelete = () => confirm('정말 삭제하시겠습니까?') && alert('공고 삭제 완료')
</script>

<template>
    <div class="bg-gray-50 min-h-screen">
        <main class="max-w-7xl mx-auto px-6 py-8 space-y-6">
            <JobInfoHeader :jobPosting="jobPosting" :tabs="tabs" v-model:activeTab="activeTab" @edit="handleEdit"
                @pause="handlePause" @delete="handleDelete" />


            <div class="grid grid-cols-3 gap-6">
                <div class="col-span-2 space-y-6">
                    <JobInfoMain :jobPosting="jobPosting" />
                </div>
                <JobInfoSidebar :jobPosting="jobPosting" :recruitmentProcess="recruitmentProcess" />
            </div>
        </main>
    </div>
</template>
