<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
    <div class="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
      <!-- Left: Job meta -->
      <section>
        <div class="flex items-start gap-6 mb-6">
          <div
            class="w-20 h-20 bg-slate-600 rounded-lg flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
            채용
          </div>
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-2">
              <h2 class="text-2xl font-bold text-slate-800">{{ job.title }}</h2>
              <span :class="[statusClass, 'px-3 py-1 text-sm rounded-full font-medium']">
                {{ job.status }}
              </span>
            </div>

            <div class="space-y-2 text-gray-600 mb-4">
              <div class="flex items-center gap-2">
                <Building2 :size="20" />
                {{ job.department }} • {{ job.employmentType }}
              </div>
              <div class="flex items-center gap-2">
                <MapPin :size="20" />
                {{ job.location }}
              </div>
              <div class="flex items-center gap-2">
                <Briefcase :size="20" />
                {{ job.experience }} • {{ job.position }}
              </div>
            </div>

            <div class="flex gap-2 flex-wrap">
              <span
                v-for="(tech, i) in job.techStack.slice(0, 3)"
                :key="i"
                class="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                {{ tech }}
              </span>
              <span
                v-if="job.techStack.length > 3"
                class="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                +{{ job.techStack.length - 3 }}
              </span>
            </div>
          </div>
        </div>
      </section>

      <!-- Right: Actions (슬롯 허용 + 기본 버튼) -->
      <section class="">
        <div class="space-y-3">
          <!-- 커스텀 액션이 필요하면 외부에서 slot으로 교체 가능 -->
          <slot name="actions">
            <button
              @click="$emit('edit')"
              class="w-full px-4 py-3 bg-white text-slate-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm font-medium hover:cursor-pointer">
              공고 수정
            </button>
            <button
              @click="$emit('delete')"
              class="w-full px-4 py-3 bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 transition text-sm font-medium hover:cursor-pointer">
              공고 삭제
            </button>
          </slot>
        </div>
      </section>
    </div>

    <!-- Salary Highlight -->
    <div v-if="showSalary" class="bg-slate-50 rounded-lg p-4 border border-slate-200 mb-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <DollarSign :size="24" class="text-slate-600" />
          <div>
            <div class="text-sm text-gray-600">연봉</div>
            <div class="text-xl font-bold text-slate-800">{{ job.salary }}</div>
          </div>
        </div>
        <span class="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full font-medium">
          {{ job.salaryNegotiable }}
        </span>
      </div>
    </div>

    <!-- Tabs -->
    <div v-if="tabs && tabs.length" class="border-b border-gray-200">
      <nav class="flex gap-8">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="$emit('update:activeTab', tab.id)"
          :class="[
            'pb-4 px-1 border-b-2 font-medium transition-colors',
            activeTab === tab.id
              ? 'border-slate-600 text-slate-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          ]">
          {{ tab.name }}
        </button>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Building2, MapPin, Briefcase, DollarSign } from 'lucide-vue-next'

type TabId = 'info' | 'applicants' | 'applicants-list' | 'post-schedule' | 'proccess-setting'
interface TabItem { id: TabId; name: string }

interface JobHeaderModel {
  title: string
  status: string
  department: string
  employmentType: string
  location: string
  experience: string
  position: string
  techStack: string[]
  salary: string
  salaryNegotiable: string
}

const props = defineProps<{
  job: JobHeaderModel
  showSalary?: boolean
  tabs?: TabItem[]
  activeTab?: TabId
}>()

defineEmits<{
  (e: 'edit'): void
  (e: 'delete'): void
  (e: 'update:activeTab', v: TabId): void
}>()

const statusClass = computed(() =>
  props.job.status === '채용중' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
)
</script>
