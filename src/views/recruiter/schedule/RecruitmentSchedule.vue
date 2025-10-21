<template>
  <div class="min-h-screen p-6 bg-gray-50">
    <!-- 헤더 -->
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-slate-600 mb-2">채용 일정 관리</h1>
        <p class="text-gray-600">채용 전 과정을 체계적으로 관리하세요</p>
      </div>
      <div class="flex gap-3">
        <button @click="openShareModal" class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2">
          <Share2 class="w-5 h-5" />일정 공유
        </button>
        <button @click="openAddModal" class="px-6 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition flex items-center gap-2">
          <Plus class="w-5 h-5" />일정 추가
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

    <!-- 캘린더 그리드 -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- 캘린더 -->
      <div class="lg:col-span-2">
        <div class="bg-white rounded-lg shadow p-6">
          <!-- 필터 -->
          <div class="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div class="flex flex-wrap gap-3 items-center">
              <select v-model="filters.position" class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600 text-xs bg-white">
                <option value="">전체 포지션</option>
                <option value="frontend">프론트엔드 개발자</option>
                <option value="backend">백엔드 개발자</option>
                <option value="fullstack">풀스택 개발자</option>
                <option value="designer">UX/UI 디자이너</option>
                <option value="pm">프로덕트 매니저</option>
                <option value="marketing">마케팅</option>
                <option value="sales">영업</option>
              </select>
              <select v-model="filters.type" class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600 text-xs bg-white">
                <option value="">전체 유형</option>
                <option value="document_review">서류 전형</option>
                <option value="interview_1">1차 면접</option>
                <option value="interview_2">2차 면접</option>
                <option value="interview_final">최종 면접</option>
                <option value="negotiation">처우 협상</option>
                <option value="onboarding_prep">온보딩 준비</option>
                <option value="onboarding">온보딩</option>
                <option value="follow_up">사후 관리</option>
                <option value="meeting">팀 회의</option>
                <option value="event">채용 이벤트</option>
              </select>
              <select v-model="filters.sharedWith" class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600 text-xs bg-white">
                <option value="">전체 일정</option>
                <option value="my">내 일정만</option>
                <option value="shared">공유받은 일정</option>
              </select>
              <input v-model="searchQuery" type="text" placeholder="검색..." class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600 text-xs bg-white flex-1 min-w-[120px]" />
            </div>
          </div>

          <!-- 캘린더 헤더 -->
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-bold text-slate-600">{{ currentYearMonth }}</h2>
            <div class="flex gap-2">
              <select v-model="viewMode" class="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition focus:outline-none focus:ring-2 focus:ring-slate-600">
                <option value="month">월별 보기</option>
                <option value="year">년도별 보기</option>
              </select>
              <button @click="previousMonth" class="p-2 hover:bg-gray-100 rounded-lg transition"><ChevronLeft class="w-5 h-5" /></button>
              <button @click="goToToday" class="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition">오늘</button>
              <button @click="nextMonth" class="p-2 hover:bg-gray-100 rounded-lg transition"><ChevronRight class="w-5 h-5" /></button>
            </div>
          </div>

          <!-- 드래그 안내 -->
          <div class="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-2">
            <CalendarDays class="w-4 h-4 text-blue-600 flex-shrink-0" />
            <p class="text-sm text-blue-700"><strong>TIP:</strong> 캘린더에서 날짜를 드래그하여 일정 기간을 선택하고 등록할 수 있습니다</p>
          </div>

          <!-- 월별 보기 -->
          <div v-if="viewMode === 'month'" class="grid grid-cols-7 gap-2 select-none">
            <div v-for="day in weekDays" :key="day" class="text-center py-3 text-sm font-semibold text-gray-600">{{ day }}</div>

            <div
              v-for="(date, index) in calendarDates"
              :key="index"
              :class="getDateCellClass(date, index)"
              @mousedown="date.date && startDrag(index, date)"
              @mouseenter="date.date && updateDrag(index)"
              @mouseup="date.date && endDrag()"
              @click="date.date && handleCellClick(date)"
            >
              <template v-if="date.date">
                <div class="flex items-center justify-between">
                  <div :class="getDateNumberClass(date, index)">{{ date.date }}</div>
                  <div v-if="date.isToday" class="text-xs text-slate-600 font-semibold pointer-events-none">오늘</div>
                </div>

                <!-- ✅ 기간 일정 바 스타일 -->
                <div v-if="date.schedules.length > 0" class="space-y-1 mt-1">
                  <div
                    v-for="schedule in date.schedules.slice(0, 3)"
                    :key="schedule.id + '-' + date.dateString"
                    class="relative w-full h-5 flex items-center cursor-pointer group"
                    @click.stop="handleScheduleClick(date, schedule)"
                  >
                    <div
                      class="h-2 w-full"
                      :class="getBarClass(schedule, date.dateString)"
                      :title="getBarTitle(schedule)"
                    ></div>
                    <!-- 텍스트(첫 칸/마지막 칸/단일일정에만) -->
                    <div
                      v-if="isRangeEdge(schedule, date.dateString)"
                      class="absolute left-1 right-1 top-[-2px] text-[10px] leading-3 truncate pointer-events-none text-slate-800"
                    >
                      {{ schedule.candidateName || schedule.title }}
                    </div>
                  </div>

                  <div v-if="date.schedules.length > 3" class="text-xs text-gray-500 font-semibold pointer-events-none">
                    +{{ date.schedules.length - 3 }}건
                  </div>
                </div>
              </template>
            </div>
          </div>

          <!-- 년도별 보기 -->
          <div v-else class="grid grid-cols-3 gap-4">
            <div v-for="month in 12" :key="month" class="border border-gray-200 rounded-lg p-3 bg-gray-50">
              <h4 class="text-center font-semibold text-gray-700 mb-2 text-sm">{{ month }}월</h4>
              <div class="grid grid-cols-7 gap-1">
                <div v-for="day in ['일', '월', '화', '수', '목', '금', '토']" :key="day" class="text-center text-xs text-gray-500 font-medium">{{ day }}</div>
                <div
                  v-for="(date, index) in getYearViewDates(month)"
                  :key="index"
                  :class="[
                    'text-center text-xs py-1 rounded cursor-pointer',
                    date.isToday ? 'bg-slate-600 text-white font-bold' : '',
                    date.hasSchedules && !date.isToday ? 'bg-blue-200 text-blue-900 font-semibold' : 'text-gray-600',
                    !date.date && 'invisible',
                    date.date && 'hover:bg-blue-100'
                  ]"
                  @click="date.date && jumpToDate(currentYear, month, date.date)"
                >
                  {{ date.date || '' }}
                </div>
              </div>
            </div>
          </div>

          <!-- 범례 -->
          <div class="flex flex-wrap items-center gap-4 mt-6 pt-4 border-t">
            <div class="flex items-center gap-2"><div class="w-4 h-4 bg-slate-50 border-2 border-slate-600 rounded"></div><span class="text-sm text-gray-600">오늘</span></div>
            <div class="flex items-center gap-2"><div class="w-4 h-4 bg-blue-200 border-2 border-blue-400 rounded"></div><span class="text-sm text-gray-600">드래그 선택</span></div>
            <div class="flex items-center gap-2"><UserCheck class="w-4 h-4 text-blue-600" /><span class="text-sm text-gray-600">공유된 일정</span></div>
            <div class="flex items-center gap-2"><div class="w-4 h-4 bg-orange-100 rounded"></div><span class="text-sm text-gray-600">서류전형</span></div>
            <div class="flex items-center gap-2"><div class="w-4 h-4 bg-blue-100 rounded"></div><span class="text-sm text-gray-600">면접</span></div>
            <div class="flex items-center gap-2"><div class="w-4 h-4 bg-green-100 rounded"></div><span class="text-sm text-gray-600">온보딩</span></div>
          </div>
        </div>
      </div>

      <!-- 사이드바 -->
      <div class="lg:col-span-1">
        <div class="grid grid-cols-1 gap-6">
          <!-- 선택된 날짜 일정 -->
          <div class="bg-white rounded-lg shadow p-5">
            <h3 class="text-lg font-bold text-slate-600 mb-4">{{ selectedDateLabel }}</h3>
            <div v-if="selectedDateSchedules.length > 0" class="space-y-3 max-h-96 overflow-y-auto">
              <div
                v-for="schedule in selectedDateSchedules"
                :key="schedule.id"
                :class="['border-l-4 p-3 rounded transition-all cursor-pointer hover:shadow-md', getScheduleBorderClass(schedule)]"
                @click="viewScheduleDetail(schedule.id)"
              >
                <div class="flex items-start justify-between mb-2">
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 mb-1">
                      <component :is="getScheduleIcon(schedule.type)" class="w-3 h-3 flex-shrink-0" />
                      <span class="text-xs font-semibold text-gray-500 uppercase">{{ getScheduleTypeLabel(schedule.type) }}</span>
                    </div>
                    <p class="font-semibold text-sm text-gray-900 truncate">{{ schedule.candidateName || schedule.title }}</p>
                    <p class="text-xs text-gray-600">{{ schedule.position }}</p>
                  </div>
                  <span v-if="schedule.priority === 'high'" class="px-2 py-0.5 text-xs font-semibold text-red-700 bg-red-100 rounded">긴급</span>
                </div>
                <div class="text-xs text-gray-600 space-y-1">
                  <p class="flex items-center gap-1"><Clock class="w-3 h-3" />{{ schedule.time }}</p>
                  <p class="flex items-center gap-1 truncate"><MapPin class="w-3 h-3" />{{ schedule.location }}</p>
                  <p v-if="schedule.sharedWith && schedule.sharedWith.length > 0" class="flex items-center gap-1"><Share2 class="w-3 h-3 text-blue-600" /><span class="text-blue-600 font-medium">{{ schedule.sharedWith.length }}명과 공유중</span></p>
                </div>
                <div class="flex gap-2 mt-2">
                  <button @click.stop="editSchedule(schedule.id)" class="flex-1 py-1.5 bg-slate-100 text-slate-700 text-xs rounded hover:bg-slate-200 transition">수정</button>
                  <button @click.stop="shareSchedule(schedule.id)" class="flex-1 py-1.5 bg-blue-100 text-blue-700 text-xs rounded hover:bg-blue-200 transition flex items-center justify-center gap-1"><Share2 class="w-3 h-3" />공유</button>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-6 text-gray-500 text-sm">선택한 날짜에 예정된 일정이 없습니다</div>
          </div>

          <!-- 빠른 작업 -->
          <div class="bg-white rounded-lg shadow p-5">
            <h3 class="text-lg font-bold text-slate-600 mb-4">빠른 작업</h3>
            <div class="space-y-2">
              <button @click="openAddModal" class="w-full py-2 px-4 text-sm text-left text-white bg-slate-600 rounded-lg hover:bg-slate-700 flex items-center gap-2 transition"><Plus class="w-4 h-4" />일정 추가</button>
              <button @click="handleClick('지원자 풀 보기')" class="w-full py-2 px-4 text-sm text-left text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 transition"><Users class="w-4 h-4" />지원자 풀 보기</button>
              <button @click="handleClick('캘린더 동기화')" class="w-full py-2 px-4 text-sm text-left text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 transition"><Calendar class="w-4 h-4" />캘린더 동기화</button>
              <button @click="handleClick('채용 리포트')" class="w-full py-2 px-4 text-sm text-left text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 transition"><FileText class="w-4 h-4" />채용 리포트</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 일정 추가/수정 모달 -->
    <div v-if="showAddModal" class="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50" @click.self="closeAddModal">
      <div class="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-bold text-slate-600">{{ editingScheduleId ? '일정 수정' : '일정 추가' }}</h3>
          <button @click="closeAddModal" class="text-gray-400 hover:text-gray-600"><X class="w-6 h-6" /></button>
        </div>

        <div v-if="selectedDateRange.start && selectedDateRange.end" class="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div class="flex items-center gap-2 text-sm text-blue-700">
            <CalendarDays class="w-4 h-4" />
            <span class="font-semibold">선택된 기간:</span>
            <span>{{ selectedDateRange.start }}</span>
            <span v-if="selectedDateRange.start !== selectedDateRange.end">~ {{ selectedDateRange.end }}</span>
            <span class="ml-2 px-2 py-0.5 bg-blue-200 rounded-full text-xs font-bold">{{ getDaysDifference() }}일</span>
          </div>
        </div>

        <form @submit.prevent="saveSchedule" class="space-y-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">일정 유형 *</label>
            <select v-model="newSchedule.type" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600">
              <option value="">선택하세요</option>
              <option value="document_review">서류 전형</option>
              <option value="interview_1">1차 면접</option>
              <option value="interview_2">2차 면접</option>
              <option value="interview_final">최종 면접</option>
              <option value="negotiation">처우 협상</option>
              <option value="onboarding_prep">온보딩 준비</option>
              <option value="onboarding">온보딩</option>
              <option value="follow_up">사후 관리</option>
              <option value="meeting">팀 회의</option>
              <option value="event">채용 이벤트</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">{{ ['meeting', 'event'].includes(newSchedule.type) ? '제목' : '지원자명' }} *</label>
            <input v-model="newSchedule.candidateName" type="text" required placeholder="이름 또는 제목을 입력하세요" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600" />
          </div>

          <div v-if="!['meeting', 'event'].includes(newSchedule.type)">
            <label class="block text-sm font-semibold text-gray-700 mb-2">포지션 *</label>
            <select v-model="newSchedule.position" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600">
              <option value="">선택하세요</option>
              <option value="프론트엔드 개발자">프론트엔드 개발자</option>
              <option value="백엔드 개발자">백엔드 개발자</option>
              <option value="풀스택 개발자">풀스택 개발자</option>
              <option value="UX/UI 디자이너">UX/UI 디자이너</option>
              <option value="프로덕트 매니저">프로덕트 매니저</option>
              <option value="마케팅">마케팅</option>
              <option value="영업">영업</option>
            </select>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div><label class="block text-sm font-semibold text-gray-700 mb-2">시작일 *</label><input v-model="newSchedule.startDate" type="date" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600" /></div>
            <div><label class="block text-sm font-semibold text-gray-700 mb-2">종료일 *</label><input v-model="newSchedule.endDate" type="date" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600" /></div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div><label class="block text-sm font-semibold text-gray-700 mb-2">시작 시간 *</label><input v-model="newSchedule.startTime" type="time" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600" /></div>
            <div><label class="block text-sm font-semibold text-gray-700 mb-2">종료 시간 *</label><input v-model="newSchedule.endTime" type="time" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600" /></div>
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">장소 *</label>
            <input v-model="newSchedule.location" type="text" required placeholder="예: 3층 회의실 A, Zoom 링크 등" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600" />
          </div>

          <div v-if="newSchedule.type.includes('interview')">
            <label class="block text-sm font-semibold text-gray-700 mb-2">면접관</label>
            <input v-model="newSchedule.interviewer" type="text" placeholder="예: 김팀장, 이대리" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600" />
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">우선순위</label>
            <div class="flex gap-3">
              <label class="flex items-center gap-2 cursor-pointer"><input v-model="newSchedule.priority" type="radio" value="low" class="w-4 h-4 text-slate-600" /><span class="text-sm text-gray-700">낮음</span></label>
              <label class="flex items-center gap-2 cursor-pointer"><input v-model="newSchedule.priority" type="radio" value="medium" class="w-4 h-4 text-slate-600" /><span class="text-sm text-gray-700">보통</span></label>
              <label class="flex items-center gap-2 cursor-pointer"><input v-model="newSchedule.priority" type="radio" value="high" class="w-4 h-4 text-slate-600" /><span class="text-sm text-gray-700">높음</span></label>
            </div>
          </div>

          <div v-if="getDaysDifference() > 1">
            <label class="flex items-center gap-3">
              <input v-model="newSchedule.isRecurring" type="checkbox" class="w-4 h-4 text-slate-600 rounded" />
              <div><p class="font-medium text-gray-900">매일 반복</p><p class="text-xs text-gray-500">선택된 기간동안 매일 같은 시간에 일정을 생성합니다</p></div>
            </label>
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">메모</label>
            <textarea v-model="newSchedule.notes" rows="3" placeholder="추가 메모사항을 입력하세요..." class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600 text-sm"></textarea>
          </div>

          <div>
            <label class="flex items-center gap-3">
              <input v-model="newSchedule.isRecurring" type="checkbox" class="w-4 h-4 text-slate-600 rounded" />
              <span class="font-medium text-gray-900">반복 일정 설정</span>
            </label>

            <div v-if="newSchedule.isRecurring" class="mt-3 pl-6 space-y-3">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">반복 주기</label>
                <select v-model="newSchedule.frequency" class="w-full px-3 py-2 border rounded-lg">
                  <option value="DAILY">매일</option>
                  <option value="WEEKLY">매주</option>
                  <option value="MONTHLY">매달</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">반복 종료일</label>
                <input v-model="newSchedule.endRecurringDate" type="date" class="w-full px-3 py-2 border rounded-lg" />
              </div>
            </div>
          </div>

          <div class="flex gap-3 pt-4">
            <button type="button" @click="closeAddModal" class="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">취소</button>
            <button type="submit" class="flex-1 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition">{{ editingScheduleId ? '수정하기' : '추가하기' }}</button>
          </div>
        </form>
      </div>
    </div>

    <!-- 일정 공유 모달 -->
    <div v-if="showShareModal" class="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50" @click.self="closeShareModal">
      <div class="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-bold text-slate-600">일정 공유하기</h3>
          <button @click="closeShareModal" class="text-gray-400 hover:text-gray-600"><X class="w-6 h-6" /></button>
        </div>

        <div class="mb-6">
          <label class="block text-sm font-semibold text-gray-700 mb-3">공유 대상 선택</label>
          <div class="grid grid-cols-2 gap-3 mb-4">
            <div
              v-for="member in teamMembers"
              :key="member.id"
              :class="['border-2 rounded-lg p-3 cursor-pointer transition-all', selectedMembers.includes(member.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300']"
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
                <Check v-if="selectedMembers.includes(member.id)" class="w-5 h-5 text-blue-600 flex-shrink-0" />
              </div>
            </div>
          </div>
          <div class="flex gap-2">
            <button @click="selectAllMembers" class="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition">전체 선택</button>
            <button @click="clearAllMembers" class="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition">전체 해제</button>
          </div>
        </div>

        <div class="mb-6">
          <label class="block text-sm font-semibold text-gray-700 mb-3">공유할 일정 선택</label>
          <div class="space-y-2 max-h-60 overflow-y-auto border rounded-lg p-3 bg-gray-50">
            <label
              v-for="schedule in availableSchedules"
              :key="schedule.id"
              :class="[
                'flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all',
                selectedSchedules.includes(schedule.id) ? 'bg-blue-100 border-2 border-blue-500' : 'bg-white border-2 border-gray-200 hover:border-gray-300'
              ]"
            >
              <input v-model="selectedSchedules" :value="schedule.id" type="checkbox" class="mt-1 w-4 h-4 text-blue-600 rounded" />
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-1">
                  <component :is="getScheduleIcon(schedule.type)" class="w-3 h-3 text-gray-500 flex-shrink-0" />
                  <span class="text-xs font-semibold text-gray-500 uppercase">{{ getScheduleTypeLabel(schedule.type) }}</span>
                  <span v-if="schedule.sharedWith && schedule.sharedWith.length > 0" class="text-xs text-blue-600">({{ schedule.sharedWith.length }}명 공유중)</span>
                </div>
                <p class="font-semibold text-sm text-gray-900 truncate">{{ schedule.candidateName || schedule.title }}</p>
                <div class="flex items-center gap-3 mt-1 text-xs text-gray-600">
                  <span class="flex items-center gap-1">
                    <Calendar class="w-3 h-3" />
                    {{ schedule.startDate }}
                    <template v-if="schedule.endDate && schedule.endDate !== schedule.startDate"> ~ {{ schedule.endDate }}</template>
                  </span>
                  <span class="flex items-center gap-1"><Clock class="w-3 h-3" />{{ schedule.time }}</span>
                </div>
              </div>
            </label>
          </div>
          <div class="flex gap-2 mt-2">
            <button @click="selectAllSchedules" class="px-3 py-1.5 text-xs border border-gray-300 rounded-lg hover:bg-gray-50 transition">전체 선택</button>
            <button @click="clearAllSchedules" class="px-3 py-1.5 text-xs border border-gray-300 rounded-lg hover:bg-gray-50 transition">전체 해제</button>
            <button @click="selectSchedulesByDateRange" class="px-3 py-1.5 text-xs border border-blue-300 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition">기간별 선택</button>
          </div>
        </div>

        <div class="mb-6">
          <label class="block text-sm font-semibold text-gray-700 mb-3">공유할 일정 기간</label>
          <div class="grid grid-cols-2 gap-3">
            <div><label class="block text-xs text-gray-600 mb-1">시작일</label><input v-model="shareSettings.startDate" type="date" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
            <div><label class="block text-xs text-gray-600 mb-1">종료일</label><input v-model="shareSettings.endDate" type="date" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
          </div>
        </div>

        <div class="mb-6">
          <label class="block text-sm font-semibold text-gray-700 mb-3">공유 권한</label>
          <div class="space-y-2">
            <label class="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input v-model="shareSettings.permission" type="radio" value="view" class="w-4 h-4 text-blue-600" />
              <div><p class="font-medium text-gray-900">보기 전용</p><p class="text-xs text-gray-500">일정을 확인만 할 수 있습니다</p></div>
            </label>
            <label class="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input v-model="shareSettings.permission" type="radio" value="edit" class="w-4 h-4 text-blue-600" />
              <div><p class="font-medium text-gray-900">편집 가능</p><p class="text-xs text-gray-500">일정을 수정하고 코멘트를 달 수 있습니다</p></div>
            </label>
          </div>
        </div>

        <div class="mb-6">
          <label class="flex items-center gap-3">
            <input v-model="shareSettings.sendNotification" type="checkbox" class="w-4 h-4 text-blue-600 rounded" />
            <div><p class="font-medium text-gray-900">알림 보내기</p><p class="text-xs text-gray-500">공유 대상에게 이메일 알림을 전송합니다</p></div>
          </label>
        </div>

        <div class="mb-6">
          <label class="block text-sm font-semibold text-gray-700 mb-2">메시지 (선택사항)</label>
          <textarea v-model="shareSettings.message" rows="3" placeholder="일정 공유와 함께 전달할 메시지를 입력하세요..." class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"></textarea>
        </div>

        <div class="flex gap-3">
          <button @click="closeShareModal" class="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">취소</button>
          <button
            @click="confirmShare"
            :disabled="selectedMembers.length === 0 || selectedSchedules.length === 0"
            :class="['flex-1 px-4 py-2 rounded-lg text-white transition flex items-center justify-center gap-2', selectedMembers.length === 0 || selectedSchedules.length === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700']"
          >
            <Share2 class="w-4 h-4" />{{ selectedSchedules.length }}건 일정을 {{ selectedMembers.length }}명에게 공유
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Plus, Share2, X, ChevronLeft, ChevronRight, CalendarDays, Calendar, Clock, AlertCircle, Users, Check, UserCheck, MapPin, FileText } from 'lucide-vue-next'
import type { Schedule, Filters, Statistic, PipelineStage, TeamMember } from '../../../types/schedules/recruitment/recruitment'
import { WEEK_DAYS, getScheduleColorClass, getScheduleBorderClass, getScheduleIcon, getScheduleTypeLabel, getIconBgClass, getIconColorClass, getValueColorClass, calculateDaysDifference } from '../../../constants/schedules/recruitment/recruitment'
import { useCalendar, useDragSelect, useSchedule, useShare } from '../../../composable/schedules/recruitment/useRecruitment'

import { onMounted } from 'vue'
import { getSchedules } from '../../../api/schedules/recruitment/recruitment'

const weekDays = WEEK_DAYS
const searchQuery = ref('')
const filters = ref<Filters>({ type: '', position: '', status: '', date: '', sharedWith: '' })

const schedules = ref<Schedule[]>([])

onMounted(async () => {
  try {
    const data = await getSchedules()
    console.log("✅ 서버에서 불러온 일정:", data)

    schedules.value = data.results.map((s: any) => ({
      id: s.id,
      type: s.type,
      candidateId: s.candidateId,
      candidateName: s.candidateName,
      position: s.position,
      startDate: s.startDate,
      endDate: s.endDate,
      startTime: s.startTime,
      endTime: s.endTime,
      time: s.endDate && s.endDate !== s.startDate
        ? `${s.startDate} ~ ${s.endDate} ${s.startTime}-${s.endTime}`
        : `${s.startTime} - ${s.endTime}`,
      location: s.location,
      priority: s.priority,
      status: s.status,
      interviewer: s.interviewer,
      stage: s.stage,
      notes: s.notes,
      sharedWith: (s.shared || []).map((m: any) => m.memberId)
    }))
  } catch (error) {
    console.error("❌ 일정 불러오기 실패:", error)
  }
})

const teamMembers = ref<TeamMember[]>([
  { id: 1, name: '김현수', role: 'CTO', department: '개발팀', email: 'kim@company.com' },
  { id: 2, name: '이지은', role: '개발팀 리드', department: '개발팀', email: 'lee@company.com' },
  { id: 3, name: '박민준', role: '시니어 개발자', department: '개발팀', email: 'park@company.com' },
  { id: 4, name: '정서아', role: '디자인 리드', department: '디자인팀', email: 'jung@company.com' },
  { id: 5, name: '최영호', role: 'HR 매니저', department: '인사팀', email: 'choi@company.com' },
  { id: 6, name: '강민지', role: 'HR 담당자', department: '인사팀', email: 'kang@company.com' },
  { id: 7, name: '윤서준', role: '프로덕트 매니저', department: '프로덕트팀', email: 'yoon@company.com' },
  { id: 8, name: '임하늘', role: '마케팅 리드', department: '마케팅팀', email: 'lim@company.com' }
])

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

const { currentDate, selectedDate, viewMode, currentYearMonth, currentYear, calendarDates, selectedDateLabel, selectedDateSchedules, getYearViewDates, previousMonth, nextMonth, goToToday, jumpToDate } = useCalendar(schedules, filters, searchQuery)
const { isDragging, dragStartIndex, dragEndIndex, selectedDateRange, startDrag, updateDrag, endDrag, isDateInDragRange } = useDragSelect(calendarDates)
const { showAddModal, editingScheduleId, newSchedule, openAddModal, openAddModalWithDateRange, closeAddModal, saveSchedule, editSchedule, viewScheduleDetail } = useSchedule(schedules)
const { showShareModal, selectedMembers, selectedSchedules, shareSettings, availableSchedules, openShareModal, closeShareModal, shareSchedule, toggleMember, selectAllMembers, clearAllMembers, toggleSchedule, selectAllSchedules, clearAllSchedules, selectSchedulesByDateRange, confirmShare } = useShare(schedules, teamMembers)

/** 기간 바 스타일 도우미 */
const isSameDay = (a?: string, b?: string) => !!a && !!b && a === b
const isCurrentStart = (s: Schedule, cur: string) => isSameDay(s.startDate, cur)
const isCurrentEnd = (s: Schedule, cur: string) => isSameDay(s.endDate ?? s.startDate, cur)
const isSingleDay = (s: Schedule) => isSameDay(s.startDate, s.endDate ?? s.startDate)

const barColorClass = (s: Schedule) => {
  // 간단 타입 매핑(기존 색 계열 유지)
  if (s.type?.startsWith('interview')) return 'bg-blue-100'
  if (s.type === 'document_review') return 'bg-orange-100'
  if (s.type?.startsWith('onboarding')) return 'bg-green-100'
  if (s.type === 'meeting') return 'bg-gray-100'
  if (s.type === 'event') return 'bg-purple-100'
  if (s.type === 'negotiation') return 'bg-pink-100'
  if (s.type === 'follow_up') return 'bg-indigo-100'
  return 'bg-slate-100'
}

const getBarClass = (s: Schedule, cur: string) => {
  const start = isCurrentStart(s, cur)
  const end = isCurrentEnd(s, cur)
  const single = isSingleDay(s)
  return [
    barColorClass(s),
    'rounded',
    'opacity-90',
    'group-hover:opacity-100',
    single ? 'rounded-full' : (start ? 'rounded-l-full' : (end ? 'rounded-r-full' : 'rounded-none'))
  ]
}

const isRangeEdge = (s: Schedule, cur: string) => isCurrentStart(s, cur) || isCurrentEnd(s, cur) || isSingleDay(s)

const handleEndDrag = () => {
  endDrag(() => {
    if (selectedDateRange.value.start && selectedDateRange.value.end) {
      openAddModalWithDateRange(selectedDateRange.value.start, selectedDateRange.value.end)
    }
  })
}

// ✅ 기간 일정 확인
const isRangeSchedule = (schedule: Schedule) => {
  return schedule.startDate !== schedule.endDate
}

// ✅ 바 Tooltip 제목 생성
const getBarTitle = (schedule: Schedule) => {
  if (isRangeSchedule(schedule)) {
    return `${schedule.startDate} ~ ${schedule.endDate} | ${schedule.candidateName || schedule.title}`
  }
  return `${schedule.startDate} | ${schedule.candidateName || schedule.title}`
}


// temp
function handleClick(message: string) {
  alert(message)
}

const handleCellClick = (date: any) => {
  if (isDragging.value || !date.date) return
  selectedDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), date.date)
}

const handleScheduleClick = (date: any, schedule: any) => {
  if (!date.date) return
  selectedDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), date.date)
  setTimeout(() => viewScheduleDetail(schedule.id), 100)
}

const getDateCellClass = (date: any, index: number) => {
  return [
    'aspect-square border rounded-lg p-2 cursor-pointer transition-all relative',
    date.isToday ? 'border-2 border-slate-600 bg-slate-50' : date.hasSchedules ? 'border-gray-200 bg-blue-50' : 'border-gray-200',
    !date.date && 'border-0 cursor-default',
    date.date && !isDragging.value && 'hover:bg-blue-50 hover:border-blue-300',
    isDateInDragRange(index) && 'bg-blue-200 border-blue-400 ring-2 ring-blue-300',
    dragStartIndex.value === index && isDragging.value && 'bg-blue-300 border-blue-500',
    dragEndIndex.value === index && isDragging.value && 'bg-blue-300 border-blue-500'
  ]
}

const getDateNumberClass = (date: any, index: number) => {
  return ['text-sm mb-1 pointer-events-none', date.isToday ? 'font-bold text-slate-600' : 'text-gray-600', isDateInDragRange(index) && 'text-blue-900 font-bold']
}

// ✅ 날짜 차이 계산
const getDaysDifference = () => {
  if (!newSchedule.value.startDate || !newSchedule.value.endDate) return 1
  return calculateDaysDifference(newSchedule.value.startDate, newSchedule.value.endDate)
}
</script>
