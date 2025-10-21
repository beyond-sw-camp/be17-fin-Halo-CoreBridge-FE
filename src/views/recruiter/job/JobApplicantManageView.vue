<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import draggable from 'vuedraggable'
import { Calendar, Search, Filter } from 'lucide-vue-next'

interface Applicant {
  id: string
  name: string
  email: string
  experience: number
  stageId: string
  appliedDate: string
  interviewDate?: string
  statusText: string
  skills: string[]
}

interface Stage {
  id: string
  name: string
  bgClass: string
  textClass: string
  headerClass: string
  dotClass: string
}

const router = useRouter()
const searchQuery = ref('')

const stages = ref<Stage[]>([
  { id: 'applied',    name: '지원 완료',  bgClass: 'bg-gray-50',   textClass: 'text-slate-600',  headerClass: 'bg-gray-100',  dotClass: 'bg-gray-500' },
  { id: 'screening',  name: '서류 검토',  bgClass: 'bg-blue-50',   textClass: 'text-blue-600',   headerClass: 'bg-blue-100',  dotClass: 'bg-blue-500' },
  { id: 'interview1', name: '1차 면접',  bgClass: 'bg-purple-50', textClass: 'text-purple-600', headerClass: 'bg-purple-100',dotClass: 'bg-purple-500' },
  { id: 'interview2', name: '2차 면접',  bgClass: 'bg-orange-50', textClass: 'text-orange-600', headerClass: 'bg-orange-100',dotClass: 'bg-orange-500' },
  { id: 'final',      name: '최종 합격',  bgClass: 'bg-green-50',  textClass: 'text-green-600',  headerClass: 'bg-green-100', dotClass: 'bg-green-500' }
])

// 원본 데이터
const applicants = ref<Applicant[]>([
  { id: '1', name: '김민수', email: 'minsu.kim@email.com',  experience: 5, stageId: 'final',    appliedDate: '2025-10-10', statusText: '1일전', skills: ['Java', 'Spring', 'AWS'] },
  { id: '2', name: '이지은', email: 'jieun.lee@email.com',  experience: 3, stageId: 'applied',    appliedDate: '2025-10-11', statusText: '1일전', skills: ['Node.js', 'Python', 'Docker'] },
  { id: '3', name: '박서준', email: 'seojun.park@email.com', experience: 7, stageId: 'applied',    appliedDate: '2025-10-12', statusText: '1일전', skills: ['Go', 'Kubernetes'] },
  { id: '4', name: '최유진', email: 'yujin.choi@email.com',  experience: 4, stageId: 'screening',  appliedDate: '2025-10-13', statusText: '1일전', skills: ['C++', 'Redis'] },
  { id: '5', name: '정현우', email: 'hyunwoo.jung@email.com', experience: 6, stageId: 'interview1', appliedDate: '2025-10-10', statusText: '1일전', skills: ['Scala', 'Kafka'] }
])

// 컬럼별 '실제 배열' (여기에 드랍됨)
const stageLists = ref<Record<string, Applicant[]>>(
  stages.value.reduce((acc, s) => { acc[s.id] = []; return acc }, {} as Record<string, Applicant[]>)
)

// 초기 분배(같은 객체 참조를 컬럼 배열에 삽입)
for (const a of applicants.value) {
  stageLists.value[a.stageId].push(a)
}

// 드래그 종료: 라이브러리가 stageLists를 이동시켰으니, 객체의 stageId만 동기화
const onMove = (event: any) => {
  const movedApplicant = event.item.__draggable_context?.element as Applicant // 마우스로 집었을 때(드래그)의 어떤 지원자 객체인지 저장하기 위해서
  const stageContainer = event.to.closest('[data-stage-id]') // 드랍을 했을 때 떨어진 컬럼(목표 영역)을 DOM에서 찾는 역할
  const newStageId = stageContainer?.getAttribute('data-stage-id') || '' // 해당 DOM 요소에 달려 있는 data-stage-id 속성 값을 문자열로 꺼내온다
  if (newStageId && movedApplicant.stageId !== newStageId) {
    movedApplicant.stageId = newStageId
    console.log(`✅ ${movedApplicant.name} → ${newStageId}`)
  }
}

// 검색: 리스트는 고정, 카드만 보이기/숨김
const searchFields = ['name'] as const //applicants에 선언된 key 값 중에서 찾고자 하는 값 넣으면 됨

const matchesSearch = (a: Applicant) => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) return true

  return searchFields.some(field =>
    String(a[field]).toLowerCase().includes(query)
  )
}

// 헤더 카운트: “현재 보이는 카드 수(검색 반영)”
const filteredCountByStage = (stageId: string) =>
  stageLists.value[stageId].filter(matchesSearch).length

// 라우팅
const viewApplicant = (applicantId: string) => {
  router.push(`/recruiter/applicants/${applicantId}`)
}

// (옵션) 필터 버튼 더미
const toggleFilter = () => {}
</script>


<template>
  <div class="bg-gray-50 min-h-screen">
    <main >
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <!-- Search & Filter -->
        <div class="flex gap-4 mb-6">
          <div class="flex-1 relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="지원자 이름, 이메일 검색..."
              class="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600 focus:border-transparent"
            />
            <Search class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
          <button
            @click="toggleFilter"
            class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
          >
            <Filter class="w-5 h-5" />
            필터
          </button>
        </div>

        <!-- Kanban Columns -->
        <div class="flex gap-4 overflow-x-auto">
          <div
            v-for="stage in stages"
            :key="stage.id"
            :data-stage-id="stage.id"
            class="flex-shrink-0 w-80"
          >
            <!-- Column Header -->
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

            <!-- Cards (bind to real per-column list) -->
            <draggable
              :list="stageLists[stage.id]"
              :group="{ name: 'applicants', pull: true, put: true }"
              item-key="id"
              @end="onMove"
              animation="200"
              ghost-class="opacity-50"
              class="space-y-3 min-h-[500px]"
            >
              <template #item="{ element }">
                <div
                  v-show="matchesSearch(element)"
                  @click="viewApplicant(element.id)"
                  class="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:-translate-y-1 hover:shadow-lg transition-all duration-200 shadow-sm"
                >
                  <div class="flex items-start justify-between mb-3">
                    <div class="flex items-center gap-3">
                      <div
                        :class="[
                          'w-10 h-10 rounded-full flex items-center justify-center text-white font-medium',
                          element.stageId === 'final' ? 'bg-green-600' : 'bg-slate-600'
                        ]"
                      >
                        {{ element.name.charAt(0) }}
                      </div>
                      <div>
                        <div class="font-medium text-slate-600">{{ element.name }}</div>
                        <div class="text-xs text-gray-500">{{ element.experience }}년 경력</div>
                      </div>
                    </div>
                    <div
                      :class="[
                        'flex items-center gap-2',
                        element.stageId === 'final' ? 'text-green-600' : 'text-gray-600'
                      ]"
                    >
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

<style></style>
