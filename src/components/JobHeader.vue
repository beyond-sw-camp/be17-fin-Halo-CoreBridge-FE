<template>
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div class="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
            <!-- 왼쪽: 공고 기본 정보 -->
            <section>
                <div class="flex items-start gap-6 mb-6">
                    <div
                        class="w-20 h-20 bg-slate-600 rounded-lg flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                        채용
                    </div>
                    <div class="flex-1">
                        <div class="flex items-center gap-3 mb-2">
                            <h2 class="text-2xl font-bold text-slate-800">{{ jobPosting.title }}</h2>
                            <span :class="getStatusClass(jobPosting.status)"
                                class="px-3 py-1 text-sm rounded-full font-medium">
                                {{ jobPosting.status }}
                            </span>
                        </div>

                        <div class="space-y-2 text-gray-600 mb-4">
                            <div class="flex items-center gap-2">
                                <Building2 :size="20" />
                                {{ jobPosting.department }} • {{ jobPosting.employmentType }}
                            </div>
                            <div class="flex items-center gap-2">
                                <MapPin :size="20" />
                                {{ jobPosting.location }}
                            </div>
                            <div class="flex items-center gap-2">
                                <Briefcase :size="20" />
                                {{ jobPosting.experience }} • {{ jobPosting.position }}
                            </div>
                        </div>

                        <div class="flex gap-2 flex-wrap">
                            <span v-for="(tech, index) in jobPosting.techStack.slice(0, 3)" :key="index"
                                class="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                                {{ tech }}
                            </span>
                            <span v-if="jobPosting.techStack.length > 3"
                                class="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                                +{{ jobPosting.techStack.length - 3 }}
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            <!-- 오른쪽: 액션 버튼 -->
            <section>
                <div class="space-y-3">
                    <button @click="$emit('edit')"
                        class="w-full px-4 py-3 bg-white text-slate-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm font-medium hover:cursor-pointer">
                        공고 수정
                    </button>
                    <button @click="$emit('pause')"
                        class="w-full px-4 py-3 bg-white text-slate-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm font-medium hover:cursor-pointer">
                        모집 중단
                    </button>
                    <button @click="$emit('delete')"
                        class="w-full px-4 py-3 bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 transition text-sm font-medium hover:cursor-pointer">
                        공고 삭제
                    </button>
                </div>
            </section>
        </div>

        <!-- 연봉 섹션 -->
        <div class="bg-slate-50 rounded-lg p-4 border border-slate-200 mb-6">
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <DollarSign :size="24" class="text-slate-600" />
                    <div>
                        <div class="text-sm text-gray-600">연봉</div>
                        <div class="text-xl font-bold text-slate-800">{{ jobPosting.salary }}</div>
                    </div>
                </div>
                <span class="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full font-medium">
                    {{ jobPosting.salaryNegotiable }}
                </span>
            </div>
        </div>

        <!-- 탭 네비게이션 -->
        <div class="border-b border-gray-200">
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
                    ]"
                >
                    {{ tab.name }}
                </button>
            </nav>
        </div>
    </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import { Building2, MapPin, Briefcase, DollarSign } from 'lucide-vue-next'

interface TabItem {
  id: string
  name: string
}

interface JobPosting {
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
  jobPosting: JobPosting
  tabs: TabItem[]
  activeTab: string
}>()

const emit = defineEmits(['edit', 'pause', 'delete', 'update:activeTab'])

const handleEditClick = () => emit('edit')
const handlePauseClick = () => emit('pause')
const handleDeleteClick = () => emit('delete')

const getStatusClass = (status: string) => {
  if (status === '채용중') return 'bg-green-100 text-green-700'
  if (status === '마감') return 'bg-gray-200 text-gray-600'
  return 'bg-gray-100 text-gray-700'
}
</script>
