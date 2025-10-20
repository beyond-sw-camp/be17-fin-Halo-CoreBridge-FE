<template>
  <div class="space-y-6">
    <!-- ✅ 공고 정보 -->
    <section class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 class="text-lg font-bold text-slate-600 mb-4">공고 정보</h3>
      <div class="space-y-4">
        <div>
          <div class="text-sm text-gray-600 mb-1">공고 상태</div>
          <div
            class="font-medium"
            :class="jobPosting.status === '채용중' ? 'text-green-600' : 'text-gray-700'"
          >
            {{ jobPosting.status }}
          </div>
        </div>

        <div>
          <div class="text-sm text-gray-600 mb-1">등록일</div>
          <div class="font-medium text-gray-900">{{ jobPosting.postedDate }}</div>
        </div>

        <div>
          <div class="text-sm text-gray-600 mb-1">접수 기간</div>
          <div class="font-medium text-gray-900">{{ jobPosting.applicationPeriod }}</div>
        </div>

        <div>
          <div class="text-sm text-gray-600 mb-1">마감일</div>
          <div class="font-medium text-red-600">{{ jobPosting.deadline }}</div>
        </div>

        <div>
          <div class="text-sm text-gray-600 mb-1">모집 인원</div>
          <div class="font-medium text-gray-900">{{ jobPosting.headcount }}명</div>
        </div>

        <div>
          <div class="text-sm text-gray-600 mb-1">지원자 수</div>
          <div class="font-medium text-slate-600 flex items-center gap-1">
            <Users :size="20" />
            {{ jobPosting.applicantCount }}명
          </div>
        </div>
      </div>
    </section>

    <!-- ✅ 기술 스택 -->
    <section class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 class="text-lg font-bold text-slate-600 mb-4">기술 스택</h3>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="(tech, index) in jobPosting.techStack"
          :key="index"
          class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
        >
          {{ tech }}
        </span>
      </div>
    </section>

    <!-- ✅ 채용 프로세스 -->
    <section class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 class="text-lg font-bold text-slate-600 mb-4">채용 프로세스</h3>
      <div class="space-y-4">
        <div
          v-for="(step, index) in recruitmentProcess"
          :key="index"
          class="flex gap-3 items-start"
        >
          <div class="flex flex-col items-center">
            <div :class="`w-3 h-3 rounded-full ${step.color}`"></div>
            <div
              v-if="index < recruitmentProcess.length - 1"
              class="w-0.5 h-full bg-gray-200"
            ></div>
          </div>
          <div class="font-medium text-gray-900">{{ step.name }}</div>
        </div>
      </div>
    </section>

    <!-- ✅ 근무 조건 & 담당자 -->
    <section class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 class="text-lg font-bold text-slate-600 mb-4">근무 조건</h3>
      <div class="space-y-3">
        <div class="flex items-center gap-3 text-gray-700">
          <Clock :size="20" class="text-slate-600" />
          <div>
            <div class="text-sm text-gray-600">근무 시간</div>
            <div class="font-medium">{{ jobPosting.workingHours }}</div>
          </div>
        </div>

        <div class="flex items-center gap-3 text-gray-700">
          <Calendar :size="20" class="text-slate-600" />
          <div>
            <div class="text-sm text-gray-600">근무일</div>
            <div class="font-medium">{{ jobPosting.workingDays }}</div>
          </div>
        </div>
      </div>

      <hr class="my-4" />

      <h3 class="text-lg font-bold text-slate-600 mb-4">담당자 정보</h3>
      <div class="space-y-3">
        <div class="flex items-center gap-3 text-gray-700">
          <User :size="20" class="text-slate-600" />
          <div>
            <div class="text-sm text-gray-600">이름</div>
            <div class="font-medium">{{ jobPosting.contact.name }}</div>
          </div>
        </div>
        <div class="flex items-center gap-3 text-gray-700">
          <Mail :size="20" class="text-slate-600" />
          <div>
            <div class="text-sm text-gray-600">이메일</div>
            <div class="font-medium">{{ jobPosting.contact.email }}</div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { Users, Calendar, Clock, User, Mail } from 'lucide-vue-next'

interface JobPosting {
  status: string
  postedDate: string
  applicationPeriod: string
  deadline: string
  headcount: number
  applicantCount: number
  techStack: string[]
  workingHours: string
  workingDays: string
  contact: {
    name: string
    email: string
  }
}

interface RecruitmentStep {
  name: string
  color: string
}

const props = defineProps<{
  jobPosting: JobPosting
  recruitmentProcess: RecruitmentStep[]
}>()
</script>
