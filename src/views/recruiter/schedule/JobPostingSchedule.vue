<template>
  <div class="min-h-screen p-6 bg-gray-50">
    <!-- 헤더 -->
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-slate-600 mb-2">채용 공고 관리</h1>
        <p class="text-gray-600">공고별 채용 프로세스를 체계적으로 관리하세요</p>
      </div>
      <div class="flex gap-3">
        <button
          @click="openShareModal"
          class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 shadow-sm"
        >
          <Share2 class="w-5 h-5" />
          공고 공유
        </button>
        <button
          @click="openAddJobModal"
          class="px-6 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition flex items-center gap-2 shadow-sm"
        >
          <Plus class="w-5 h-5" />
          공고 등록
        </button>
      </div>
    </div>

    <!-- 통계 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      <div v-for="stat in statistics" :key="stat.label" class="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
        <p class="text-sm text-gray-600 mb-2">{{ stat.label }}</p>
        <div class="flex items-center gap-3">
          <div :class="['w-10 h-10 rounded-lg flex items-center justify-center', getIconBgClass(stat.color)]">
            <Calendar v-if="stat.icon === 'calendar'" :class="['w-5 h-5', getIconColorClass(stat.color)]" />
            <Clock v-else-if="stat.icon === 'clock'" :class="['w-5 h-5', getIconColorClass(stat.color)]" />
            <AlertCircle v-else-if="stat.icon === 'alert'" :class="['w-5 h-5', getIconColorClass(stat.color)]" />
            <Users v-else-if="stat.icon === 'users'" :class="['w-5 h-5', getIconColorClass(stat.color)]" />
            <Check v-else-if="stat.icon === 'check'" :class="['w-5 h-5', getIconColorClass(stat.color)]" />
          </div>
          <p :class="['text-2xl font-bold', getValueColorClass(stat.color, stat.isAlert)]">{{ stat.value }}</p>
        </div>
      </div>
    </div>

    <!-- 파이프라인 -->
    <div class="bg-white rounded-lg shadow p-3 mb-5">
      <h3 class="text-center font-bold text-slate-600 mb-2 text-xs tracking-tight">채용 파이프라인</h3>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-1.5">
        <div v-for="stage in pipelineStages" :key="stage.name" class="flex flex-col items-center justify-center p-2 bg-gray-50 rounded-md hover:bg-gray-100 transition">
          <div class="flex items-center gap-1.5 mb-1">
            <div :class="['w-3 h-3 rounded-full flex-shrink-0', stage.color]"></div>
            <span class="text-xs font-medium text-gray-700 whitespace-nowrap">{{ stage.name }}</span>
          </div>
          <span class="text-base font-bold text-slate-600">{{ stage.count }}명</span>
        </div>
      </div>
    </div>

    <!-- 필터 및 검색 -->
    <div class="bg-white rounded-xl shadow-lg mb-6 p-6 border border-gray-100">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-2">
          <div class="w-10 h-10 bg-gradient-to-br from-slate-500 to-slate-600 rounded-lg flex items-center justify-center">
            <Filter class="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 class="font-bold text-gray-900">필터 & 검색</h3>
            <p class="text-xs text-gray-500">원하는 조건으로 공고를 찾아보세요</p>
          </div>
        </div>
        <button
          v-if="hasActiveFilters"
          @click="resetFilters"
          class="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition flex items-center gap-1"
        >
          <X class="w-4 h-4" />
          필터 초기화
        </button>
      </div>

      <div class="flex flex-col gap-4">
        <!-- 검색바 -->
        <div class="relative">
          <Search class="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="공고명, 포지션, 부서명으로 검색..."
            class="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent text-sm transition"
          />
          <div v-if="searchQuery" class="absolute right-4 top-1/2 transform -translate-y-1/2">
            <button
              @click="searchQuery = ''"
              class="text-gray-400 hover:text-gray-600 transition"
            >
              <X class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- 필터 옵션들 -->
        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
          <div class="relative">
            <label class="block text-xs font-semibold text-gray-600 mb-1.5">직무</label>
            <div class="relative">
              <Briefcase class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <select
                v-model="filters.position"
                class="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent text-sm appearance-none bg-white cursor-pointer hover:border-gray-300 transition"
              >
                <option value="">전체 직무</option>
                <option value="frontend">프론트엔드 개발자</option>
                <option value="backend">백엔드 개발자</option>
                <option value="fullstack">풀스택 개발자</option>
                <option value="mobile">모바일 개발자</option>
                <option value="designer">UI/UX 디자이너</option>
                <option value="pm">프로덕트 매니저</option>
                <option value="marketing">마케팅 매니저</option>
              </select>
              <ChevronDown class="w-4 h-4 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div class="relative">
            <label class="block text-xs font-semibold text-gray-600 mb-1.5">부서</label>
            <div class="relative">
              <Building class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <select
                v-model="filters.department"
                class="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent text-sm appearance-none bg-white cursor-pointer hover:border-gray-300 transition"
              >
                <option value="">전체 부서</option>
                <option value="개발팀">개발팀</option>
                <option value="디자인팀">디자인팀</option>
                <option value="프로덕트팀">프로덕트팀</option>
                <option value="마케팅팀">마케팅팀</option>
                <option value="영업팀">영업팀</option>
                <option value="인사팀">인사팀</option>
              </select>
              <ChevronDown class="w-4 h-4 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div class="relative">
            <label class="block text-xs font-semibold text-gray-600 mb-1.5">경력</label>
            <div class="relative">
              <Award class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <select
                v-model="filters.experience"
                class="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent text-sm appearance-none bg-white cursor-pointer hover:border-gray-300 transition"
              >
                <option value="">전체 경력</option>
                <option value="신입">신입</option>
                <option value="1-3년">1-3년</option>
                <option value="3-5년">3-5년</option>
                <option value="5년 이상">5년+</option>
              </select>
              <ChevronDown class="w-4 h-4 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div class="relative">
            <label class="block text-xs font-semibold text-gray-600 mb-1.5">고용형태</label>
            <div class="relative">
              <FileText class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <select
                v-model="filters.type"
                class="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent text-sm appearance-none bg-white cursor-pointer hover:border-gray-300 transition"
              >
                <option value="">전체 형태</option>
                <option value="정규직">정규직</option>
                <option value="계약직">계약직</option>
                <option value="인턴">인턴</option>
                <option value="프리랜서">프리랜서</option>
              </select>
              <ChevronDown class="w-4 h-4 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div class="relative">
            <label class="block text-xs font-semibold text-gray-600 mb-1.5">상태</label>
            <div class="relative">
              <Check class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <select
                v-model="filters.status"
                class="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent text-sm appearance-none bg-white cursor-pointer hover:border-gray-300 transition"
              >
                <option value="">전체 상태</option>
                <option value="recruiting">채용중</option>
                <option value="screening">서류검토</option>
                <option value="interviewing">면접중</option>
                <option value="closed">마감</option>
                <option value="paused">중단</option>
              </select>
              <ChevronDown class="w-4 h-4 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        <!-- 검색 결과 -->
        <div class="flex items-center justify-between pt-2 border-t">
          <p class="text-sm text-gray-600">
            <span class="font-bold text-slate-600">{{ filteredJobs.length }}개</span>의 공고가 검색되었습니다
          </p>
        </div>
      </div>
    </div>

    <!-- 캘린더 뷰 -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- 캘린더 -->
      <div class="lg:col-span-2">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-bold text-slate-600">{{ currentYearMonth }}</h2>
            <div class="flex gap-2">
              <button @click="previousMonth" class="p-2 hover:bg-gray-100 rounded-lg transition">
                <ChevronLeft class="w-5 h-5" />
              </button>
              <button @click="goToToday" class="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                오늘
              </button>
              <button @click="nextMonth" class="p-2 hover:bg-gray-100 rounded-lg transition">
                <ChevronRight class="w-5 h-5" />
              </button>
            </div>
          </div>

          <!-- 드래그 안내 -->
          <div class="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div class="flex items-start gap-2">
              <CalendarDays class="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <div class="text-sm text-blue-700">
                <p><strong>TIP:</strong></p>
                <ul class="list-disc list-inside space-y-1 mt-1">
                  <li>날짜를 드래그하여 공고 기간을 설정하고 등록할 수 있습니다</li>
                  <li>빈 날짜를 더블클릭하면 바로 일정을 등록할 수 있습니다</li>
                  <li>일정이 하나만 있는 날짜를 더블클릭하면 상세정보를 볼 수 있습니다</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- 캘린더 그리드 -->
          <div class="grid grid-cols-7 gap-2 select-none">
            <div v-for="day in WEEK_DAYS" :key="day" class="text-center py-3 text-sm font-semibold text-gray-600">
              {{ day }}
            </div>

            <div
              v-for="(dateObj, index) in calendarDates"
              :key="index"
              :class="[
                'aspect-square border rounded-lg p-2 cursor-pointer transition-all',
                dateObj.isToday ? 'border-2 border-slate-600 bg-slate-50' : (dateObj.jobsStarting && dateObj.jobsStarting.length > 0) || (dateObj.jobsEnding && dateObj.jobsEnding.length > 0) ? 'border-gray-200 bg-blue-50' : 'border-gray-200',
                !dateObj.date && 'border-0 cursor-default',
                dateObj.date && !isDragging && 'hover:bg-blue-50 hover:border-blue-300',
                isDateInDragRange(index) && 'bg-blue-200 border-blue-400 ring-2 ring-blue-300',
                dragStartIndex === index && isDragging && 'bg-blue-300 border-blue-500',
                dragEndIndex === index && isDragging && 'bg-blue-300 border-blue-500'
              ]"
              @mousedown="dateObj.date && startDrag(index, dateObj, currentDate)"
              @mouseenter="dateObj.date && updateDrag(index, currentDate)"
              @mouseup="dateObj.date && endDrag()"
              @click="dateObj.date && handleCellClick(dateObj)"
            >
              <template v-if="dateObj.date">
                <div :class="['text-sm mb-1 pointer-events-none', dateObj.isToday ? 'font-bold text-slate-600' : 'text-gray-600', isDateInDragRange(index) && 'text-blue-900 font-bold']">
                  {{ dateObj.date }}
                </div>
                <div v-if="dateObj.isToday" class="text-xs text-slate-600 font-semibold pointer-events-none">오늘</div>
                <div v-if="dateObj.jobsStarting.length > 0 || dateObj.jobsEnding.length > 0" class="space-y-1 mt-1">
                  <!-- 시작하는 공고 -->
                  <div
                    v-for="job in dateObj.jobsStarting.slice(0, 2)"
                    :key="'start-' + job.id"
                    :class="['text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1 cursor-pointer hover:opacity-90 font-semibold', getJobColorClass(job)]"
                    @click.stop="handleJobClick(dateObj, job)"
                  >
                    <div class="flex items-center gap-1 truncate">
                      <Share2
                        v-if="job.sharedWith && job.sharedWith.length > 0"
                        class="w-2.5 h-2.5 text-blue-600 flex-shrink-0"
                      />
                      <span
                        v-if="job.postedDate && job.deadline && (job.postedDate !== job.deadline)"
                        class="text-[10px] text-gray-600 ml-1 flex-shrink-0 font-medium"
                      >
                        [{{ job.postedDate.split('-')[1] + "/" + job.postedDate.split('-')[2] }}~{{ job.deadline.split('-')[1] + "/" + job.deadline.split('-')[2] }}]
                      </span>

                      <span class="text-[11px] font-medium text-gray-800 leading-tight break-words line-clamp-2">
                        {{ job.title }}
                      </span>
                    </div>
                  </div>
                  
                  <!-- 끝나는 공고 -->
                  <template v-for="job in dateObj.jobsEnding.slice(0, 2)" :key="'end-' + job.id">
                    <div
                      v-if="job.postedDate && job.deadline && job.postedDate !== job.deadline"
                      :class="[
                        'text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1 cursor-pointer hover:opacity-90 font-semibold',
                        getJobColorClass(job)
                      ]"
                      @click.stop="handleJobClick(dateObj, job)"
                    >
                      <div class="flex items-center gap-1 truncate">
                        <Share2
                          v-if="job.sharedWith && job.sharedWith.length > 0"
                          class="w-2.5 h-2.5 text-blue-600 flex-shrink-0"
                        />
                        <span class="text-[10px] text-gray-600 ml-1 flex-shrink-0 font-medium">
                          [{{ job.postedDate.split('-')[1] + '/' + job.postedDate.split('-')[2] }}~
                          {{ job.deadline.split('-')[1] + '/' + job.deadline.split('-')[2] }}]
                        </span>
                        <span class="text-[11px] font-medium text-gray-800 leading-tight break-words line-clamp-2">
                          {{ job.title }}
                        </span>
                      </div>
                    </div>
                  </template>

                  
                  <div v-if="(dateObj.jobsStarting.length + dateObj.jobsEnding.length) > 2" class="text-xs text-gray-500 font-semibold pointer-events-none">
                    +{{ (dateObj.jobsStarting.length + dateObj.jobsEnding.length) - 2 }}건
                  </div>
                </div>
              </template>
            </div>
          </div>

          <!-- 범례 -->
          <div class="flex flex-wrap items-center gap-4 mt-6 pt-4 border-t">
            <div class="flex items-center gap-2">
              <div class="w-4 h-4 bg-slate-50 border-2 border-slate-600 rounded"></div>
              <span class="text-sm text-gray-600">오늘</span>
            </div>
            <div class="flex items-center gap-2">
              <Share2 class="w-4 h-4 text-blue-600" />
              <span class="text-sm text-gray-600">공유된 공고</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-4 h-4 bg-green-100 rounded"></div>
              <span class="text-sm text-gray-600">채용중</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-4 h-4 bg-red-100 rounded"></div>
              <span class="text-sm text-gray-600">마감임박</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 사이드바 -->
      <div class="lg:col-span-1">
        <div class="grid grid-cols-1 gap-6">
          <!-- 선택된 날짜의 공고 -->
          <div class="bg-white rounded-lg shadow p-5">
            <h3 class="text-lg font-bold text-slate-600 mb-4">{{ selectedDateLabel }}</h3>
            <div v-if="selectedDateJobs.length > 0" class="space-y-3 max-h-96 overflow-y-auto">
              <div
                v-for="job in selectedDateJobs"
                :key="job.id"
                :class="['border-l-4 p-3 rounded transition-all cursor-pointer hover:shadow-md', getJobBorderClass(job)]"
                @click="viewJobDetail(job.id)"
              >
                <div class="flex items-start justify-between mb-2">
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 mb-1">
                      <Briefcase class="w-3 h-3 flex-shrink-0" />
                      <span class="text-xs font-semibold text-gray-500 uppercase">{{ job.department }}</span>
                      <Share2 v-if="job.sharedWith && job.sharedWith.length > 0" class="w-3 h-3 text-blue-600" />
                    </div>
                    <p class="font-semibold text-sm text-gray-900">{{ job.title }}</p>
                    <p class="text-xs text-gray-600">{{ job.experience }} · {{ job.type }}</p>
                  </div>
                  <div class="flex flex-col gap-1 items-end ml-2">
                    <span
                      :class="[
                        'px-2 py-0.5 text-xs font-semibold rounded',
                        getStatusClass(job.status)
                      ]"
                    >
                      {{ getStatusLabel(job.status) }}
                    </span>
                  </div>
                </div>
                <div class="text-xs text-gray-600 space-y-1">
                  <p class="flex items-center gap-1">
                    <Calendar class="w-3 h-3" />
                    {{ job.postedDate }} ~ {{ job.deadline }}
                  </p>
                  <p class="flex items-center gap-1"><Clock class="w-3 h-3" />{{ job.time }}</p>
                  <p class="flex items-center gap-1">
                    <Users class="w-3 h-3" />
                    지원자: {{ job.applicants }}명
                  </p>
                </div>
                <div class="flex gap-2 mt-2">
                  <button
                    @click.stop="editSchedule(job.id)"
                    class="flex-1 py-1.5 bg-slate-100 text-slate-700 text-xs rounded hover:bg-slate-200 transition"
                  >
                    수정
                  </button>
                  <button
                    @click.stop="shareJob(job.id)"
                    class="flex-1 py-1.5 bg-blue-100 text-blue-700 text-xs rounded hover:bg-blue-200 transition flex items-center justify-center gap-1"
                  >
                    <Share2 class="w-3 h-3" />공유
                  </button>
                </div>
              </div>
            </div>

            <div v-else class="text-center py-6 text-gray-500 text-sm">
              선택한 날짜에 공고가 없습니다
            </div>
          </div>

          <!-- 빠른 작업 -->
          <div class="bg-white rounded-lg shadow p-5">
            <h3 class="text-lg font-bold text-slate-600 mb-4">빠른 작업</h3>
            <div class="space-y-2">
              <button @click="openAddJobModal" class="w-full py-2 px-4 text-sm text-left text-white bg-slate-600 rounded-lg hover:bg-slate-700 flex items-center gap-2 transition">
                <Plus class="w-4 h-4" />공고 등록
              </button>
              <button @click="alert('전체 공고 보기')" class="w-full py-2 px-4 text-sm text-left text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 transition">
                <FileText class="w-4 h-4" />전체 공고 보기
              </button>
              <button @click="alert('채용 리포트')" class="w-full py-2 px-4 text-sm text-left text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 transition">
                <BarChart class="w-4 h-4" />채용 리포트
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 공고 생성/수정 모달 -->
    <JobPostingScheduleCreate
      :show-modal="showAddJobModal"
      :editing-id="editingJobId"
      :initial-data="editingJobData"
      :team-members="teamMembers"
      @close="closeAddJobModal"
      @save="handleSaveJob"
      @delete="handleDelete"
    />

    <!-- 공고 공유 모달 -->
    <JobPostingScheduleShare
      :show-modal="showShareModal"
      :available-jobs="availableJobs"
      :team-members="teamMembers"
      :initial-selected-members="selectedSharedMembers"
      @close="closeShareModal"
      @confirm="handleConfirmShare"
    />

    <!-- 공고 상세정보 모달 -->
    <JobPostingScheduleDetail
      :show-modal="showDetailModal"
      :schedule="selectedSchedule"
      :team-members="teamMembers"
      @close="closeDetailModal"
      @edit="handleEditFromDetail"
      @share="handleShareFromDetail"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { 
  Plus, Share2, ChevronLeft, ChevronRight, CalendarDays, Calendar, Clock, 
  AlertCircle, Users, Check, Briefcase, FileText, Filter, X, Search, 
  ChevronDown, Building, Award, BarChart
} from 'lucide-vue-next'
import JobPostingScheduleCreate from './JobPostingSchedule_Create.vue'
import JobPostingScheduleShare from './JobPostingSchedule_Share.vue'
import JobPostingScheduleDetail from './JobPostingSchedule_Detail.vue'


// API
import { getJobPostingSchedules, createJobPostingSchedule, updateJobPostingSchedule, shareJobPostingSchedule } from '@/api/schedules/jobposting/jobposting'

const jobs = ref<any[]>([])  // ✅ 더미 데이터 삭제

const isLoading = ref(false)
const errorMessage = ref('')
const selectedShareJobId = ref<number | null>(null)
const selectedSharedMembers = ref<number[]>([])

// ✅ 공고 목록 불러오기
const fetchJobPostings = async () => {
  try {
    isLoading.value = true

    const result = await getJobPostingSchedules()  // ✅ 배열 자체 반환됨
    console.log('📌 서버 응답:', result)

    jobs.value = Array.isArray(result) ? result : []

  } catch (error) {
    console.error('❌ 공고 목록 오류:', error)
    errorMessage.value = '공고 목록을 불러오는데 실패했습니다.'
    jobs.value = []
  } finally {
    isLoading.value = false
  }
}

// ✅ 공고 저장
const handleSaveJob = async (jobData: any) => {
  try {
    console.log('📌 서버에 보낼 데이터:', jobData)

    if (editingJobId.value) {
      // ✅ 수정
      await updateJobPostingSchedule(editingJobId.value, jobData)
      alert('✅ 공고가 수정되었습니다!')
    } else {
      // ✅ 신규 등록
      await createJobPostingSchedule(jobData)
      alert('✅ 공고가 등록되었습니다!')
    }

    closeAddJobModal()
    fetchJobPostings() // ✅ 저장 후 목록 갱신
  } catch (error) {
    console.error('❌ 공고 저장 실패:', error)
    alert('공고 저장 중 오류가 발생했습니다.')
  }
}

// const handleConfirmShare = async (data: any) => {
//   try {
//     if (!data.jobs || data.jobs.length === 0) {
//       alert('❗ 공유할 공고를 선택하세요.')
//       return
//     }

//     // ✅ A 방식: 한 번에 하나만 공유
//     const jobId = data.jobs[0]
//     const userIds = data.members

//     console.log('📡 공유 요청 → jobId:', jobId, 'userIds:', userIds)

//     // ✅ 백엔드 공유 API 호출
//     await shareJobPostingSchedule(jobId, userIds)

//     alert(`✅ ${userIds.length}명에게 공고가 공유되었습니다.`)
//     closeShareModal()
//     fetchJobPostings() // ✅ 공유 반영 후 새로고침

//   } catch (error) {
//     console.error('❌ 공유 실패:', error)
//     alert('공유 중 오류가 발생했습니다.')
//   }
// }

onMounted(() => {
  fetchJobPostings()
})


// Constants
const WEEK_DAYS = ['일', '월', '화', '수', '목', '금', '토']

// State
const searchQuery = ref('')
const filters = ref({
  position: '',
  department: '',
  experience: '',
  type: '',
  status: ''
})

const showAddJobModal = ref(false)
const showShareModal = ref(false)
const showDetailModal = ref(false)
const editingJobId = ref<number | null>(null)
const editingJobData = ref(null)
const selectedSchedule = ref<any>(null)

// 드래그 상태
const isDragging = ref(false)
const dragStartIndex = ref<number | null>(null)
const dragEndIndex = ref<number | null>(null)
const selectedDateRange = ref<{ start: string | null; end: string | null }>({ start: null, end: null })

// 더블클릭 감지를 위한 state
const lastClickTime = ref(0)
const lastClickedCell = ref<any>(null)

// Data
const currentDate = ref(new Date())
const selectedDate = ref(new Date())

// const jobs = ref([
//   {
//     id: 1, title: '프론트엔드 개발자 (React)', department: '개발팀', experience: '3-5년', type: '정규직',
//     status: 'recruiting', postedDate: '2025-10-15', deadline: '2025-11-15', daysLeft: 20,
//     applicants: 45, progress: 65, screening: 45, interview1: 15, interview2: 8, final: 3, isUrgent: false
//   },
//   {
//     id: 2, title: '백엔드 개발자 (Node.js)', department: '개발팀', experience: '3-5년', type: '정규직',
//     status: 'screening', postedDate: '2025-10-10', deadline: '2025-11-10', daysLeft: 15,
//     applicants: 38, progress: 45, screening: 38, interview1: 0, interview2: 0, final: 0
//   },
//   {
//     id: 3, title: 'UI/UX 디자이너', department: '디자인팀', experience: '1-3년', type: '정규직',
//     status: 'recruiting', postedDate: '2025-10-17', deadline: '2025-11-19', daysLeft: 24,
//     applicants: 28, progress: 30, screening: 28, interview1: 0, interview2: 0, final: 0, sharedWith: [1, 2]
//   }
// ])

const teamMembers = ref([
  { id: 1, name: '김현수', role: 'CTO', department: '개발팀', email: 'kim@company.com' },
  { id: 2, name: '이지은', role: '개발팀 리드', department: '개발팀', email: 'lee@company.com' },
  { id: 3, name: '박민준', role: 'HR 매니저', department: '인사팀', email: 'park@company.com' },
  { id: 4, name: '정서아', role: '디자인 리드', department: '디자인팀', email: 'jung@company.com' }
])

const statistics = ref([
  { label: '전체 공고', value: '12건', icon: 'calendar', color: 'blue', isAlert: false },
  { label: '채용중', value: '8건', icon: 'clock', color: 'green', isAlert: false },
  { label: '마감 임박', value: '3건', icon: 'alert', color: 'red', isAlert: true },
  { label: '총 지원자', value: '324명', icon: 'users', color: 'purple', isAlert: false },
  { label: '이번달 채용', value: '5명', icon: 'check', color: 'green', isAlert: false }
])

const pipelineStages = ref([
  { name: '서류 전형', count: 111, color: 'bg-orange-500' },
  { name: '1차 면접', count: 23, color: 'bg-blue-500' },
  { name: '2차 면접', count: 11, color: 'bg-indigo-500' },
  { name: '최종 면접', count: 6, color: 'bg-purple-500' },
  { name: '처우 협상', count: 3, color: 'bg-pink-500' },
  { name: '온보딩 대기', count: 2, color: 'bg-green-500' }
])

// Computed
const currentYearMonth = computed(() => {
  return `${currentDate.value.getFullYear()}년 ${currentDate.value.getMonth() + 1}월`
})

const selectedDateLabel = computed(() => {
  const month = selectedDate.value.getMonth() + 1
  const day = selectedDate.value.getDate()
  const today = new Date()
  const diffTime = selectedDate.value.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  let label = `${month}월 ${day}일`
  
  if (diffDays === 0) label += ' (오늘)'
  else if (diffDays === 1) label += ' (내일)'
  else if (diffDays === -1) label += ' (어제)'
  return label
})


const filteredJobs = computed(() => {
  // ✅ 배열이 아닐 경우 빈 배열 반환
  if (!Array.isArray(jobs.value)) {
    return []
  }

  let result = [...jobs.value] // ✅ 원본을 복사해서 사용

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(job =>
      job.title?.toLowerCase().includes(query) ||
      job.department?.toLowerCase().includes(query)
    )
  }

  if (filters.value.position) {
    result = result.filter(job => job.title?.toLowerCase().includes(filters.value.position))
  }

  if (filters.value.department) {
    result = result.filter(job => job.department === filters.value.department)
  }

  if (filters.value.experience) {
    result = result.filter(job => job.experience === filters.value.experience)
  }

  if (filters.value.type) {
    result = result.filter(job => job.type === filters.value.type)
  }

  if (filters.value.status) {
    result = result.filter(job => job.status === filters.value.status)
  }

  return result
})


const hasActiveFilters = computed(() => {
  return filters.value.position !== '' || filters.value.status !== '' || 
         filters.value.department !== '' || filters.value.experience !== '' || 
         filters.value.type !== '' || searchQuery.value !== ''
})

const calendarDates = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const daysInMonth = lastDay.getDate()
  const startDayOfWeek = firstDay.getDay()

  const dates = []
  
  // 이전 달 빈 칸
  for (let i = 0; i < startDayOfWeek; i++) {
    dates.push({ date: null, isToday: false, hasJobs: false, jobsStarting: [], jobsEnding: [] })
  }
  
  // 현재 달 날짜
  const today = new Date()
  for (let date = 1; date <= daysInMonth; date++) {
    const currentDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`
    
    // 해당 날짜에 시작하는 공고
    const jobsStarting = filteredJobs.value.filter(job => job.postedDate === currentDateStr)
    
    // 해당 날짜에 끝나는 공고
    const jobsEnding = filteredJobs.value.filter(job => job.deadline === currentDateStr)
    
    dates.push({
      date,
      isToday: year === today.getFullYear() && month === today.getMonth() && date === today.getDate(),
      hasJobs: jobsStarting.length > 0 || jobsEnding.length > 0,
      jobsStarting,
      jobsEnding
    })
  }
  
  return dates
})

const selectedDateJobs = computed(() => {
  const year = selectedDate.value.getFullYear()
  const month = selectedDate.value.getMonth()
  const date = selectedDate.value.getDate()
  const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`
  
  return filteredJobs.value.filter(job => 
    dateStr >= job.postedDate && dateStr <= job.deadline
  )
})

const availableJobs = computed(() => {
  return jobs.value.map(j => ({
    id: j.id,
    title: j.title,
    department: j.department,
    experience: j.experience,
    daysLeft: j.daysLeft,
    applicants: j.applicants,
    time: j.time,
    isUrgent: j.isUrgent
  }))
})

// Methods
const previousMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1)
}

const nextMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1)
}

const goToToday = () => {
  currentDate.value = new Date()
  selectedDate.value = new Date()

}

const handleCellClick = (dateObj: any) => {
  if (isDragging.value || !dateObj.date) return
  
  const currentTime = Date.now()
  const timeSinceLastClick = currentTime - lastClickTime.value
  
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dateObj.date).padStart(2, '0')}`
  
  const jobsOnDate = filteredJobs.value.filter(job => 
    dateStr >= job.postedDate && dateStr <= job.deadline
  )
  
  // 더블클릭 감지 (300ms 이내에 같은 셀 클릭)
  if (timeSinceLastClick < 300 && lastClickedCell.value?.date === dateObj.date) {
    // 더블클릭 - 일정이 하나만 있을 때만 동작
    if (jobsOnDate.length === 1) {
      // 일정이 하나면 해당 일정 등록 모달 열기
      editingJobData.value = {
        postedDate: dateStr,
        deadline: dateStr
      }
      openAddJobModal()
    }
    
    // 더블클릭 처리 후 초기화
    lastClickTime.value = 0
    lastClickedCell.value = null
  } else {
    // 싱글클릭 - 날짜 선택
    selectedDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), dateObj.date)
    lastClickTime.value = currentTime
    lastClickedCell.value = dateObj
  }
}

const handleJobClick = (date: any, job: any) => {
  selectedSchedule.value = job
  showDetailModal.value = true
}

const startDrag = (index: number, dateObj: any, date: Date) => {
  if (!dateObj.date) return
  
  isDragging.value = true
  dragStartIndex.value = index
  dragEndIndex.value = index
  
  const year = date.getFullYear()
  const month = date.getMonth()
  const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dateObj.date).padStart(2, '0')}`
  
  selectedDateRange.value.start = dateStr
  selectedDateRange.value.end = dateStr
}

const updateDrag = (index: number, date: Date) => {
  if (isDragging.value && dragStartIndex.value !== null) {
    dragEndIndex.value = index
    
    const year = date.getFullYear()
    const month = date.getMonth()
    
    const startIdx = Math.min(dragStartIndex.value, dragEndIndex.value)
    const endIdx = Math.max(dragStartIndex.value, dragEndIndex.value)
    
    // 시작 날짜와 종료 날짜 찾기
    let startDate = null
    let endDate = null
    
    for (let i = startIdx; i <= endIdx; i++) {
      const dateObj = calendarDates.value[i]
      if (dateObj && dateObj.date) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dateObj.date).padStart(2, '0')}`
        if (!startDate) startDate = dateStr
        endDate = dateStr
      }
    }
    
    if (startDate && endDate) {
      selectedDateRange.value.start = startDate
      selectedDateRange.value.end = endDate
    }
  }
}

const endDrag = () => {
  if (isDragging.value && selectedDateRange.value.start && selectedDateRange.value.end) {
    // 드래그로 기간 선택 완료 - 확인 창 표시
    const startDate = selectedDateRange.value.start
    const endDate = selectedDateRange.value.end

        // 하나의 셀만 선택된 경우 더블클릭 처리를 기다림
    if (startDate === endDate) {
      isDragging.value = false
      dragStartIndex.value = null
      dragEndIndex.value = null
      selectedDateRange.value = { start: null, end: null }
      return
    }
    
    const confirmed = confirm(`${startDate} ~ ${endDate}\n이 기간으로 채용 공고를 등록하시겠습니까?`)
    
    if (confirmed) {
      // 공고 등록 모달 열기
      editingJobData.value = {
        postedDate: startDate,
        deadline: endDate
      }
      openAddJobModal()
    }
  }
  
  isDragging.value = false
  dragStartIndex.value = null
  dragEndIndex.value = null
  
  // 확인 취소 시에도 드래그 범위 초기화
  if (!showAddJobModal.value) {
    selectedDateRange.value = { start: null, end: null }
  }
}

const isDateInDragRange = (index: number) => {
  if (!isDragging.value || dragStartIndex.value === null || dragEndIndex.value === null) return false
  const start = Math.min(dragStartIndex.value, dragEndIndex.value)
  const end = Math.max(dragStartIndex.value, dragEndIndex.value)
  return index >= start && index <= end
}

const resetFilters = () => {
  filters.value = { position: '', status: '', department: '', experience: '', type: '' }
  searchQuery.value = ''
}

const openAddJobModal = (opts?: { mode?: 'create' | 'edit' }) => {
  if (opts?.mode !== 'edit') {
    editingJobId.value = null
    editingJobData.value = null
  }
  showAddJobModal.value = true
}

const closeAddJobModal = () => {
  showAddJobModal.value = false
  editingJobData.value = null
  selectedDateRange.value = { start: null, end: null }
}

const openShareModal = () => {
  showShareModal.value = true
}

const closeShareModal = () => {
  showShareModal.value = false
}

const shareJob = (jobId: number) => {
  const job = jobs.value.find(j => j.id === jobId)
  if (job) {
    selectedShareJobId.value = jobId
    selectedSharedMembers.value = job.sharedWith || []   // ✅ 기존 공유 정보 전달
    showShareModal.value = true
  }
}

const editSchedule = async (jobId: number) => {
  // jobs 목록에서 해당 공고 찾기
  const job = jobs.value.find(j => j.id === jobId)
  if (job) {
    editingJobId.value = jobId
    editingJobData.value = {
      title: job.title,
      department: job.department,
      position: job.position,
      experience: job.experience,
      type: job.type,
      status: job.status,
      postedDate: job.postedDate,
      deadline: job.deadline,
      assignedTo: job.assignedTo || null,
      description: job.description || '',
    }

      console.log('🧩 [editSchedule] 호출됨 - jobId:', jobId)
      console.log('🧩 [editSchedule] editingJobId.value:', editingJobId.value)
      console.log('🧩 [editSchedule] editingJobData.value:', editingJobData.value)


      await nextTick() // ✅ props 전달 보장


    showAddJobModal.value = true // ✅ 생성/수정 모달 열기
  }
}


// const handleSaveJob = (jobData: any) => {
//   console.log('저장할 공고:', jobData)
  
//   if (jobData.id) {
//     // 수정
//     const index = jobs.value.findIndex(j => j.id === jobData.id)
//     if (index !== -1) {
//       jobs.value[index] = { 
//         ...jobs.value[index], 
//         ...jobData 
//       }
//       alert('공고가 수정되었습니다!')
//     }
//   } else {
//     // 새로 생성
//     const newId = Math.max(...jobs.value.map(j => j.id), 0) + 1
    
//     // daysLeft 계산
//     const today = new Date()
//     const deadline = new Date(jobData.deadline)
//     const daysLeft = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    
//     const newJob = {
//       id: newId,
//       title: jobData.title,
//       department: jobData.department,
//       experience: jobData.experience,
//       type: jobData.type,
//       status: jobData.status,
//       postedDate: jobData.postedDate,
//       deadline: jobData.deadline,
//       daysLeft: daysLeft,
//       applicants: 0,
//       progress: 0,
//       screening: 0,
//       interview1: 0,
//       interview2: 0,
//       final: 0,
//       isUrgent: jobData.isUrgent || daysLeft <= 7,
//       sharedWith: []
//     }
    
//     jobs.value.push(newJob)
//     alert('공고가 등록되었습니다!')
//   }
  
//   editingJobData.value = null
//   closeAddJobModal()
// }

const handleConfirmShare = async (data: any) => {
  try {
    console.log('공유 데이터:', data)

    // ✅ 로컬 UI 반영 (기존 코드 유지)
    data.jobs.forEach((jobId: number) => {
      const job = jobs.value.find(j => j.id === jobId)
      if (job) {
        const existingShares = job.sharedWith || []
        job.sharedWith = [...new Set([...existingShares, ...data.members])]
      }
    })

    // ✅ 서버 저장 (DB 반영)
    // → data.jobs 배열에 여러 개 있지만 지금은 하나씩 처리 (loop로 확장 가능)
    for (const jobId of data.jobs) {
      await shareJobPostingSchedule(jobId, data.members)
    }

    alert(`${data.jobs.length}개 공고가 ${data.members.length}명에게 공유되었습니다!`)
    closeShareModal()

  } catch (error) {
    console.error('❌ 공유 실패:', error)
    alert('공유 도중 오류가 발생했습니다.')
  }
}

const viewJobDetail = (jobId: number) => {
  const job = jobs.value.find(j => j.id === jobId)
  if (job) {
    selectedSchedule.value = job
    showDetailModal.value = true
  }
}

const closeDetailModal = () => {
  showDetailModal.value = false
  selectedSchedule.value = null
}

const handleEditFromDetail = (jobId: number) => {
  const job = jobs.value.find(j => j.id === jobId)
  if (job) {
    editingJobId.value = jobId
    editingJobData.value = { 
      id: job.id, 
      ...job }
    closeDetailModal()
    openAddJobModal({ mode: 'edit' })
  }
}

const handleShareFromDetail = (jobId: number) => {
  closeDetailModal()
  shareJob(jobId)
}

// Helper functions

type JobStatus = 'recruiting' | 'screening' | 'interviewing' | 'closed' | 'paused'


const JOB_STATUS_LABELS: Record<JobStatus, string> = {
  recruiting: '채용중',
  screening: '서류검토',
  interviewing: '면접중',
  closed: '마감',
  paused: '일시중단'
}

const JOB_STATUS_COLORS: Record<JobStatus, string> = {
  recruiting: 'bg-green-100 text-green-700',
  screening: 'bg-blue-100 text-blue-700',
  interviewing: 'bg-purple-100 text-purple-700',
  closed: 'bg-gray-100 text-gray-700',
  paused: 'bg-yellow-100 text-yellow-700'
}

const JOB_STATUS_BORDER_COLORS: Record<JobStatus, string> = {
  recruiting: 'border-green-500 bg-green-50',
  screening: 'border-blue-500 bg-blue-50',
  interviewing: 'border-purple-500 bg-purple-50',
  closed: 'border-gray-500 bg-gray-50',
  paused: 'border-yellow-500 bg-yellow-50'
}

const getJobColorClass = (job: any) => {
  if (job.isUrgent || job.daysLeft <= 3) return 'bg-red-100 text-red-700 font-semibold'
  return JOB_STATUS_COLORS[job.status as JobStatus]
}

const getJobBorderClass = (job: any) => {
  if (job.isUrgent || job.daysLeft <= 3) return 'border-red-500 bg-red-50'
  return JOB_STATUS_BORDER_COLORS[job.status as JobStatus]
}

const getStatusClass = (status: JobStatus) => JOB_STATUS_COLORS[status]
const getStatusLabel = (status: JobStatus) => JOB_STATUS_LABELS[status]

const getProgressColor = (progress: number) => {
  if (progress >= 75) return 'bg-green-500'
  if (progress >= 50) return 'bg-blue-500'
  if (progress >= 25) return 'bg-yellow-500'
  return 'bg-gray-400'
}

const getIconBgClass = (color: string) => {
  const classes: Record<string, string> = {
    blue: 'bg-blue-100', yellow: 'bg-yellow-100', red: 'bg-red-100',
    purple: 'bg-purple-100', green: 'bg-green-100'
  }
  return classes[color] || 'bg-gray-100'
}

const getIconColorClass = (color: string) => {
  const classes: Record<string, string> = {
    blue: 'text-blue-600', yellow: 'text-yellow-600', red: 'text-red-600',
    purple: 'text-purple-600', green: 'text-green-600'
  }
  return classes[color] || 'text-gray-600'
}

const getValueColorClass = (color: string, isAlert: boolean) => {
  if (isAlert) return 'text-red-600'
  const classes: Record<string, string> = {
    blue: 'text-blue-600', yellow: 'text-yellow-600', red: 'text-red-600',
    purple: 'text-purple-600', green: 'text-green-600'
  }
  return classes[color] || 'text-gray-900'
}

const handleDelete = (id: number) => {
  jobs.value = jobs.value.filter(job => job.id !== id)  // ✅ 리스트에서 삭제 반영
}


</script>
