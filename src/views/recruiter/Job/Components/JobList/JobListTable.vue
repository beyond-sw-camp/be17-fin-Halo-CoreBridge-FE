<script setup lang="ts">
import { Users, Edit, Share2, Briefcase } from 'lucide-vue-next'

// ✅ Props & Emits 정의
interface Job {
  id: number
  title: string
  department: string
  experience: string
  type: string
  status: 'recruiting' | 'screening' | 'interviewing' | 'closed' | 'paused'
  deadline: string
  daysLeft: number
  applicants: number
  progress: number
  screening?: number
  interview1?: number
  interview2?: number
  final?: number
}

const props = defineProps<{
  jobs: Job[]
}>()

const emit = defineEmits<{
  (e: 'view-detail', id: number): void
  (e: 'edit-job', id: number): void
  (e: 'share-job', id: number): void
  (e: 'view-applicants', id: number): void
}>()

// ✅ 상태 / 진행률 색상 도우미
const getStatusClass = (status: Job['status']) => {
  const classes = {
    recruiting: 'bg-green-100 text-green-700',
    screening: 'bg-blue-100 text-blue-700',
    interviewing: 'bg-purple-100 text-purple-700',
    closed: 'bg-gray-100 text-gray-700',
    paused: 'bg-yellow-100 text-yellow-700'
  }
  return classes[status]
}

const getStatusLabel = (status: Job['status']) => {
  const labels = {
    recruiting: '채용중',
    screening: '서류검토',
    interviewing: '면접중',
    closed: '마감',
    paused: '중단'
  }
  return labels[status]
}

const getProgressColor = (progress: number) => {
  if (progress >= 75) return 'bg-green-500'
  if (progress >= 50) return 'bg-blue-500'
  if (progress >= 25) return 'bg-yellow-500'
  return 'bg-gray-400'
}
</script>

<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <h3 class="text-xl font-bold text-slate-600 mb-4">진행중인 채용 공고</h3>

    <div class="overflow-x-auto">
      <table class="w-full text-sm text-left border-collapse">
        <thead>
          <tr class="border-b-2 border-gray-200">
            <th class="py-3 px-4 font-semibold text-gray-700">공고명</th>
            <th class="py-3 px-4 font-semibold text-gray-700">부서</th>
            <th class="py-3 px-4 text-center font-semibold text-gray-700">상태</th>
            <th class="py-3 px-4 text-center font-semibold text-gray-700">마감일</th>
            <th class="py-3 px-4 text-center font-semibold text-gray-700">지원자</th>
            <th class="py-3 px-4 text-center font-semibold text-gray-700">진행률</th>
            <th class="py-3 px-4 text-center font-semibold text-gray-700">단계별 현황</th>
            <th class="py-3 px-4 text-center font-semibold text-gray-700">액션</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="job in jobs" :key="job.id"
            class="border-b border-gray-100 hover:bg-gray-50 transition cursor-pointer"
            @click="emit('view-detail', job.id)">
            <!-- 공고명 -->
            <td class="py-3 px-4">
              <div>
                <p class="font-semibold text-gray-900">{{ job.title }}</p>
                <p class="text-xs text-gray-500">{{ job.experience }} · {{ job.type }}</p>
              </div>
            </td>

            <!-- 부서 -->
            <td class="py-3 px-4">
              <div class="flex items-center gap-1 text-gray-600">
                <Briefcase class="w-3 h-3" />
                {{ job.department }}
              </div>
            </td>

            <!-- 상태 -->
            <td class="py-3 px-4 text-center">
              <span :class="[
                'inline-block px-2 py-1 text-xs font-semibold rounded',
                getStatusClass(job.status)
              ]">
                {{ getStatusLabel(job.status) }}
              </span>
            </td>

            <!-- 마감일 -->
            <td class="py-3 px-4 text-center">
              <div>
                <p class="font-medium">{{ job.deadline }}</p>
                <p :class="[
                  'text-xs',
                  job.daysLeft <= 3 ? 'text-red-600 font-bold' : 'text-gray-500'
                ]">
                  D-{{ job.daysLeft }}
                </p>
              </div>
            </td>

            <!-- 지원자 -->
            <td class="py-3 px-4 text-center">
              <div class="flex items-center justify-center gap-1 font-medium text-gray-900">
                <Users class="w-4 h-4 text-gray-500" />
                {{ job.applicants }}명
              </div>
            </td>

            <!-- 진행률 -->
            <td class="py-3 px-4">
              <div class="flex items-center gap-2">
                <div class="flex-1 bg-gray-200 rounded-full h-2">
                  <div :class="['h-2 rounded-full', getProgressColor(job.progress)]"
                    :style="{ width: job.progress + '%' }" />
                </div>
                <span class="text-xs font-semibold text-gray-600 w-10 text-right">{{
                  job.progress
                }}%</span>
              </div>
            </td>

            <!-- 단계별 현황 -->
            <td class="py-3 px-4 text-center">
              <div class="flex items-center justify-center gap-2 text-xs">
                <div>
                  <p class="text-gray-500">서류</p>
                  <p class="font-bold text-gray-700">{{ job.screening ?? 0 }}</p>
                </div>
                <span class="text-gray-300">→</span>
                <div>
                  <p class="text-gray-500">1차</p>
                  <p class="font-bold text-gray-700">{{ job.interview1 ?? 0 }}</p>
                </div>
                <span class="text-gray-300">→</span>
                <div>
                  <p class="text-gray-500">2차</p>
                  <p class="font-bold text-gray-700">{{ job.interview2 ?? 0 }}</p>
                </div>
                <span class="text-gray-300">→</span>
                <div>
                  <p class="text-gray-500">최종</p>
                  <p class="font-bold text-gray-700">{{ job.final ?? 0 }}</p>
                </div>
              </div>
            </td>

            <!-- 액션 -->
            <td class="py-3 px-4 text-center">
              <div class="flex justify-center gap-1">
                <button @click.stop="emit('edit-job', job.id)"
                  class="p-1.5 text-slate-600 hover:bg-slate-100 rounded transition" title="수정">
                  <Edit class="w-4 h-4" />
                </button>
                <button @click.stop="emit('share-job', job.id)"
                  class="p-1.5 text-blue-600 hover:bg-blue-100 rounded transition" title="공유">
                  <Share2 class="w-4 h-4" />
                </button>
                <button @click.stop="emit('view-applicants', job.id)"
                  class="p-1.5 text-green-600 hover:bg-green-100 rounded transition" title="지원자 보기">
                  <Users class="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="jobs.length === 0" class="text-center py-10 text-gray-500">
        표시할 채용공고가 없습니다.
      </div>
    </div>
  </div>
</template>
