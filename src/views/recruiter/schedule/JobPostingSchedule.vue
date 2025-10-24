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
          <!-- Position 필터 -->
          <div class="relative">
            <label class="block text-xs font-semibold text-gray-600 mb-1.5">직무</label>
            <div class="relative">
              <Briefcase class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <select
                v-model="filters.position"
                class="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent text-sm appearance-none bg-white cursor-pointer hover:border-gray-300 transition"
              >
                <option value="">전체 직무</option>
                <option
                  v-for="(label, key) in POSITION_MAP"
                  :key="key"
                  :value="key"
                >
                  {{ label }}
                </option>
              </select>
              <ChevronDown class="w-4 h-4 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          
          <!-- 부서 필터 -->
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

          <!-- 경력 필터 -->
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

          <!-- 고용형태 필터 -->
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

          <!-- 상태 필터 -->
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

        <!-- 활성 필터 표시 -->
        <div v-if="activeFiltersDisplay.length > 0" class="flex flex-wrap gap-2 pt-2 border-t">
          <span class="text-xs font-semibold text-gray-600">활성 필터:</span>
          <span
            v-for="(filter, index) in activeFiltersDisplay"
            :key="index"
            class="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium"
          >
            {{ filter.label }}: {{ filter.value }}
            <button
              @click="removeFilter(filter.key)"
              class="hover:bg-slate-200 rounded-full p-0.5 transition"
            >
              <X class="w-3 h-3" />
            </button>
          </span>
        </div>

        <!-- 검색 결과 카운트 -->
        <div class="flex items-center justify-between pt-2 border-t">
          <p class="text-sm text-gray-600">
            <span class="font-bold text-slate-600">{{ filteredJobs.length }}개</span>의 공고가 검색되었습니다
            <span v-if="hasActiveFilters || searchQuery" class="text-gray-400">
              (전체 {{ jobs.length }}개 중)
            </span>
          </p>
          <div class="flex items-center gap-2">
            <button
              @click="sortBy = 'deadline'"
              :class="[
                'px-3 py-1.5 text-xs rounded-lg transition flex items-center gap-1',
                sortBy === 'deadline'
                  ? 'bg-slate-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              ]"
            >
              <Calendar class="w-3 h-3" />
              마감일순
            </button>
            <button
              @click="sortBy = 'applicants'"
              :class="[
                'px-3 py-1.5 text-xs rounded-lg transition flex items-center gap-1',
                sortBy === 'applicants'
                  ? 'bg-slate-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              ]"
            >
              <Users class="w-3 h-3" />
              지원자순
            </button>
          </div>
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
              <button
                @click="previousMonth"
                class="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <ChevronLeft class="w-5 h-5" />
              </button>
              <button
                @click="goToToday"
                class="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                오늘
              </button>
              <button
                @click="nextMonth"
                class="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <ChevronRight class="w-5 h-5" />
              </button>
            </div>
          </div>

          <!-- 드래그 안내 메시지 -->
          <div class="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-2">
            <CalendarDays class="w-4 h-4 text-blue-600 flex-shrink-0" />
            <p class="text-sm text-blue-700">
              <strong>TIP:</strong> 캘린더에서 날짜를 드래그하여 공고 기간을 설정하고 등록할 수 있습니다
            </p>
          </div>

          <!-- 캘린더 그리드 -->
          <div class="grid grid-cols-7 gap-2 select-none">
            <!-- 요일 헤더 -->
            <div
              v-for="day in WEEK_DAYS"
              :key="day"
              class="text-center py-3 text-sm font-semibold text-gray-600"
            >
              {{ day }}
            </div>

            <!-- 날짜 칸 -->
            <div
              v-for="(dateObj, index) in calendarDates"
              :key="index"
              :class="[
                'aspect-square border rounded-lg p-2 cursor-pointer transition-all',
                dateObj.isToday
                  ? 'border-2 border-slate-600 bg-slate-50'
                  : dateObj.hasJobs
                  ? 'border-gray-200 bg-blue-50'
                  : 'border-gray-200',
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
                <div
                  :class="[
                    'text-sm mb-1 pointer-events-none',
                    dateObj.isToday ? 'font-bold text-slate-600' : 'text-gray-600',
                    isDateInDragRange(index) && 'text-blue-900 font-bold'
                  ]"
                >
                  {{ dateObj.date }}
                </div>
                <div v-if="dateObj.isToday" class="text-xs text-slate-600 font-semibold pointer-events-none">오늘</div>
                <div v-if="dateObj.jobs.length > 0" class="space-y-1 mt-1">
                  <div
                    v-for="job in dateObj.jobs.slice(0, 2)"
                    :key="job.id"
                    :class="[
                      'text-[11px] px-1.5 py-0.5 rounded truncate flex items-center justify-between gap-1 cursor-pointer hover:opacity-90 transition-all shadow-sm',
                      getJobColorClass(job)
                    ]"
                    :title="`${job.title} (${job.postedDate} ~ ${job.deadline})`"
                    @click.stop="handleJobClick(dateObj, job)"
                  >
                    <div class="flex items-center gap-1 truncate">
                      <Share2
                        v-if="job.sharedWith && job.sharedWith.length > 0"
                        class="w-2.5 h-2.5 text-blue-600 flex-shrink-0"
                      />
                      <span class="text-[11px] font-medium text-gray-800 leading-tight break-words line-clamp-2">
                        {{ job.title }}
                      </span>
                    </div>
                    <span
                      v-if="job.postedDate && job.deadline"
                      class="text-[10px] text-gray-600 ml-1 flex-shrink-0 font-medium"
                    >
                      {{ job.postedDate.split('-')[2] }}~{{ job.deadline.split('-')[2] }}
                    </span>
                  </div>

                  <div
                    v-if="dateObj.jobs.length > 2"
                    class="text-xs text-gray-500 font-semibold pointer-events-none"
                  >
                    +{{ dateObj.jobs.length - 2 }}건
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
              <div class="w-4 h-4 bg-blue-200 border-2 border-blue-400 rounded"></div>
              <span class="text-sm text-gray-600">드래그 선택</span>
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
              <div class="w-4 h-4 bg-blue-100 rounded"></div>
              <span class="text-sm text-gray-600">서류검토중</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-4 h-4 bg-purple-100 rounded"></div>
              <span class="text-sm text-gray-600">면접진행중</span>
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
            <h3 class="text-lg font-bold text-slate-600 mb-4">
              {{ selectedDateLabel }}
            </h3>
            <div v-if="selectedDateJobs.length > 0" class="space-y-3 max-h-96 overflow-y-auto">
              <div
                v-for="job in selectedDateJobs"
                :key="job.id"
                :class="[
                  'border-l-4 p-3 rounded transition-all cursor-pointer hover:shadow-md',
                  getJobBorderClass(job)
                ]"
                @click="viewJobDetail(job.id)"
              >
                <div class="flex items-start justify-between mb-2">
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 mb-1">
                      <Briefcase class="w-3 h-3 flex-shrink-0" />
                      <span class="text-xs font-semibold text-gray-500 uppercase">
                        {{ job.department }}
                      </span>
                      <Share2 
                        v-if="job.sharedWith && job.sharedWith.length > 0" 
                        class="w-3 h-3 text-blue-600" 
                        :title="`${job.sharedWith.length}명과 공유중`"
                      />
                    </div>
                    <p class="font-semibold text-sm text-gray-900">
                      {{ job.title }}
                    </p>
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
                    {{ job.postedDate }} <span v-if="job.deadline">~ {{ job.deadline }}</span>
                  </p>
                  <p class="flex items-center gap-1">
                    <Users class="w-3 h-3" />
                    지원자: {{ job.applicants }}명
                  </p>
                  <div class="flex items-center gap-1 mt-2">
                    <div class="flex-1 bg-gray-200 rounded-full h-1.5">
                      <div 
                        :class="['h-1.5 rounded-full', getProgressColor(job.progress)]"
                        :style="{ width: job.progress + '%' }"
                      ></div>
                    </div>
                    <span class="text-xs font-semibold text-gray-600">{{ job.progress }}%</span>
                  </div>
                </div>
                <button
                  @click.stop="shareJob(job.id)"
                  class="w-full mt-2 py-1.5 bg-blue-100 text-blue-700 text-xs rounded hover:bg-blue-200 transition flex items-center justify-center gap-1"
                >
                  <Share2 class="w-3 h-3" />
                  공유
                </button>
              </div>
            </div>
            <div v-else class="text-center py-6 text-gray-500 text-sm">
              선택한 날짜에 일정이 없습니다
            </div>
          </div>

          <!-- 빠른 작업 -->
          <div class="bg-white rounded-lg shadow p-5">
            <h3 class="text-lg font-bold text-slate-600 mb-4">빠른 작업</h3>
            <div class="space-y-2">
              <button
                @click="openAddJobModal"
                class="w-full py-2 px-4 text-sm text-left text-white bg-slate-600 rounded-lg hover:bg-slate-700 flex items-center gap-2 transition"
              >
                <Plus class="w-4 h-4" />
                공고 등록
              </button>
              <button
                @click="viewAllJobs"
                class="w-full py-2 px-4 text-sm text-left text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 transition"
              >
                <List class="w-4 h-4" />
                전체 공고 보기
              </button>
              <button
                @click="exportJobReport"
                class="w-full py-2 px-4 text-sm text-left text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 transition"
              >
                <FileText class="w-4 h-4" />
                공고 리포트
              </button>
              <button
                @click="manageTemplates"
                class="w-full py-2 px-4 text-sm text-left text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 transition"
              >
                <FileCheck class="w-4 h-4" />
                공고 템플릿
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 공고 공유 모달 -->
    <div
      v-if="showShareModal"
      class="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50"
      @click.self="closeShareModal"
    >
      <div class="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-bold text-slate-600">채용 공고 공유하기</h3>
          <button @click="closeShareModal" class="text-gray-400 hover:text-gray-600">
            <X class="w-6 h-6" />
          </button>
        </div>

        <!-- 공유 대상 선택 -->
        <div class="mb-6">
          <label class="block text-sm font-semibold text-gray-700 mb-3">공유 대상 선택</label>
          <div class="grid grid-cols-2 gap-3 mb-4">
            <div
              v-for="member in teamMembers"
              :key="member.id"
              :class="[
                'border-2 rounded-lg p-3 cursor-pointer transition-all',
                selectedMembers.includes(member.id)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              ]"
              @click="toggleMember(member.id)"
            >
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold">
                  {{ member.name.charAt(0) }}
                </div>
                <div class="flex-1 min-w-0">
                  <p class="font-semibold text-gray-900 truncate">{{ member.name }}</p>
                  <p class="text-xs text-gray-500 truncate">{{ member.role }}</p>
                </div>
                <div v-if="selectedMembers.includes(member.id)" class="flex-shrink-0">
                  <Check class="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </div>
          </div>

          <!-- 전체 선택/해제 -->
          <div class="flex gap-2">
            <button
              @click="selectAllMembers"
              class="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              전체 선택
            </button>
            <button
              @click="clearAllMembers"
              class="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              전체 해제
            </button>
          </div>
        </div>

        <!-- 공유할 공고 선택 -->
        <div class="mb-6">
          <label class="block text-sm font-semibold text-gray-700 mb-3">공유할 공고 선택</label>
          <div class="space-y-2 max-h-60 overflow-y-auto border rounded-lg p-3 bg-gray-50">
            <label
              v-for="job in filteredJobs"
              :key="job.id"
              :class="[
                'flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all',
                selectedJobs.includes(job.id)
                  ? 'bg-blue-100 border-2 border-blue-500'
                  : 'bg-white border-2 border-gray-200 hover:border-gray-300'
              ]"
            >
              <input
                v-model="selectedJobs"
                :value="job.id"
                type="checkbox"
                class="mt-1 w-4 h-4 text-blue-600 rounded"
              />
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-1">
                  <Briefcase class="w-3 h-3 text-gray-500 flex-shrink-0" />
                  <span class="text-xs font-semibold text-gray-500 uppercase">{{ job.department }}</span>
                  <span
                    v-if="job.sharedWith && job.sharedWith.length > 0"
                    class="text-xs text-blue-600"
                  >
                    ({{ job.sharedWith.length }}명 공유중)
                  </span>
                </div>
                <p class="font-semibold text-sm text-gray-900 truncate">{{ job.title }}</p>
                <div class="flex items-center gap-3 mt-1 text-xs text-gray-600">
                  <span class="flex items-center gap-1">
                    <Calendar class="w-3 h-3" />
                    마감: {{ job.deadline }}
                  </span>
                  <span :class="job.daysLeft <= 3 ? 'text-red-600 font-bold' : ''">
                    D-{{ job.daysLeft }}
                  </span>
                </div>
              </div>
            </label>
          </div>
          <div class="flex gap-2 mt-2">
            <button
              @click="selectAllJobs(filteredJobs)"
              class="px-3 py-1.5 text-xs border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              전체 선택
            </button>
            <button
              @click="clearAllJobs"
              class="px-3 py-1.5 text-xs border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              전체 해제
            </button>
            <button
              @click="selectUrgentJobs(filteredJobs)"
              class="px-3 py-1.5 text-xs border border-red-300 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition"
            >
              긴급 공고만
            </button>
          </div>
        </div>

        <!-- 공유 권한 설정 -->
        <div class="mb-6">
          <label class="block text-sm font-semibold text-gray-700 mb-3">공유 권한</label>
          <div class="space-y-2">
            <label class="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                v-model="shareSettings.permission"
                type="radio"
                value="view"
                class="w-4 h-4 text-blue-600"
              />
              <div>
                <p class="font-medium text-gray-900">보기 전용</p>
                <p class="text-xs text-gray-500">공고 정보와 지원자 현황만 확인 가능</p>
              </div>
            </label>
            <label class="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                v-model="shareSettings.permission"
                type="radio"
                value="edit"
                class="w-4 h-4 text-blue-600"
              />
              <div>
                <p class="font-medium text-gray-900">편집 가능</p>
                <p class="text-xs text-gray-500">공고 수정 및 지원자 관리 가능</p>
              </div>
            </label>
          </div>
        </div>

        <!-- 알림 설정 -->
        <div class="mb-6">
          <label class="flex items-center gap-3">
            <input
              v-model="shareSettings.sendNotification"
              type="checkbox"
              class="w-4 h-4 text-blue-600 rounded"
            />
            <div>
              <p class="font-medium text-gray-900">알림 보내기</p>
              <p class="text-xs text-gray-500">공유 대상에게 이메일 알림을 전송합니다</p>
            </div>
          </label>
        </div>

        <!-- 공유 메시지 -->
        <div class="mb-6">
          <label class="block text-sm font-semibold text-gray-700 mb-2">메시지 (선택사항)</label>
          <textarea
            v-model="shareSettings.message"
            rows="3"
            placeholder="공고 공유와 함께 전달할 메시지를 입력하세요..."
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          ></textarea>
        </div>

        <!-- 선택된 멤버 요약 -->
        <div v-if="selectedMembers.length > 0" class="mb-4 p-4 bg-blue-50 rounded-lg">
          <p class="text-sm font-semibold text-gray-700 mb-2">
            선택된 멤버 ({{ selectedMembers.length }}명)
          </p>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="memberId in selectedMembers"
              :key="memberId"
              class="px-3 py-1 bg-white rounded-full text-xs font-medium text-gray-700 flex items-center gap-1"
            >
              {{ getTeamMemberName(memberId) }}
              <button @click="toggleMember(memberId)" class="hover:text-red-600">
                <X class="w-3 h-3" />
              </button>
            </span>
          </div>
        </div>

        <!-- 선택된 공고 요약 -->
        <div v-if="selectedJobs.length > 0" class="mb-6 p-4 bg-green-50 rounded-lg">
          <p class="text-sm font-semibold text-gray-700 mb-2">
            선택된 공고 ({{ selectedJobs.length }}건)
          </p>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="jobId in selectedJobs"
              :key="jobId"
              class="px-3 py-1 bg-white rounded-full text-xs font-medium text-gray-700 flex items-center gap-1"
            >
              {{ getJobTitle(jobId) }}
              <button @click="toggleJob(jobId)" class="hover:text-red-600">
                <X class="w-3 h-3" />
              </button>
            </span>
          </div>
        </div>

        <!-- 액션 버튼 -->
        <div class="flex gap-3">
          <button
            @click="closeShareModal"
            class="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
          >
            취소
          </button>
          <button
            @click="confirmShare"
            :disabled="selectedMembers.length === 0 || selectedJobs.length === 0"
            :class="[
              'flex-1 px-4 py-2 rounded-lg text-white transition flex items-center justify-center gap-2',
              selectedMembers.length === 0 || selectedJobs.length === 0
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            ]"
          >
            <Share2 class="w-4 h-4" />
            {{ selectedJobs.length }}건 공고를 {{ selectedMembers.length }}명에게 공유
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- 공고 등록 모달 -->
  <div
    v-if="showAddJobModal"
    class="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    @click.self="closeAddJobModal"
  >
    <div class="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
      <!-- 모달 헤더 -->
      <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-gradient-to-br from-slate-500 to-slate-600 rounded-lg flex items-center justify-center">
            <Plus class="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 class="text-xl font-bold text-gray-900">새 채용 공고 등록</h2>
            <p class="text-sm text-gray-500">채용 공고 정보를 입력해주세요</p>
          </div>
        </div>
        <button
          @click="closeAddJobModal"
          class="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <X class="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <!-- 모달 내용 -->
      <div class="px-6 py-6">
        <!-- 기본 정보 섹션 -->
        <div class="mb-8">
          <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Briefcase class="w-5 h-5 text-slate-600" />
            기본 정보
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- 공고 제목 -->
            <div class="md:col-span-2">
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                공고 제목 <span class="text-red-500">*</span>
              </label>
              <input
                v-model="newJob.title"
                type="text"
                placeholder="예: 시니어 프론트엔드 개발자"
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition"
              />
            </div>

            <!-- 직무 -->
            <div class="md:col-span-2">
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                직무 <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <Briefcase class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <select
                  v-model="newJob.position"
                  class="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent appearance-none bg-white cursor-pointer transition"
                >
                  <option value="">직무 선택</option>
                  <option value="frontend">프론트엔드 개발자</option>
                  <option value="backend">백엔드 개발자</option>
                  <option value="fullstack">풀스택 개발자</option>
                  <option value="designer">UX/UI 디자이너</option>
                  <option value="pm">프로덕트 매니저</option>
                  <option value="marketing">마케팅</option>
                  <option value="sales">영업</option>
                </select>
                <ChevronDown class="w-4 h-4 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <!-- 부서 -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                부서 <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <Building class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <select
                  v-model="newJob.department"
                  class="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent appearance-none bg-white cursor-pointer transition"
                >
                  <option value="">부서 선택</option>
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

            <!-- 경력 -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                경력 <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <Award class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <select
                  v-model="newJob.experience"
                  class="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent appearance-none bg-white cursor-pointer transition"
                >
                  <option value="">경력 선택</option>
                  <option value="신입">신입</option>
                  <option value="1-3년">1-3년</option>
                  <option value="3-5년">3-5년</option>
                  <option value="5년 이상">5년 이상</option>
                </select>
                <ChevronDown class="w-4 h-4 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <!-- 고용형태 -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                고용형태 <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <Briefcase class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <select
                  v-model="newJob.type"
                  class="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent appearance-none bg-white cursor-pointer transition"
                >
                  <option value="">고용형태 선택</option>
                  <option value="정규직">정규직</option>
                  <option value="계약직">계약직</option>
                  <option value="인턴">인턴</option>
                  <option value="프리랜서">프리랜서</option>
                </select>
                <ChevronDown class="w-4 h-4 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <!-- 상태 -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                공고 상태
              </label>
              <div class="relative">
                <select
                  v-model="newJob.status"
                  class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent appearance-none bg-white cursor-pointer transition"
                >
                  <option value="recruiting">채용중</option>
                  <option value="screening">서류검토중</option>
                  <option value="interviewing">면접진행중</option>
                  <option value="closed">마감</option>
                  <option value="paused">일시중단</option>
                </select>
                <ChevronDown class="w-4 h-4 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        <!-- 일정 정보 섹션 -->
        <div class="mb-8">
          <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar class="w-5 h-5 text-slate-600" />
            일정 정보
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- 게시일 -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                게시일
              </label>
              <div class="relative">
                <Calendar class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  v-model="newJob.postedDate"
                  type="date"
                  class="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition"
                />
              </div>
            </div>

            <!-- 마감일 -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                마감일 <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <Calendar class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  v-model="newJob.deadline"
                  type="date"
                  :min="newJob.postedDate"
                  class="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- 상세 정보 섹션 (선택사항) -->
        <div class="mb-6">
          <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <FileText class="w-5 h-5 text-slate-600" />
            상세 정보 (선택사항)
          </h3>
          <div class="space-y-4">
            <!-- 공고 설명 -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                공고 설명
              </label>
              <textarea
                v-model="newJob.description"
                rows="3"
                placeholder="채용 공고에 대한 간단한 설명을 입력하세요..."
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition resize-none"
              ></textarea>
            </div>

            <!-- 지원 자격 -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                지원 자격
              </label>
              <textarea
                v-model="newJob.requirements"
                rows="3"
                placeholder="필수 자격 요건, 우대 사항 등을 입력하세요..."
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition resize-none"
              ></textarea>
            </div>

            <!-- 주요 업무 -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                주요 업무
              </label>
              <textarea
                v-model="newJob.responsibilities"
                rows="3"
                placeholder="담당하게 될 주요 업무를 입력하세요..."
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition resize-none"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- 안내 메시지 -->
        <div class="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div class="flex gap-3">
            <AlertCircle class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p class="text-sm font-medium text-blue-900 mb-1">등록 안내</p>
              <p class="text-sm text-blue-700">
                공고 등록 후 채용 일정에 자동으로 표시되며, 팀원들과 공유할 수 있습니다.
                필수 항목(*)은 반드시 입력해야 합니다.
              </p>
            </div>
          </div>
        </div>

        <!-- 액션 버튼 -->
        <div class="flex gap-3">
          <button
            @click="closeAddJobModal"
            class="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition"
          >
            취소
          </button>
          <button
            @click="saveNewJob"
            class="flex-1 px-6 py-3 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-lg font-semibold hover:from-slate-700 hover:to-slate-800 transition flex items-center justify-center gap-2 shadow-lg"
          >
            <Plus class="w-5 h-5" />
            공고 등록하기
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- 공고 세부 일정 모달 -->
  <div
    v-if="showJobDetailModal && selectedJobForDetail"
    class="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    @click.self="closeJobDetailModal"
  >
    <div class="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
      <!-- 모달 헤더 -->
      <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-2">
              <span :class="['px-3 py-1 rounded-full text-xs font-semibold', getStatusClass(selectedJobForDetail.status)]">
                {{ getStatusLabel(selectedJobForDetail.status) }}
              </span>
              <span v-if="selectedJobForDetail.isUrgent || selectedJobForDetail.daysLeft <= 3" class="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                긴급
              </span>
            </div>
            <h2 class="text-2xl font-bold text-gray-900 mb-1">{{ selectedJobForDetail.title }}</h2>
            <div class="flex flex-wrap items-center gap-3 text-sm text-gray-600">
              <div class="flex items-center gap-1">
                <Building class="w-4 h-4" />
                {{ selectedJobForDetail.department }}
              </div>
              <div class="flex items-center gap-1">
                <Award class="w-4 h-4" />
                {{ selectedJobForDetail.experience }}
              </div>
              <div class="flex items-center gap-1">
                <Briefcase class="w-4 h-4" />
                {{ selectedJobForDetail.type }}
              </div>
            </div>
          </div>
          <button
            @click="closeJobDetailModal"
            class="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X class="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>

      <!-- 모달 내용 -->
      <div class="px-6 py-6">
        <!-- 일정 정보 -->
        <div class="mb-6">
          <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar class="w-5 h-5 text-slate-600" />
            채용 일정
          </h3>
          <div class="grid grid-cols-2 gap-4">
            <div class="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p class="text-sm text-gray-600 mb-1">게시일</p>
              <p class="text-lg font-bold text-gray-900">{{ selectedJobForDetail.postedDate }}</p>
            </div>
            <div class="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p class="text-sm text-gray-600 mb-1">마감일</p>
              <div class="flex items-center justify-between">
                <p class="text-lg font-bold text-gray-900">{{ selectedJobForDetail.deadline }}</p>
                <span :class="[
                  'text-sm font-semibold px-2 py-1 rounded',
                  selectedJobForDetail.daysLeft <= 3 ? 'bg-red-100 text-red-700' :
                  selectedJobForDetail.daysLeft <= 7 ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                ]">
                  D-{{ selectedJobForDetail.daysLeft }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- 지원 현황 -->
        <div class="mb-6">
          <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Users class="w-5 h-5 text-slate-600" />
            지원 현황
          </h3>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div class="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p class="text-xs text-gray-600 mb-1">총 지원자</p>
              <p class="text-2xl font-bold text-gray-900">{{ selectedJobForDetail.applicants }}명</p>
            </div>
            <div class="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <p class="text-xs text-gray-600 mb-1">서류전형</p>
              <p class="text-2xl font-bold text-orange-700">{{ selectedJobForDetail.screening }}명</p>
            </div>
            <div class="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p class="text-xs text-gray-600 mb-1">1차 면접</p>
              <p class="text-2xl font-bold text-blue-700">{{ selectedJobForDetail.interview1 }}명</p>
            </div>
            <div class="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <p class="text-xs text-gray-600 mb-1">최종 면접</p>
              <p class="text-2xl font-bold text-purple-700">{{ selectedJobForDetail.final }}명</p>
            </div>
          </div>
        </div>

        <!-- 진행률 -->
        <div class="mb-6">
          <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp class="w-5 h-5 text-slate-600" />
            채용 진행률
          </h3>
          <div class="space-y-3">
            <div>
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-medium text-gray-700">전체 진행률</span>
                <span class="text-sm font-bold text-gray-900">{{ selectedJobForDetail.progress }}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-3">
                <div
                  :class="['h-3 rounded-full transition-all', getProgressColor(selectedJobForDetail.progress)]"
                  :style="{ width: `${selectedJobForDetail.progress}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- 공유 정보 -->
        <div v-if="selectedJobForDetail.sharedWith && selectedJobForDetail.sharedWith.length > 0" class="mb-6">
          <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Share2 class="w-5 h-5 text-slate-600" />
            공유 중
          </h3>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="memberId in selectedJobForDetail.sharedWith"
              :key="memberId"
              class="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium flex items-center gap-1"
            >
              <Users class="w-3 h-3" />
              {{ getTeamMemberName(memberId) }}
            </span>
          </div>
        </div>

        <!-- 액션 버튼 -->
        <div class="flex gap-3 pt-4 border-t border-gray-200">
          <button
            @click="closeJobDetailModal"
            class="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition"
          >
            닫기
          </button>
          <button
            @click="goToJobDetailPage(selectedJobForDetail.id)"
            class="flex-1 px-6 py-3 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-lg font-semibold hover:from-slate-700 hover:to-slate-800 transition flex items-center justify-center gap-2 shadow-lg"
          >
            <ExternalLink class="w-5 h-5" />
            상세 페이지로 이동
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
// 추가
import { POSITION_MAP } from '../../../constants/schedules/process/process'
import type { Statistic, PipelineStage } from '../../../types/schedules/process/process'
import { getIconBgClass, getIconColorClass, getValueColorClass} from '../../../constants/schedules/process/process'
import {
  Plus, ChevronLeft, ChevronRight, Calendar, CalendarDays, Users, Briefcase, Clock,
  List, FileText, FileCheck, Share2, X, Check, Filter, Search, ChevronDown, AlertCircle,
  Building, Award, MapPin, ExternalLink, TrendingUp
} from 'lucide-vue-next'
import type { Job, CalendarDate, Filters, TeamMember, ShareSettings } from '../../../types/schedules/jobposting/jobposting'
import { useJobCalendar, useDragSelect, useJobShare } from '../../../composable/schedules/jobposting/useJobPosting'
import { 
  WEEK_DAYS, getJobColorClass, getJobBorderClass, getStatusClass, 
  getStatusLabel, getProgressColor 
} from '../../../constants/schedules/jobposting/jobposting'

// State
const searchQuery = ref('')
const sortBy = ref<'deadline' | 'applicants'>('deadline')
const filters = ref<Filters>({ position: '', status: '', department: '', experience: '', type: '' })

// 공고 세부 일정 모달 상태
const showJobDetailModal = ref(false)
const selectedJobForDetail = ref<Job | null>(null)

// 공고 등록 모달 상태
const showAddJobModal = ref(false)
const newJob = ref({
  title: '',
  position: '',
  department: '',
  experience: '',
  type: '',
  status: 'recruiting' as JobStatus,
  postedDate: new Date().toISOString().split('T')[0],
  deadline: '',
  description: '',
  requirements: '',
  responsibilities: ''
})

// 추가
const statistics = ref<Statistic[]>([
  { label: '금주 면접', value: '12건', icon: 'calendar', color: 'blue', isAlert: false },
  { label: '오늘 일정', value: '4건', icon: 'clock', color: 'yellow', isAlert: false },
  { label: '긴급 처리', value: '3건', icon: 'alert', color: 'red', isAlert: true },
  { label: '진행중 지원자', value: '28명', icon: 'users', color: 'purple', isAlert: false },
  { label: '이번달 채용', value: '8명', icon: 'check', color: 'green', isAlert: false }
])

const pipelineStages = ref<PipelineStage[]>([
  { name: '서류 전형', count: 45, color: 'bg-orange-500' },
  { name: '1차 면접', count: 18, color: 'bg-blue-500' },
  { name: '2차 면접', count: 12, color: 'bg-indigo-500' },
  { name: '최종 면접', count: 7, color: 'bg-purple-500' },
  { name: '처우 협상', count: 4, color: 'bg-pink-500' },
  { name: '온보딩 대기', count: 3, color: 'bg-green-500' }
])

const jobs = ref<Job[]>([
  {
    id: 1, position: 'frontend', title: '시니어 프론트엔드 개발자', department: '개발팀', experience: '5년 이상', type: '정규직',
    status: 'recruiting', postedDate: '2025-10-01', deadline: '2025-10-31', daysLeft: 16,
    applicants: 45, progress: 30, screening: 45, interview1: 12, interview2: 5, final: 2, sharedWith: [1, 2, 3]
  },
  {
    id: 2, position: 'backend', title: '백엔드 개발자', department: '개발팀', experience: '3-5년', type: '정규직',
    status: 'screening', postedDate: '2025-09-25', deadline: '2025-10-25', daysLeft: 10,
    applicants: 38, progress: 45, screening: 38, interview1: 8, interview2: 3, final: 1, sharedWith: [1, 2]
  },
  {
    id: 3, position: 'designer', title: 'UX/UI 디자이너', department: '디자인팀', experience: '3-5년', type: '정규직',
    status: 'interviewing', postedDate: '2025-09-20', deadline: '2025-10-20', daysLeft: 5,
    applicants: 52, progress: 65, screening: 52, interview1: 15, interview2: 8, final: 3, isUrgent: true, sharedWith: [1, 4, 3]
  },
  {
    id: 4, position: 'pm', title: '프로덕트 매니저', department: '프로덕트팀', experience: '5년 이상', type: '정규직',
    status: 'interviewing', postedDate: '2025-09-15', deadline: '2025-10-18', daysLeft: 3,
    applicants: 28, progress: 75, screening: 28, interview1: 10, interview2: 6, final: 4, isUrgent: true, sharedWith: [1, 7]
  },
  {
    id: 5, position: 'marketing', title: '마케팅 매니저', department: '마케팅팀', experience: '3-5년', type: '정규직',
    status: 'recruiting', postedDate: '2025-10-05', deadline: '2025-11-05', daysLeft: 21,
    applicants: 31, progress: 25, screening: 31, interview1: 5, interview2: 0, final: 0
  },
  {
    id: 6, position: 'fullstack', title: '풀스택 개발자', department: '개발팀', experience: '3-5년', type: '정규직',
    status: 'recruiting', postedDate: '2025-10-08', deadline: '2025-11-08', daysLeft: 24,
    applicants: 22, progress: 20, screening: 22, interview1: 3, interview2: 0, final: 0
  },
  {
    id: 7, position: 'data', title: '데이터 분석가', department: '프로덕트팀', experience: '1-3년', type: '정규직',
    status: 'screening', postedDate: '2025-09-28', deadline: '2025-10-28', daysLeft: 13,
    applicants: 35, progress: 40, screening: 35, interview1: 7, interview2: 2, final: 0
  },
  {
    id: 8, position: 'intern', title: '개발 인턴', department: '개발팀', experience: '신입', type: '인턴',
    status: 'recruiting', postedDate: '2025-10-17', deadline: '2025-11-19', daysLeft: 26,
    applicants: 18, progress: 15, screening: 18, interview1: 0, interview2: 0, final: 0
  }
])

const teamMembers = ref<TeamMember[]>([
  { id: 1, name: '김현수', role: 'CTO', department: '개발팀', email: 'kim@company.com' },
  { id: 2, name: '이지은', role: '개발팀 리드', department: '개발팀', email: 'lee@company.com' },
  { id: 3, name: '박민준', role: 'HR 매니저', department: '인사팀', email: 'park@company.com' },
  { id: 4, name: '정서아', role: '디자인 리드', department: '디자인팀', email: 'jung@company.com' },
  { id: 5, name: '최영호', role: '채용 담당자', department: '인사팀', email: 'choi@company.com' },
  { id: 6, name: '강민지', role: '마케팅 리드', department: '마케팅팀', email: 'kang@company.com' },
  { id: 7, name: '윤서준', role: 'PM', department: '프로덕트팀', email: 'yoon@company.com' },
  { id: 8, name: '임하늘', role: '영업 리드', department: '영업팀', email: 'lim@company.com' }
])

// Use composables
const {
  currentDate, selectedDate, currentYearMonth, calendarDates, selectedDateLabel,
  selectedDateJobs, filteredJobs, previousMonth, nextMonth, goToToday
} = useJobCalendar(jobs, filters, searchQuery)

const {
  isDragging, dragStartIndex, dragEndIndex, selectedDateRange,
  startDrag, updateDrag, endDrag, isDateInDragRange
} = useDragSelect(calendarDates)

const {
  showShareModal, selectedMembers, selectedJobs, selectedJobId, shareSettings,
  openShareModal, closeShareModal, shareJob, toggleMember, toggleJob,
  selectAllMembers, clearAllMembers, selectAllJobs, clearAllJobs, selectUrgentJobs,
  getTeamMemberName, getJobTitle, confirmShare
} = useJobShare(jobs, teamMembers)

// Computed
const activeFiltersDisplay = computed(() => {
  const active = []
  const statusLabels: Record<string, string> = {
    recruiting: '채용중', screening: '서류검토중', interviewing: '면접진행중',
    closed: '마감', paused: '일시중단'
  }
  
  if (filters.value.position) active.push({ key: 'position', label: '직무', value: filters.value.position })
  if (filters.value.status) active.push({ key: 'status', label: '상태', value: statusLabels[filters.value.status] })
  if (filters.value.department) active.push({ key: 'department', label: '부서', value: filters.value.department })
  if (filters.value.experience) active.push({ key: 'experience', label: '경력', value: filters.value.experience })
  if (filters.value.type) active.push({ key: 'type', label: '고용형태', value: filters.value.type })
  
  return active
})

const hasActiveFilters = computed(() => {
  return filters.value.position !== '' || filters.value.status !== '' || filters.value.department !== '' || 
         filters.value.experience !== '' || filters.value.type !== '' || searchQuery.value !== ''
})

// Methods
const resetFilters = () => {
  filters.value = { position: '', status: '', department: '', experience: '', type: '' }
  searchQuery.value = ''
}

const removeFilter = (key: string) => {
  if (key === 'position' || key === 'status' || key === 'department' || key === 'experience' || key === 'type') {
    filters.value[key] = ''
  }
}

const handleCellClick = (dateObj: CalendarDate) => {
  if (!isDragging.value && dateObj.date) {
    selectedDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), dateObj.date)
  }
}

const handleJobClick = (date: CalendarDate, job: Job) => {
  selectedJobForDetail.value = job
  showJobDetailModal.value = true
}

const closeJobDetailModal = () => {
  showJobDetailModal.value = false
  selectedJobForDetail.value = null
}

const goToJobDetailPage = (jobId: number) => {
  // Vue Router를 사용한다고 가정
  window.location.href = `/recruiter/jobs/${jobId}`
  // 또는 Vue Router 사용 시: router.push(`/recruiter/jobs/${jobId}`)
}

const openAddJobModal = () => {
  showAddJobModal.value = true
  // 폼 초기화
  newJob.value = {
    title: '',
    position: '',
    department: '',
    experience: '',
    type: '',
    status: 'recruiting',
    postedDate: new Date().toISOString().split('T')[0],
    deadline: '',
    description: '',
    requirements: '',
    responsibilities: ''
  }
}

const closeAddJobModal = () => {
  showAddJobModal.value = false
}

const validateJobForm = () => {
  if (!newJob.value.title.trim()) {
    alert('공고 제목을 입력해주세요.')
    return false
  }
  if (!newJob.value.position) {
    alert('직무를 선택해주세요.')
    return false
  }
  if (!newJob.value.department) {
    alert('부서를 선택해주세요.')
    return false
  }
  if (!newJob.value.experience) {
    alert('경력을 선택해주세요.')
    return false
  }
  if (!newJob.value.type) {
    alert('고용형태를 선택해주세요.')
    return false
  }
  if (!newJob.value.deadline) {
    alert('마감일을 선택해주세요.')
    return false
  }
  
  // 마감일이 게시일보다 이전인지 확인
  if (new Date(newJob.value.deadline) < new Date(newJob.value.postedDate)) {
    alert('마감일은 게시일 이후여야 합니다.')
    return false
  }
  
  return true
}

const saveNewJob = () => {
  if (!validateJobForm()) return
  
  // 새 공고 생성
  const newId = Math.max(...jobs.value.map(j => j.id)) + 1
  const postedDate = new Date(newJob.value.postedDate)
  const deadlineDate = new Date(newJob.value.deadline)
  const today = new Date()
  const daysLeft = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  
  const jobToAdd: Job = {
    id: newId,
    title: newJob.value.title,
    department: newJob.value.department,
    experience: newJob.value.experience,
    type: newJob.value.type,
    status: newJob.value.status,
    postedDate: newJob.value.postedDate,
    deadline: newJob.value.deadline,
    daysLeft: daysLeft,
    applicants: 0,
    progress: 0,
    screening: 0,
    interview1: 0,
    interview2: 0,
    final: 0,
    isUrgent: daysLeft <= 7
  }
  
  jobs.value.push(jobToAdd)
  
  alert(`"${newJob.value.title}" 공고가 성공적으로 등록되었습니다!`)
  closeAddJobModal()
}

const viewJobDetail = (jobId: number) => {
  alert(`공고 ID ${jobId}의 상세 정보를 볼 수 있습니다.`)
}

const viewAllJobs = () => {
  alert('전체 채용 공고 목록을 볼 수 있습니다.')
}

const exportJobReport = () => {
  alert('채용 공고 현황 리포트를 내보낼 수 있습니다.')
}

const manageTemplates = () => {
  alert('채용 공고 템플릿을 관리할 수 있습니다.')
}
</script>