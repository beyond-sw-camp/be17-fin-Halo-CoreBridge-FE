<template>
    <div class="bg-gray-50 min-h-screen">
        <!-- Main Content -->
        <main class="mx-auto px-4 sm:px-6 lg:px-8 py-6">

            <!-- Applicant List Content (when applicants-list tab is active) -->
            <div v-if="activeTab === 'applicants-list'" class="bg-white rounded-lg shadow-sm border border-gray-200">
                <!-- Stats Cards -->
                <div class="p-6 border-b border-gray-200">
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div class="flex items-center justify-between">
                                <div>
                                    <p class="text-sm text-blue-600 font-medium">전체 지원자</p>
                                    <p class="text-2xl font-bold text-blue-800">{{ stats.total }}</p>
                                </div>
                                <Users :size="24" class="text-blue-600" />
                            </div>
                        </div>
                        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <div class="flex items-center justify-between">
                                <div>
                                    <p class="text-sm text-yellow-600 font-medium">서류 심사</p>
                                    <p class="text-2xl font-bold text-yellow-800">{{ stats.pending }}</p>
                                </div>
                                <Clock :size="24" class="text-yellow-600" />
                            </div>
                        </div>
                        <div class="bg-green-50 border border-green-200 rounded-lg p-4">
                            <div class="flex items-center justify-between">
                                <div>
                                    <p class="text-sm text-green-600 font-medium">서류 통과</p>
                                    <p class="text-2xl font-bold text-green-800">{{ stats.passed }}</p>
                                </div>
                                <CheckCircle :size="24" class="text-green-600" />
                            </div>
                        </div>
                        <div class="bg-purple-50 border border-purple-200 rounded-lg p-4">
                            <div class="flex items-center justify-between">
                                <div>
                                    <p class="text-sm text-purple-600 font-medium">면접 대기</p>
                                    <p class="text-2xl font-bold text-purple-800">{{ stats.interview }}</p>
                                </div>
                                <FileText :size="24" class="text-purple-600" />
                            </div>
                        </div>
                    </div>

                    <!-- Search and Filter -->
                    <div class="flex flex-col sm:flex-row gap-4">
                        <div class="flex-1 relative">
                            <Search :size="20"
                                class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input v-model="searchQuery" type="text" placeholder="지원자 이름 또는 이메일로 검색..."
                                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500" />
                        </div>
                        <div class="flex items-center gap-2">
                            <Filter :size="20" class="text-gray-400" />
                            <select v-model="statusFilter"
                                class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500">
                                <option v-for="option in statusOptions" :key="option.value" :value="option.value">
                                    {{ option.label }}
                                </option>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- Applicants List -->


                <!-- Empty State -->
                <div v-if="filteredApplicants.length === 0" class="p-12 text-center">
                    <Users :size="48" class="mx-auto text-gray-300 mb-4" />
                    <h3 class="text-lg font-medium text-gray-500 mb-2">조건에 맞는 지원자가 없습니다</h3>
                    <p class="text-gray-400">검색 조건을 변경해보세요.</p>
                </div>
            </div>

            <!-- Process Setting Tab Content -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div class="mb-6">
                    <h3 class="text-xl font-bold text-slate-800 mb-2">채용 프로세스 설정</h3>
                    <p class="text-gray-600">채용 단계를 추가, 수정, 삭제하고 순서를 변경할 수 있습니다.</p>
                </div>

                <!-- Current Process Overview -->
                <div class="mb-8">
                    <h4 class="text-lg font-semibold text-slate-700 mb-4">현재 채용 프로세스</h4>
                    <div class="flex items-center gap-4 overflow-x-auto pb-4">
                        <div v-for="(step, index) in recruitmentProcess" :key="index"
                            class="flex items-center gap-2 min-w-fit">
                            <div class="flex flex-col items-center">
                                <div :class="step.color"
                                    class="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                    {{ index + 1 }}
                                </div>
                                <span class="text-sm font-medium text-slate-700 mt-2 text-center whitespace-nowrap">
                                    {{ step.name }}
                                </span>
                            </div>
                            <ChevronRight v-if="index < recruitmentProcess.length - 1" :size="20"
                                class="text-gray-400 mt-3" />
                        </div>
                    </div>
                </div>

                <!-- Process Management -->
                <div class="space-y-6">
                    <!-- Add New Step -->
                    <div class="border border-gray-200 rounded-lg p-4">
                        <h5 class="font-semibold text-slate-700 mb-4">새 단계 추가</h5>
                        <div class="flex gap-4 items-end">
                            <div class="flex-1">
                                <label class="block text-sm font-medium text-gray-700 mb-2">단계명</label>
                                <input v-model="newStepName" type="text" placeholder="예: 1차 면접, 코딩테스트 등"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500" />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">색상</label>
                                <select v-model="newStepColor"
                                    class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500">
                                    <option value="bg-gray-400">회색</option>
                                    <option value="bg-red-500">빨강</option>
                                    <option value="bg-orange-500">주황</option>
                                    <option value="bg-yellow-500">노랑</option>
                                    <option value="bg-green-500">초록</option>
                                    <option value="bg-blue-500">파랑</option>
                                    <option value="bg-purple-500">보라</option>
                                    <option value="bg-pink-500">분홍</option>
                                    <option value="bg-indigo-500">남색</option>
                                    <option value="bg-cyan-500">청록</option>
                                </select>
                            </div>
                            <button @click="addStep" :disabled="!newStepName.trim()"
                                class="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors">
                                <Plus :size="16" class="inline mr-2" />
                                추가
                            </button>
                        </div>
                    </div>

                    <!-- Existing Steps Management -->
                    <div class="border border-gray-200 rounded-lg p-4">
                        <h5 class="font-semibold text-slate-700 mb-4">단계 관리</h5>
                        <div class="space-y-3">
                            <div v-for="(step, index) in recruitmentProcess" :key="index"
                                class="flex items-center gap-4 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                <!-- Step Order -->
                                <div
                                    class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-semibold text-gray-600">
                                    {{ index + 1 }}
                                </div>

                                <!-- Step Color Preview -->
                                <div :class="step.color" class="w-6 h-6 rounded-full"></div>

                                <!-- Step Name (Editable) -->
                                <div class="flex-1">
                                    <input v-if="editingIndex === index" v-model="editingName" @blur="saveEdit(index)"
                                        @keyup.enter="saveEdit(index)" @keyup.escape="cancelEdit"
                                        class="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-slate-500 focus:border-slate-500" />
                                    <span v-else class="font-medium text-slate-700">{{ step.name }}</span>
                                </div>

                                <!-- Color Selector (when editing) -->
                                <div v-if="editingIndex === index" class="w-32">
                                    <select v-model="editingColor"
                                        class="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-slate-500 focus:border-slate-500 text-sm">
                                        <option value="bg-gray-400">회색</option>
                                        <option value="bg-red-500">빨강</option>
                                        <option value="bg-orange-500">주황</option>
                                        <option value="bg-yellow-500">노랑</option>
                                        <option value="bg-green-500">초록</option>
                                        <option value="bg-blue-500">파랑</option>
                                        <option value="bg-purple-500">보라</option>
                                        <option value="bg-pink-500">분홍</option>
                                        <option value="bg-indigo-500">남색</option>
                                        <option value="bg-cyan-500">청록</option>
                                    </select>
                                </div>

                                <!-- Actions -->
                                <div class="flex items-center gap-2">
                                    <button v-if="editingIndex !== index" @click="startEdit(index)"
                                        class="p-1 text-gray-400 hover:text-slate-600 transition-colors" title="수정">
                                        <Edit2 :size="16" />
                                    </button>

                                    <template v-if="editingIndex === index">
                                        <button @click="saveEdit(index)"
                                            class="p-1 text-green-600 hover:text-green-700 transition-colors"
                                            title="저장">
                                            <Check :size="16" />
                                        </button>
                                        <button @click="cancelEdit"
                                            class="p-1 text-gray-400 hover:text-gray-600 transition-colors" title="취소">
                                            <X :size="16" />
                                        </button>
                                    </template>

                                    <button v-if="editingIndex !== index && recruitmentProcess.length > 1"
                                        @click="removeStep(index)"
                                        class="p-1 text-red-400 hover:text-red-600 transition-colors" title="삭제">
                                        <Trash2 :size="16" />
                                    </button>

                                    <!-- Move buttons -->
                                    <div v-if="editingIndex !== index" class="flex flex-col gap-1">
                                        <button v-if="index > 0" @click="moveStep(index, index - 1)"
                                            class="p-1 text-gray-400 hover:text-slate-600 transition-colors"
                                            title="위로 이동">
                                            <ChevronUp :size="14" />
                                        </button>
                                        <button v-if="index < recruitmentProcess.length - 1"
                                            @click="moveStep(index, index + 1)"
                                            class="p-1 text-gray-400 hover:text-slate-600 transition-colors"
                                            title="아래로 이동">
                                            <ChevronDown :size="14" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Save Changes -->
                    <div class="flex justify-between items-center pt-4 border-t border-gray-200">
                        <div class="text-sm text-gray-600">
                            변경사항은 자동으로 저장됩니다.
                        </div>
                        <div class="flex gap-3">
                            <button @click="resetToDefault"
                                class="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                기본값으로 리셋
                            </button>
                            <button @click="saveProcessChanges"
                                class="px-6 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors">
                                변경사항 저장
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </main>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import {
    ArrowLeft,
    Users,
    FileText,
    CheckCircle,
    Clock,
    Search,
    Filter,
    Building2,
    MapPin,
    Briefcase,
    DollarSign,
    Calendar,
    User,
    Mail,
    ChevronRight,
    Plus,
    Edit2,
    Trash2,
    Check,
    X,
    ChevronUp,
    ChevronDown
} from 'lucide-vue-next';

interface JobPosting {
    id: number;
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
    description: string
    responsibilities: string[]
    requirements: string[]
    preferred: string[]
    benefits: string[]
    additionalInfo: string
    postedDate: string
    applicationPeriod: string
    deadline: string
    headcount: number
    applicantCount: number
    workingHours: string
    workingDays: string
    contact: {
        name: string
        email: string
    }
}

interface Applicant {
    id: number;
    name: string;
    email: string;
    appliedAt: string;
    status: string;
    statusColor: string;
    careerYears: number;
    education: string;
    certificates: number;
    skills: string[];
}

interface RecruitmentStep {
    name: string
    color: string
}


const recruitmentProcess = ref<RecruitmentStep[]>([
    { name: '접수', color: 'bg-gray-400' },
    { name: '과제 평가', color: 'bg-orange-500' },
    { name: '직무 인터뷰', color: 'bg-yellow-500' },
    { name: '컬쳐핏 인터뷰', color: 'bg-green-500' },
    { name: '처우 협의', color: 'bg-cyan-500' },
    { name: '최종합격', color: 'bg-blue-500' }
])



// Process Setting Data
const newStepName = ref('');
const newStepColor = ref('bg-blue-500');
const editingIndex = ref(-1);
const editingName = ref('');
const editingColor = ref('');


// Process Setting Methods
const addStep = () => {
    if (!newStepName.value.trim()) return;

    recruitmentProcess.value.push({
        name: newStepName.value.trim(),
        color: newStepColor.value
    });

    newStepName.value = '';
    newStepColor.value = 'bg-blue-500';
};

const startEdit = (index: number) => {
  const step = recruitmentProcess.value[index];
  if (!step) return; // step이 undefined일 경우 그냥 함수 종료

  editingIndex.value = index;
  editingName.value = step.name;
  editingColor.value = step.color;
};

const saveEdit = (index: number) => {
    if (!editingName.value.trim()) return;

    recruitmentProcess.value[index] = {
        name: editingName.value.trim(),
        color: editingColor.value
    };

    cancelEdit();
};

const cancelEdit = () => {
    editingIndex.value = -1;
    editingName.value = '';
    editingColor.value = '';
};

const removeStep = (index: number) => {
    if (recruitmentProcess.value.length <= 1) return;

    if (confirm('이 단계를 삭제하시겠습니까?')) {
        recruitmentProcess.value.splice(index, 1);
    }
};

const moveStep = (fromIndex: number, toIndex: number) => {
  const item = recruitmentProcess.value.splice(fromIndex, 1)[0];
  if (!item) return; // ✅ 없으면 함수 종료 (undefined 방어)

  recruitmentProcess.value.splice(toIndex, 0, item);
};

const resetToDefault = () => {
    if (confirm('기본 프로세스로 리셋하시겠습니까? 현재 설정이 모두 삭제됩니다.')) {
        recruitmentProcess.value = [
            { name: '접수', color: 'bg-gray-400' },
            { name: '과제 평가', color: 'bg-orange-500' },
            { name: '직무 인터뷰', color: 'bg-yellow-500' },
            { name: '컬쳐핏 인터뷰', color: 'bg-green-500' },
            { name: '처우 협의', color: 'bg-cyan-500' },
            { name: '최종합격', color: 'bg-blue-500' }
        ];
    }
};

const saveProcessChanges = () => {
    console.log('프로세스 변경사항 저장됨:', recruitmentProcess.value);
    alert('프로세스가 성공적으로 저장되었습니다.');
};

const activeTab = ref('info');

onMounted(() => {
    console.log('채용 상세 페이지 로드');
});
</script>