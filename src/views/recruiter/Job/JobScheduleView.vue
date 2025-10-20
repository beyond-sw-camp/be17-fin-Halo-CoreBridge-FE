<template>
    <div class="bg-gray-50 min-h-screen">
        <!-- Main Content -->
        <main class="mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <div class="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
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

                    <!-- Actions -->
                    <section class="">
                        <div class="space-y-3">
                            <button @click="handleEdit"
                                class="w-full px-4 py-3 bg-white text-slate-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm font-medium hover:cursor-pointer">
                                공고 수정
                            </button>

                            <button @click="handleDelete"
                                class="w-full px-4 py-3 bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 transition text-sm font-medium hover:cursor-pointer">
                                공고 삭제
                            </button>
                        </div>
                    </section>
                </div>

                <!-- Salary Highlight -->
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

                <!-- Tab Navigation -->
                <div class="border-b border-gray-200">
                    <nav class="flex gap-8">
                        <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id" :class="[
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

            <!-- 필터 및 검색 -->
            <div class="bg-white rounded-xl shadow-lg mb-6 p-6 border border-gray-100">
                <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center gap-2">
                        <div
                            class="w-10 h-10 bg-gradient-to-br from-slate-500 to-slate-600 rounded-lg flex items-center justify-center">
                            <Filter class="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 class="font-bold text-gray-900">필터 & 검색</h3>
                            <p class="text-xs text-gray-500">원하는 조건으로 공고를 찾아보세요</p>
                        </div>
                    </div>
                    <button v-if="hasActiveFilters" @click="resetFilters"
                        class="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition flex items-center gap-1">
                        <X class="w-4 h-4" />
                        필터 초기화
                    </button>
                </div>

                <div class="flex flex-col gap-4">
                    <!-- 검색바 -->
                    <div class="relative">
                        <Search class="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                        <input v-model="searchQuery" type="text" placeholder="공고명, 포지션, 부서명으로 검색..."
                            class="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent text-sm transition" />
                        <div v-if="searchQuery" class="absolute right-4 top-1/2 transform -translate-y-1/2">
                            <button @click="searchQuery = ''" class="text-gray-400 hover:text-gray-600 transition">
                                <X class="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <!-- 필터 옵션들 -->
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                        <!-- 상태 필터 -->
                        <div class="relative">
                            <label class="block text-xs font-semibold text-gray-600 mb-1.5">상태</label>
                            <div class="relative">
                                <Briefcase
                                    class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                <select v-model="filters.status"
                                    class="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent text-sm appearance-none bg-white cursor-pointer hover:border-gray-300 transition">
                                    <option value="">전체 상태</option>
                                    <option value="recruiting">채용중</option>
                                    <option value="screening">서류검토중</option>
                                    <option value="interviewing">면접진행중</option>
                                    <option value="closed">마감</option>
                                    <option value="paused">일시중단</option>
                                </select>
                                <ChevronDown
                                    class="w-4 h-4 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                            </div>
                        </div>

                        <!-- 부서 필터 -->
                        <div class="relative">
                            <label class="block text-xs font-semibold text-gray-600 mb-1.5">부서</label>
                            <div class="relative">
                                <Building
                                    class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                <select v-model="filters.department"
                                    class="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent text-sm appearance-none bg-white cursor-pointer hover:border-gray-300 transition">
                                    <option value="">전체 부서</option>
                                    <option value="개발팀">개발팀</option>
                                    <option value="디자인팀">디자인팀</option>
                                    <option value="프로덕트팀">프로덕트팀</option>
                                    <option value="마케팅팀">마케팅팀</option>
                                    <option value="영업팀">영업팀</option>
                                    <option value="인사팀">인사팀</option>
                                </select>
                                <ChevronDown
                                    class="w-4 h-4 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                            </div>
                        </div>

                        <!-- 경력 필터 -->
                        <div class="relative">
                            <label class="block text-xs font-semibold text-gray-600 mb-1.5">경력</label>
                            <div class="relative">
                                <Award
                                    class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                <select v-model="filters.experience"
                                    class="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent text-sm appearance-none bg-white cursor-pointer hover:border-gray-300 transition">
                                    <option value="">전체 경력</option>
                                    <option value="신입">신입</option>
                                    <option value="1-3년">주니어 (1-3년)</option>
                                    <option value="3-5년">미드 (3-5년)</option>
                                    <option value="5년 이상">시니어 (5년+)</option>
                                </select>
                                <ChevronDown
                                    class="w-4 h-4 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                            </div>
                        </div>

                        <!-- 고용형태 필터 -->
                        <div class="relative">
                            <label class="block text-xs font-semibold text-gray-600 mb-1.5">고용형태</label>
                            <div class="relative">
                                <FileText
                                    class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                <select v-model="filters.type"
                                    class="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent text-sm appearance-none bg-white cursor-pointer hover:border-gray-300 transition">
                                    <option value="">전체 고용형태</option>
                                    <option value="정규직">정규직</option>
                                    <option value="계약직">계약직</option>
                                    <option value="인턴">인턴</option>
                                </select>
                                <ChevronDown
                                    class="w-4 h-4 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    <!-- 활성 필터 표시 -->
                    <div v-if="activeFiltersDisplay.length > 0" class="flex flex-wrap gap-2 pt-2 border-t">
                        <span class="text-xs font-semibold text-gray-600">활성 필터:</span>
                        <span v-for="(filter, index) in activeFiltersDisplay" :key="index"
                            class="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">
                            {{ filter.label }}: {{ filter.value }}
                            <button @click="removeFilter(filter.key)"
                                class="hover:bg-slate-200 rounded-full p-0.5 transition">
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
                            <button @click="sortBy = 'deadline'" :class="[
                                'px-3 py-1.5 text-xs rounded-lg transition flex items-center gap-1',
                                sortBy === 'deadline'
                                    ? 'bg-slate-600 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            ]">
                                <Calendar class="w-3 h-3" />
                                마감일순
                            </button>
                            <button @click="sortBy = 'applicants'" :class="[
                                'px-3 py-1.5 text-xs rounded-lg transition flex items-center gap-1',
                                sortBy === 'applicants'
                                    ? 'bg-slate-600 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            ]">
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
                                <button @click="previousMonth" class="p-2 hover:bg-gray-100 rounded-lg transition">
                                    <ChevronLeft class="w-5 h-5" />
                                </button>
                                <button @click="goToToday"
                                    class="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                                    오늘
                                </button>
                                <button @click="nextMonth" class="p-2 hover:bg-gray-100 rounded-lg transition">
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
                            <div v-for="day in weekDays" :key="day"
                                class="text-center py-3 text-sm font-semibold text-gray-600">
                                {{ day }}
                            </div>

                            <!-- 날짜 칸 -->
                            <div v-for="(date, index) in calendarDates" :key="index" :class="[
                                'aspect-square border rounded-lg p-2 cursor-pointer transition-all',
                                date.isToday
                                    ? 'border-2 border-slate-600 bg-slate-50'
                                    : date.hasJobs
                                        ? 'border-gray-200 bg-blue-50'
                                        : 'border-gray-200',
                                !date.date && 'border-0 cursor-default',
                                date.date && !isDragging && 'hover:bg-blue-50 hover:border-blue-300',
                                isDateInDragRange(index) && 'bg-blue-200 border-blue-400 ring-2 ring-blue-300',
                                dragStartIndex === index && isDragging && 'bg-blue-300 border-blue-500',
                                dragEndIndex === index && isDragging && 'bg-blue-300 border-blue-500'
                            ]" @mousedown="date.date && startDrag(index, date)"
                                @mouseenter="date.date && updateDrag(index)" @mouseup="date.date && endDrag()"
                                @click="date.date && handleCellClick(date, $event)">
                                <template v-if="date.date">
                                    <div :class="[
                                        'text-sm mb-1 pointer-events-none',
                                        date.isToday ? 'font-bold text-slate-600' : 'text-gray-600',
                                        isDateInDragRange(index) && 'text-blue-900 font-bold'
                                    ]">
                                        {{ date.date }}
                                    </div>
                                    <div v-if="date.isToday"
                                        class="text-xs text-slate-600 font-semibold pointer-events-none">오늘</div>
                                    <div v-if="date.jobs.length > 0" class="space-y-1 mt-1">
                                        <div v-for="job in date.jobs.slice(0, 2)" :key="job.id" :class="[
                                            'text-[11px] px-1.5 py-0.5 rounded truncate flex items-center justify-between gap-1 cursor-pointer hover:opacity-90 transition-all shadow-sm',
                                            getJobColorClass(job)
                                        ]" :title="`${job.title} (${job.postedDate} ~ ${job.deadline})`"
                                            @click.stop="handleJobClick(date, job)">
                                            <div class="flex items-center gap-1 truncate">
                                                <Share2 v-if="job.sharedWith && job.sharedWith.length > 0"
                                                    class="w-2.5 h-2.5 text-blue-600 flex-shrink-0" />
                                                <span
                                                    class="text-[11px] font-medium text-gray-800 leading-tight break-words line-clamp-2">
                                                    {{ job.title }}
                                                </span>

                                            </div>
                                            <span v-if="job.postedDate && job.deadline"
                                                class="text-[10px] text-gray-600 ml-1 flex-shrink-0 font-medium">
                                                {{ job.postedDate.split('-')[2] }}~{{ job.deadline.split('-')[2] }}
                                            </span>
                                        </div>

                                        <div v-if="date.jobs.length > 2"
                                            class="text-xs text-gray-500 font-semibold pointer-events-none">
                                            +{{ date.jobs.length - 2 }}건
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
                                <div v-for="job in selectedDateJobs" :key="job.id" :class="[
                                    'border-l-4 p-3 rounded transition-all cursor-pointer hover:shadow-md',
                                    getJobBorderClass(job)
                                ]" @click="viewJobDetail(job.id)">
                                    <div class="flex items-start justify-between mb-2">
                                        <div class="flex-1 min-w-0">
                                            <div class="flex items-center gap-2 mb-1">
                                                <Briefcase class="w-3 h-3 flex-shrink-0" />
                                                <span class="text-xs font-semibold text-gray-500 uppercase">
                                                    {{ job.department }}
                                                </span>
                                                <Share2 v-if="job.sharedWith && job.sharedWith.length > 0"
                                                    class="w-3 h-3 text-blue-600"
                                                    :title="`${job.sharedWith.length}명과 공유중`" />
                                            </div>
                                            <p class="font-semibold text-sm text-gray-900">
                                                {{ job.title }}
                                            </p>
                                            <p class="text-xs text-gray-600">{{ job.experience }} · {{ job.type }}</p>
                                        </div>
                                        <div class="flex flex-col gap-1 items-end ml-2">
                                            <span :class="[
                                                'px-2 py-0.5 text-xs font-semibold rounded',
                                                getStatusClass(job.status)
                                            ]">
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
                                                <div :class="['h-1.5 rounded-full', getProgressColor(job.progress)]"
                                                    :style="{ width: job.progress + '%' }"></div>
                                            </div>
                                            <span class="text-xs font-semibold text-gray-600">{{ job.progress }}%</span>
                                        </div>
                                    </div>
                                    <button @click.stop="shareJob(job.id)"
                                        class="w-full mt-2 py-1.5 bg-blue-100 text-blue-700 text-xs rounded hover:bg-blue-200 transition flex items-center justify-center gap-1">
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
                                <button @click="openAddJobModal"
                                    class="w-full py-2 px-4 text-sm text-left text-white bg-slate-600 rounded-lg hover:bg-slate-700 flex items-center gap-2 transition">
                                    <Plus class="w-4 h-4" />
                                    공고 등록
                                </button>
                                <button @click="viewAllJobs"
                                    class="w-full py-2 px-4 text-sm text-left text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 transition">
                                    <List class="w-4 h-4" />
                                    전체 공고 보기
                                </button>
                                <button @click="exportJobReport"
                                    class="w-full py-2 px-4 text-sm text-left text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 transition">
                                    <FileText class="w-4 h-4" />
                                    공고 리포트
                                </button>
                                <button @click="manageTemplates"
                                    class="w-full py-2 px-4 text-sm text-left text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 transition">
                                    <FileCheck class="w-4 h-4" />
                                    공고 템플릿
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 공고 공유 모달 -->
            <div v-if="showShareModal"
                class="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50"
                @click.self="closeShareModal">
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
                            <div v-for="member in teamMembers" :key="member.id" :class="[
                                'border-2 rounded-lg p-3 cursor-pointer transition-all',
                                selectedMembers.includes(member.id)
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 hover:border-gray-300'
                            ]" @click="toggleMember(member.id)">
                                <div class="flex items-center gap-3">
                                    <div
                                        class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold">
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
                            <button @click="selectAllMembers"
                                class="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                                전체 선택
                            </button>
                            <button @click="clearAllMembers"
                                class="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                                전체 해제
                            </button>
                        </div>
                    </div>

                    <!-- 공유할 공고 선택 -->
                    <div class="mb-6">
                        <label class="block text-sm font-semibold text-gray-700 mb-3">공유할 공고 선택</label>
                        <div class="space-y-2 max-h-60 overflow-y-auto border rounded-lg p-3 bg-gray-50">
                            <label v-for="job in filteredJobs" :key="job.id" :class="[
                                'flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all',
                                selectedJobs.includes(job.id)
                                    ? 'bg-blue-100 border-2 border-blue-500'
                                    : 'bg-white border-2 border-gray-200 hover:border-gray-300'
                            ]">
                                <input v-model="selectedJobs" :value="job.id" type="checkbox"
                                    class="mt-1 w-4 h-4 text-blue-600 rounded" />
                                <div class="flex-1 min-w-0">
                                    <div class="flex items-center gap-2 mb-1">
                                        <Briefcase class="w-3 h-3 text-gray-500 flex-shrink-0" />
                                        <span class="text-xs font-semibold text-gray-500 uppercase">{{ job.department
                                        }}</span>
                                        <span v-if="job.sharedWith && job.sharedWith.length > 0"
                                            class="text-xs text-blue-600">
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
                            <button @click="selectAllJobs"
                                class="px-3 py-1.5 text-xs border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                                전체 선택
                            </button>
                            <button @click="clearAllJobs"
                                class="px-3 py-1.5 text-xs border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                                전체 해제
                            </button>
                            <button @click="selectUrgentJobs"
                                class="px-3 py-1.5 text-xs border border-red-300 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition">
                                긴급 공고만
                            </button>
                        </div>
                    </div>

                    <!-- 공유 권한 설정 -->
                    <div class="mb-6">
                        <label class="block text-sm font-semibold text-gray-700 mb-3">공유 권한</label>
                        <div class="space-y-2">
                            <label
                                class="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                                <input v-model="shareSettings.permission" type="radio" value="view"
                                    class="w-4 h-4 text-blue-600" />
                                <div>
                                    <p class="font-medium text-gray-900">보기 전용</p>
                                    <p class="text-xs text-gray-500">공고 정보와 지원자 현황만 확인 가능</p>
                                </div>
                            </label>
                            <label
                                class="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                                <input v-model="shareSettings.permission" type="radio" value="edit"
                                    class="w-4 h-4 text-blue-600" />
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
                            <input v-model="shareSettings.sendNotification" type="checkbox"
                                class="w-4 h-4 text-blue-600 rounded" />
                            <div>
                                <p class="font-medium text-gray-900">알림 보내기</p>
                                <p class="text-xs text-gray-500">공유 대상에게 이메일 알림을 전송합니다</p>
                            </div>
                        </label>
                    </div>

                    <!-- 공유 메시지 -->
                    <div class="mb-6">
                        <label class="block text-sm font-semibold text-gray-700 mb-2">메시지 (선택사항)</label>
                        <textarea v-model="shareSettings.message" rows="3" placeholder="공고 공유와 함께 전달할 메시지를 입력하세요..."
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"></textarea>
                    </div>

                    <!-- 선택된 멤버 요약 -->
                    <div v-if="selectedMembers.length > 0" class="mb-4 p-4 bg-blue-50 rounded-lg">
                        <p class="text-sm font-semibold text-gray-700 mb-2">
                            선택된 멤버 ({{ selectedMembers.length }}명)
                        </p>
                        <div class="flex flex-wrap gap-2">
                            <span v-for="memberId in selectedMembers" :key="memberId"
                                class="px-3 py-1 bg-white rounded-full text-xs font-medium text-gray-700 flex items-center gap-1">
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
                            <span v-for="jobId in selectedJobs" :key="jobId"
                                class="px-3 py-1 bg-white rounded-full text-xs font-medium text-gray-700 flex items-center gap-1">
                                {{ getJobTitle(jobId) }}
                                <button @click="toggleJob(jobId)" class="hover:text-red-600">
                                    <X class="w-3 h-3" />
                                </button>
                            </span>
                        </div>
                    </div>

                    <!-- 액션 버튼 -->
                    <div class="flex gap-3">
                        <button @click="closeShareModal"
                            class="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">
                            취소
                        </button>
                        <button @click="confirmShare"
                            :disabled="selectedMembers.length === 0 || selectedJobs.length === 0" :class="[
                                'flex-1 px-4 py-2 rounded-lg text-white transition flex items-center justify-center gap-2',
                                selectedMembers.length === 0 || selectedJobs.length === 0
                                    ? 'bg-gray-300 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700'
                            ]">
                            <Share2 class="w-4 h-4" />
                            {{ selectedJobs.length }}건 공고를 {{ selectedMembers.length }}명에게 공유
                        </button>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import {
    Building2,
    MapPin,
    DollarSign,
    Plus,
    ChevronLeft,
    ChevronRight,
    Calendar,
    CalendarDays,
    Users,
    Briefcase,
    List,
    FileText,
    FileCheck,
    Share2,
    X,
    Check,
    Filter,
    Search,
    ChevronDown,
    Building,
    Award
} from 'lucide-vue-next'

type JobStatus = 'recruiting' | 'screening' | 'interviewing' | 'closed' | 'paused'

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

interface Job {
    id: number
    title: string
    department: string
    experience: string
    type: string
    status: JobStatus
    postedDate: string
    deadline: string
    daysLeft: number
    applicants: number
    progress: number
    screening: number
    interview1: number
    interview2: number
    final: number
    isUrgent?: boolean
    sharedWith?: number[]
}

interface CalendarDate {
    date: number | null
    isToday: boolean
    hasJobs: boolean
    jobs: Job[]
}

interface Filters {
    status: string
    department: string
    experience: string
    type: string
}

interface TeamMember {
    id: number
    name: string
    role: string
    department: string
    email: string
}

interface ShareSettings {
    permission: 'view' | 'edit'
    sendNotification: boolean
    message: string
}

// State
const searchQuery = ref('')
const currentDate = ref(new Date())
const selectedDate = ref(new Date())
const showShareModal = ref(false)
const selectedMembers = ref<number[]>([])
const selectedJobs = ref<number[]>([])
const selectedJobId = ref<number | null>(null)
const sortBy = ref<'deadline' | 'applicants'>('deadline')

// 드래그 관련 state
const isDragging = ref(false)
const dragStartIndex = ref<number | null>(null)
const dragEndIndex = ref<number | null>(null)
const selectedDateRange = ref<{ start: string | null; end: string | null }>({
    start: null,
    end: null
})

const filters = ref<Filters>({
    status: '',
    department: '',
    experience: '',
    type: ''
})

const shareSettings = ref<ShareSettings>({
    permission: 'view',
    sendNotification: true,
    message: ''
})

const jobPosting = ref<JobPosting>({
    title: '시니어 프론트엔드 개발자',
    status: '채용중',
    department: '개발팀',
    employmentType: '정규직',
    location: '서울시 강남구 테헤란로 123',
    experience: '경력 5년 이상',
    position: '주임, 대리, 과장',
    techStack: ['Vue.js', 'TypeScript', 'Tailwind CSS', 'Nuxt.js', 'Jest', 'Vite', 'Pinia'],
    salary: '6,000만원 ~ 8,000만원',
    salaryNegotiable: '면접 후 결정'
})

const tabs = ref([
    { id: 'info', name: '공고 정보' },
    { id: 'applicants', name: '지원자 관리' },
    { id: 'applicants-list', name: '지원자 목록' },
    { id: 'post-schedule', name: '공고 일정' },
    { id: 'proccess-setting', name: '프로세스 설정' },
])

const activeTab = ref('post-schedule')

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

const weekDays = ['일', '월', '화', '수', '목', '금', '토']

const jobs = ref<Job[]>([
    {
        id: 1,
        title: '시니어 프론트엔드 개발자',
        department: '개발팀',
        experience: '5년 이상',
        type: '정규직',
        status: 'recruiting',
        postedDate: '2025-10-01',
        deadline: '2025-10-31',
        daysLeft: 16,
        applicants: 45,
        progress: 30,
        screening: 45,
        interview1: 12,
        interview2: 5,
        final: 2,
        sharedWith: [1, 2, 3]
    },
    {
        id: 2,
        title: '백엔드 개발자',
        department: '개발팀',
        experience: '3-5년',
        type: '정규직',
        status: 'screening',
        postedDate: '2025-09-25',
        deadline: '2025-10-25',
        daysLeft: 10,
        applicants: 38,
        progress: 45,
        screening: 38,
        interview1: 8,
        interview2: 3,
        final: 1,
        sharedWith: [1, 2]
    },
    {
        id: 3,
        title: 'UX/UI 디자이너',
        department: '디자인팀',
        experience: '3-5년',
        type: '정규직',
        status: 'interviewing',
        postedDate: '2025-09-20',
        deadline: '2025-10-20',
        daysLeft: 5,
        applicants: 52,
        progress: 65,
        screening: 52,
        interview1: 15,
        interview2: 8,
        final: 3,
        isUrgent: true,
        sharedWith: [1, 4, 3]
    },
    {
        id: 4,
        title: '프로덕트 매니저',
        department: '프로덕트팀',
        experience: '5년 이상',
        type: '정규직',
        status: 'interviewing',
        postedDate: '2025-09-15',
        deadline: '2025-10-18',
        daysLeft: 3,
        applicants: 28,
        progress: 75,
        screening: 28,
        interview1: 10,
        interview2: 6,
        final: 4,
        isUrgent: true,
        sharedWith: [1, 7]
    },
    {
        id: 5,
        title: '마케팅 매니저',
        department: '마케팅팀',
        experience: '3-5년',
        type: '정규직',
        status: 'recruiting',
        postedDate: '2025-10-05',
        deadline: '2025-11-05',
        daysLeft: 21,
        applicants: 31,
        progress: 25,
        screening: 31,
        interview1: 5,
        interview2: 0,
        final: 0
    },
    {
        id: 6,
        title: '풀스택 개발자',
        department: '개발팀',
        experience: '3-5년',
        type: '정규직',
        status: 'recruiting',
        postedDate: '2025-10-08',
        deadline: '2025-11-08',
        daysLeft: 24,
        applicants: 22,
        progress: 20,
        screening: 22,
        interview1: 3,
        interview2: 0,
        final: 0
    },
    {
        id: 7,
        title: '데이터 분석가',
        department: '프로덕트팀',
        experience: '1-3년',
        type: '정규직',
        status: 'screening',
        postedDate: '2025-09-28',
        deadline: '2025-10-28',
        daysLeft: 13,
        applicants: 35,
        progress: 40,
        screening: 35,
        interview1: 7,
        interview2: 2,
        final: 0
    },
    {
        id: 8,
        title: '개발 인턴',
        department: '개발팀',
        experience: '신입',
        type: '인턴',
        status: 'recruiting',
        postedDate: '2025-10-17',
        deadline: '2025-11-19',
        daysLeft: 26,
        applicants: 18,
        progress: 15,
        screening: 18,
        interview1: 0,
        interview2: 0,
        final: 0
    },
    {
        id: 9,
        title: '영업 매니저',
        department: '영업팀',
        experience: '5년 이상',
        type: '정규직',
        status: 'interviewing',
        postedDate: '2025-09-22',
        deadline: '2025-10-22',
        daysLeft: 7,
        applicants: 26,
        progress: 60,
        screening: 26,
        interview1: 9,
        interview2: 5,
        final: 2
    },
    {
        id: 10,
        title: '인사 담당자',
        department: '인사팀',
        experience: '3-5년',
        type: '정규직',
        status: 'screening',
        postedDate: '2025-10-03',
        deadline: '2025-11-03',
        daysLeft: 19,
        applicants: 29,
        progress: 35,
        screening: 29,
        interview1: 6,
        interview2: 1,
        final: 0
    },
    {
        id: 11,
        title: 'DevOps 엔지니어',
        department: '개발팀',
        experience: '5년 이상',
        type: '정규직',
        status: 'recruiting',
        postedDate: '2025-10-12',
        deadline: '2025-11-12',
        daysLeft: 28,
        applicants: 15,
        progress: 10,
        screening: 15,
        interview1: 0,
        interview2: 0,
        final: 0
    },
    {
        id: 12,
        title: '콘텐츠 마케터',
        department: '마케팅팀',
        experience: '1-3년',
        type: '계약직',
        status: 'recruiting',
        postedDate: '2025-10-14',
        deadline: '2025-11-14',
        daysLeft: 30,
        applicants: 12,
        progress: 5,
        screening: 12,
        interview1: 0,
        interview2: 0,
        final: 0
    }
])

// Computed
const currentYearMonth = computed(() => {
    const year = currentDate.value.getFullYear()
    const month = currentDate.value.getMonth() + 1
    return `${year}년 ${month}월`
})

// 필터링된 공고 목록
const filteredJobs = computed(() => {
    let result = [...jobs.value]

    // 검색 쿼리 필터링
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        result = result.filter(job =>
            job.title.toLowerCase().includes(query) ||
            job.department.toLowerCase().includes(query)
        )
    }

    // 상태 필터
    if (filters.value.status) {
        result = result.filter(job => job.status === filters.value.status)
    }

    // 부서 필터
    if (filters.value.department) {
        result = result.filter(job => job.department === filters.value.department)
    }

    // 경력 필터
    if (filters.value.experience) {
        result = result.filter(job => job.experience === filters.value.experience)
    }

    // 고용형태 필터
    if (filters.value.type) {
        result = result.filter(job => job.type === filters.value.type)
    }

    return result
})

// 활성 필터 표시
const activeFiltersDisplay = computed(() => {
    const active = []

    if (filters.value.status) {
        const statusLabels: Record<string, string> = {
            recruiting: '채용중',
            screening: '서류검토중',
            interviewing: '면접진행중',
            closed: '마감',
            paused: '일시중단'
        }
        active.push({ key: 'status', label: '상태', value: statusLabels[filters.value.status] })
    }

    if (filters.value.department) {
        active.push({ key: 'department', label: '부서', value: filters.value.department })
    }

    if (filters.value.experience) {
        active.push({ key: 'experience', label: '경력', value: filters.value.experience })
    }

    if (filters.value.type) {
        active.push({ key: 'type', label: '고용형태', value: filters.value.type })
    }

    return active
})

// 활성 필터 존재 여부
const hasActiveFilters = computed(() => {
    return filters.value.status !== '' ||
        filters.value.department !== '' ||
        filters.value.experience !== '' ||
        filters.value.type !== '' ||
        searchQuery.value !== ''
})

const calendarDates = computed(() => {
    const year = currentDate.value.getFullYear()
    const month = currentDate.value.getMonth()

    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const firstDayOfWeek = firstDay.getDay()
    const daysInMonth = lastDay.getDate()

    const dates: CalendarDate[] = []
    const today = new Date()

    for (let i = 0; i < firstDayOfWeek; i++) {
        dates.push({
            date: null,
            isToday: false,
            hasJobs: false,
            jobs: []
        })
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const currentDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`

        // 게시일 기준 공고
        const postedJobs = filteredJobs.value
            .filter(j => j.postedDate === currentDateStr)
            .map(j => ({ ...j, dateType: 'posted' }))

        // 마감일 기준 공고
        const deadlineJobs = filteredJobs.value
            .filter(j => j.deadline === currentDateStr)
            .map(j => ({ ...j, dateType: 'deadline' }))

        const dayJobs = [...postedJobs, ...deadlineJobs]

        dates.push({
            date: day,
            isToday:
                today.getDate() === day &&
                today.getMonth() === month &&
                today.getFullYear() === year,
            hasJobs: dayJobs.length > 0,
            jobs: dayJobs
        })
    }

    return dates
})

const selectedDateLabel = computed(() => {
    const month = selectedDate.value.getMonth() + 1
    const day = selectedDate.value.getDate()
    const today = new Date()

    const diffTime = selectedDate.value.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    let label = `${month}월 ${day}일`

    if (diffDays === 0) {
        label += ' (오늘)'
    } else if (diffDays === 1) {
        label += ' (내일)'
    } else if (diffDays === -1) {
        label += ' (어제)'
    }

    return label
})

const selectedDateJobs = computed(() => {
    const dateStr = `${selectedDate.value.getFullYear()}-${String(selectedDate.value.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.value.getDate()).padStart(2, '0')}`
    return filteredJobs.value.filter(j => j.deadline === dateStr || j.postedDate === dateStr)
})

// Methods
const resetFilters = () => {
    filters.value = {
        status: '',
        department: '',
        experience: '',
        type: ''
    }
    searchQuery.value = ''
}

const removeFilter = (key: string) => {
    if (key === 'status' || key === 'department' || key === 'experience' || key === 'type') {
        filters.value[key] = ''
    }
}

const getJobColorClass = (job: Job) => {
    if (job.isUrgent || job.daysLeft <= 3) {
        return 'bg-red-100 text-red-700 font-semibold'
    }

    const statusColors: Record<JobStatus, string> = {
        recruiting: 'bg-green-100 text-green-700',
        screening: 'bg-blue-100 text-blue-700',
        interviewing: 'bg-purple-100 text-purple-700',
        closed: 'bg-gray-100 text-gray-700',
        paused: 'bg-yellow-100 text-yellow-700'
    }

    return statusColors[job.status]
}

const getJobBorderClass = (job: Job) => {
    if (job.isUrgent || job.daysLeft <= 3) {
        return 'border-red-500 bg-red-50'
    }

    const statusBorders: Record<JobStatus, string> = {
        recruiting: 'border-green-500 bg-green-50',
        screening: 'border-blue-500 bg-blue-50',
        interviewing: 'border-purple-500 bg-purple-50',
        closed: 'border-gray-500 bg-gray-50',
        paused: 'border-yellow-500 bg-yellow-50'
    }

    return statusBorders[job.status]
}

const getStatusClass = (status: JobStatus | string) => {
    const classes: Record<JobStatus | string, string> = {
        recruiting: 'bg-green-100 text-green-700',
        '채용중': 'bg-green-100 text-green-700',
        screening: 'bg-blue-100 text-blue-700',
        interviewing: 'bg-purple-100 text-purple-700',
        closed: 'bg-gray-100 text-gray-700',
        paused: 'bg-yellow-100 text-yellow-700'
    }
    return classes[status] || 'bg-gray-100 text-gray-700'
}

const getStatusLabel = (status: JobStatus) => {
    const labels: Record<JobStatus, string> = {
        recruiting: '채용중',
        screening: '서류검토',
        interviewing: '면접중',
        closed: '마감',
        paused: '일시중단'
    }
    return labels[status]
}

const getProgressColor = (progress: number) => {
    if (progress >= 75) return 'bg-green-500'
    if (progress >= 50) return 'bg-blue-500'
    if (progress >= 25) return 'bg-yellow-500'
    return 'bg-gray-400'
}

const getTeamMemberName = (memberId: number) => {
    const member = teamMembers.value.find(m => m.id === memberId)
    return member ? member.name : ''
}

const getJobTitle = (jobId: number) => {
    const job = jobs.value.find(j => j.id === jobId)
    return job ? job.title : ''
}

const toggleMember = (memberId: number) => {
    const index = selectedMembers.value.indexOf(memberId)
    if (index > -1) {
        selectedMembers.value.splice(index, 1)
    } else {
        selectedMembers.value.push(memberId)
    }
}

const toggleJob = (jobId: number) => {
    const index = selectedJobs.value.indexOf(jobId)
    if (index > -1) {
        selectedJobs.value.splice(index, 1)
    } else {
        selectedJobs.value.push(jobId)
    }
}

const selectAllMembers = () => {
    selectedMembers.value = teamMembers.value.map(m => m.id)
}

const clearAllMembers = () => {
    selectedMembers.value = []
}

const selectAllJobs = () => {
    selectedJobs.value = filteredJobs.value.map(j => j.id)
}

const clearAllJobs = () => {
    selectedJobs.value = []
}

const selectUrgentJobs = () => {
    selectedJobs.value = filteredJobs.value.filter(j => j.daysLeft <= 7).map(j => j.id)
}

const previousMonth = () => {
    currentDate.value = new Date(
        currentDate.value.getFullYear(),
        currentDate.value.getMonth() - 1,
        1
    )
}

const nextMonth = () => {
    currentDate.value = new Date(
        currentDate.value.getFullYear(),
        currentDate.value.getMonth() + 1,
        1
    )
}

const goToToday = () => {
    currentDate.value = new Date()
    selectedDate.value = new Date()
}

// 드래그 관련 함수
const isDateInDragRange = (index: number) => {
    if (!isDragging.value || dragStartIndex.value === null || dragEndIndex.value === null) {
        return false
    }
    const start = Math.min(dragStartIndex.value, dragEndIndex.value)
    const end = Math.max(dragStartIndex.value, dragEndIndex.value)
    return index >= start && index <= end
}

const startDrag = (index: number, date: CalendarDate) => {
    isDragging.value = true
    dragStartIndex.value = index
    dragEndIndex.value = index

    if (date.date) {
        const dateStr = `${currentDate.value.getFullYear()}-${String(currentDate.value.getMonth() + 1).padStart(2, '0')}-${String(date.date).padStart(2, '0')}`
        selectedDateRange.value.start = dateStr
        selectedDateRange.value.end = dateStr
    }
}

const updateDrag = (index: number) => {
    if (isDragging.value) {
        dragEndIndex.value = index

        // 날짜 범위 업데이트
        if (dragStartIndex.value !== null && dragEndIndex.value !== null) {
            const startIdx = Math.min(dragStartIndex.value, dragEndIndex.value)
            const endIdx = Math.max(dragStartIndex.value, dragEndIndex.value)

            const startDate = calendarDates.value[startIdx]
            const endDate = calendarDates.value[endIdx]

            if (startDate.date && endDate.date) {
                const startDateStr = `${currentDate.value.getFullYear()}-${String(currentDate.value.getMonth() + 1).padStart(2, '0')}-${String(startDate.date).padStart(2, '0')}`
                const endDateStr = `${currentDate.value.getFullYear()}-${String(currentDate.value.getMonth() + 1).padStart(2, '0')}-${String(endDate.date).padStart(2, '0')}`
                selectedDateRange.value.start = startDateStr
                selectedDateRange.value.end = endDateStr
            }
        }
    }
}

const endDrag = () => {
    if (isDragging.value && dragStartIndex.value !== null && dragEndIndex.value !== null) {
        if (dragStartIndex.value !== dragEndIndex.value) {
            // 여러 날짜 선택됨 - 모달 표시
            setTimeout(() => {
                openAddJobModalWithDateRange()
                isDragging.value = false
                dragStartIndex.value = null
                dragEndIndex.value = null
            }, 100)
        } else {
            // 단일 날짜 클릭
            isDragging.value = false
            dragStartIndex.value = null
            dragEndIndex.value = null
        }
    }
}

const handleCellClick = (date: CalendarDate) => {
    if (!isDragging.value && date.date) {
        selectedDate.value = new Date(
            currentDate.value.getFullYear(),
            currentDate.value.getMonth(),
            date.date
        )
    }
}

const handleJobClick = (date: CalendarDate, job: Job) => {
    viewJobDetail(job.id)
}

const openShareModal = () => {
    showShareModal.value = true
    selectedJobId.value = null
    selectedMembers.value = []
    selectedJobs.value = []
}

const closeShareModal = () => {
    showShareModal.value = false
    selectedMembers.value = []
    selectedJobs.value = []
    selectedJobId.value = null
    shareSettings.value = {
        permission: 'view',
        sendNotification: true,
        message: ''
    }
}

const shareJob = (jobId: number) => {
    selectedJobId.value = jobId
    selectedJobs.value = [jobId]
    const job = jobs.value.find(j => j.id === jobId)
    if (job?.sharedWith) {
        selectedMembers.value = [...job.sharedWith]
    }
    showShareModal.value = true
}

const confirmShare = () => {
    if (selectedMembers.value.length === 0 || selectedJobs.value.length === 0) return

    selectedJobs.value.forEach(jobId => {
        const job = jobs.value.find(j => j.id === jobId)
        if (job) {
            job.sharedWith = [...selectedMembers.value]
        }
    })

    const memberNames = selectedMembers.value.map(id => getTeamMemberName(id)).join(', ')
    const jobCount = selectedJobs.value.length

    alert(`${jobCount}건의 공고가 ${memberNames}에게 공유되었습니다.\n\n권한: ${shareSettings.value.permission === 'view' ? '보기 전용' : '편집 가능'}`)

    closeShareModal()
}

const openAddJobModal = () => {
    alert('새로운 채용 공고를 등록할 수 있습니다.')
}

const openAddJobModalWithDateRange = () => {
    if (!selectedDateRange.value.start || !selectedDateRange.value.end) return

    alert(`선택한 기간: ${selectedDateRange.value.start} ~ ${selectedDateRange.value.end}\n\n 이 기간으로 채용 공고를 등록할 수 있습니다.`)

    selectedDateRange.value = {
        start: null,
        end: null
    }
}

const viewJobDetail = (jobId: number) => {
    alert(`공고 ID ${jobId}의 상세 정보를 볼 수 있습니다.`)
}

const editJob = (jobId: number) => {
    alert(`공고 ID ${jobId}를 수정할 수 있습니다.`)
}

const viewApplicants = (jobId: number) => {
    alert(`공고 ID ${jobId}의 지원자 목록을 볼 수 있습니다.`)
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

const handleEdit = () => {
    console.log('공고 수정')
}

const handleDelete = () => {
    if (confirm('정말로 이 공고를 삭제하시겠습니까?')) {
        console.log('공고 삭제')
    }
}

// Lifecycle hooks
const handleGlobalMouseUp = () => {
    if (isDragging.value) {
        endDrag()
    }
}

onMounted(() => {
    document.addEventListener('mouseup', handleGlobalMouseUp)
})

onUnmounted(() => {
    document.removeEventListener('mouseup', handleGlobalMouseUp)
})
</script>

<style scoped></style>