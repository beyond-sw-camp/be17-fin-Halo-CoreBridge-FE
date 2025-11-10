<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import draggable from 'vuedraggable'
import { Calendar, Search, Filter } from 'lucide-vue-next'
import managementApi from '@/api/management/index'

// -------------------------
// Types
// -------------------------
interface Applicant {
  id: number
  name: string
  experience: number
  statusText: string
}

interface Stage {
  id: string
  name: string
  code: string
  bgClass: string
  textClass: string
  headerClass: string
  dotClass: string
  applicants: Applicant[]
}

interface StageColors {
  bg: string
  text: string
  header: string
  dot: string
}

// -------------------------
// Constants
// -------------------------
const STAGE_COLORS: Record<string, StageColors> = {
  applied: { bg: 'bg-gray-50', text: 'text-slate-600', header: 'bg-gray-100', dot: 'bg-gray-500' },
  screening: { bg: 'bg-blue-50', text: 'text-blue-600', header: 'bg-blue-100', dot: 'bg-blue-500' },
  interview1: { bg: 'bg-purple-50', text: 'text-purple-600', header: 'bg-purple-100', dot: 'bg-purple-500' },
  interview2: { bg: 'bg-orange-50', text: 'text-orange-600', header: 'bg-orange-100', dot: 'bg-orange-500' },
  final: { bg: 'bg-green-50', text: 'text-green-600', header: 'bg-green-100', dot: 'bg-green-500' }
}

const DEFAULT_STAGE = 'applied'
const SEARCH_FIELDS = ['name'] as const

// -------------------------
// Composables
// -------------------------
const router = useRouter()
const route = useRoute()

// -------------------------
// State
// -------------------------
const searchQuery = ref('')
const stages = ref<Stage[]>([])
const stageLists = ref<Record<string, Applicant[]>>({})


// -------------------------
// Computed
// -------------------------
const jobPostingId = computed(() => Number(route.params.id))
console.log(route.params)

// -------------------------
// Helper Functions
// -------------------------
const getStageColors = (code: string): StageColors => {
  return STAGE_COLORS[code] || STAGE_COLORS[DEFAULT_STAGE]
}

const matchesSearch = (applicant: Applicant): boolean => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) return true

  return SEARCH_FIELDS.some(field =>
    String(applicant[field]).toLowerCase().includes(query)
  )
}

const filteredCountByStage = (stageId: string): number => {
  return (stageLists.value[stageId] || []).filter(matchesSearch).length
}

// -------------------------
// Data Loading
// -------------------------
const loadData = async (): Promise<void> => {
  try {
    const response = await managementApi.getManagementBoard(jobPostingId.value)

    if (response.success) {
      stages.value = response.results.stages.map((stage) => {
        const colors = getStageColors(stage.code)
        return {
          id: String(stage.id),
          code: stage.code,
          name: stage.name,
          bgClass: colors.bg,
          textClass: colors.text,
          headerClass: colors.header,
          dotClass: colors.dot,
          applicants: stage.applicants.map((a) => ({
            id: a.id, 
            name: a.name,
            experience: a.experience,
            stageId: stage.code,
            statusText: `${a.daysSinceApplied}일 전 접수`,
          })),
        }
      })

      // vuedraggable용 데이터 매핑
      const map: Record<string, Applicant[]> = {}
      stages.value.forEach((stage) => {
        map[stage.id] = stage.applicants
      })
      stageLists.value = map
    }
  } catch (error) {
    console.error('데이터 로딩 실패:', error)
    alert('데이터를 불러오는 중 오류가 발생했습니다.')
  }
}

// -------------------------
// Event Handlers
// -------------------------
const onMove = async (event: any): Promise<void> => {
  const ctx = event.item?.__draggable_context
  if (!ctx) return

  const movedApplicant = ctx.element as Applicant
  const stageContainer = event.to.closest('[data-stage-id]')
  if (!stageContainer) return

  const newStageId = stageContainer.getAttribute('data-stage-id')

  try {
    // ✅ 인자 순서: jobPostingId → applicantId → stageCode
    const response = await managementApi.updateApplicantStage(
      jobPostingId.value,
      Number(movedApplicant.id),
      Number(newStageId)
    )

    if (response.success) {
      console.log(` ${movedApplicant.name} → ${newStageId} (서버 반영 완료)`)
    } else {
      throw new Error(response.message)
    }
  } catch (error) {
    console.error('단계 변경 실패:', error)
    alert('단계 변경 중 오류가 발생했습니다.')
  }
}


const viewApplicant = (applicantId: number): void => {
  router.push(`/jobposts/${jobPostingId.value}/applies/${applicantId}`)
}


const toggleFilter = (): void => {
  // TODO: 필터 기능 구현
}

const getAvatarColor = (stageCode: string): string => {
  return stageCode === 'final' ? 'bg-green-600' : 'bg-slate-600'
}

const getStatusColor = (stageCode: string): string => {
  return stageCode === 'final' ? 'text-green-600' : 'text-gray-600'
}

// -------------------------
// Lifecycle
// -------------------------
onMounted(loadData)
</script>

<template>
  <div class="bg-gray-50 min-h-screen">
    <main>
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <!-- Search & Filter -->
        <div class="flex gap-4 mb-6">
          <div class="flex-1 relative">
            <input v-model="searchQuery" type="text" placeholder="지원자 이름..."
              class="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600 focus:border-transparent" />
            <Search class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
          <button @click="toggleFilter"
            class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 transition-colors">
            <Filter class="w-5 h-5" />
            필터
          </button>
        </div>

        <!-- Management Board -->
        <div class="flex gap-4 overflow-x-auto pb-4">
          <div v-for="stage in stages" :key="stage.id" :data-stage-id="stage.id" class="flex-shrink-0 w-80">
            <!-- Stage Header -->
            <div :class="['rounded-lg p-4 mb-4 shadow-md', stage.headerClass]">
              <div class="flex items-center justify-between mb-2">
                <h3 class="font-bold text-slate-600 flex items-center gap-2">
                  <span :class="['w-3 h-3 rounded-full', stage.dotClass]"></span>
                  {{ stage.name }}
                </h3>
                <span class="text-sm text-gray-600 bg-white px-2 py-1 rounded font-bold">
                  {{ filteredCountByStage(stage.id) }}
                </span>
              </div>
            </div>

            <!-- Applicant Cards -->
            <draggable :list="stageLists[stage.id]" :group="{ name: 'applicants', pull: true, put: true }" item-key="id"
              @end="onMove" animation="200" ghost-class="opacity-50" class="space-y-3 min-h-[500px]">
              <template #item="{ element }">
                <div v-show="matchesSearch(element)" @click="viewApplicant(element.id)"
                  class="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:-translate-y-1 hover:shadow-lg transition-all duration-200 shadow-sm">
                  <div class="flex items-start justify-between mb-3">
                    <div class="flex items-center gap-3">
                      <div :class="[
                        'w-10 h-10 rounded-full flex items-center justify-center text-white font-medium',
                        getAvatarColor(element.stageId)
                      ]">
                        {{ element.name.charAt(0) }}
                      </div>
                      <div>
                        <div class="font-medium text-slate-600">{{ element.name }}</div>
                        <div class="text-xs text-gray-500">{{ element.experience }}년 경력</div>
                      </div>
                    </div>
                    <div :class="['flex items-center gap-2', getStatusColor(element.stageId)]">
                      <Calendar class="w-4 h-4" />
                      {{ element.statusText }}
                    </div>
                  </div>
                </div>
              </template>
            </draggable>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped></style>