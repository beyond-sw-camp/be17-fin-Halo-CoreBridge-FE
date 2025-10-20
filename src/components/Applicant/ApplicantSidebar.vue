<script setup lang="ts">
import { ref } from 'vue';
import { Plus, FileText } from 'lucide-vue-next';

interface ApplicantInfo {
  id: number;
  name: string;
  email: string;
  phone: string;
  appliedDate: string;
  position: string;
  status: string;
  statusColor: string;
}

interface RecruiterNote {
  id: number;
  author: string;
  content: string;
  createdAt: string;
}

interface Props {
  applicant: ApplicantInfo;
  recruiterNotes: RecruiterNote[];
}

const props = defineProps<Props>();
const emit = defineEmits<{
  addNote: [content: string];
}>();

const newNote = ref<string>('');

const getStatusColorClass = (color: string) => {
  const colors: Record<string, string> = {
    blue: 'bg-blue-500 text-white',
    green: 'bg-green-500 text-white',
    yellow: 'bg-yellow-500 text-white',
    purple: 'bg-purple-500 text-white',
    red: 'bg-red-500 text-white'
  };
  return colors[color] || 'bg-gray-500 text-white';
};

const handleAddNote = () => {
  if (!newNote.value.trim()) return;

  emit('addNote', newNote.value);
  newNote.value = '';
};
</script>

<template>
  <div class="w-80 bg-white border-r border-gray-200 flex flex-col">
    <!-- Applicant Name & Status -->
    <div class="p-6 border-b border-gray-200">
      <div class="flex items-start gap-4 mb-4">
        <!-- Profile Image -->
        <div class="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
          <img v-if="applicant.profileImage"
               :src="applicant.profileImage"
               :alt="applicant.name"
               class="w-full h-full object-cover" />
          <User v-else :size="32" class="text-gray-400" />
        </div>

        <!-- Name & Status -->
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-19 mb-2">
            <h2 class="text-xl font-bold text-slate-600">{{ applicant.name }}</h2>
            <span :class="getStatusColorClass(applicant.statusColor)"
                  class="px-2 py-1 rounded text-xs font-medium">
              {{ applicant.status }}
            </span>
          </div>
        </div>
      </div>

      <div class="space-y-2 text-sm">
        <div class="flex items-center justify-between text-gray-600">
          <span class="text-gray-500">채용 단계 이동</span>
          <button class="text-slate-600 hover:underline text-xs">전체 사용자</button>
        </div>
      </div>
    </div>

    <!-- Applicant Info -->
    <div class="p-6 border-b border-gray-200 space-y-4">
      <div>
        <div class="text-xs text-gray-500 mb-1">이메일</div>
        <div class="text-sm text-slate-600">{{ applicant.email }}</div>
      </div>
      <div>
        <div class="text-xs text-gray-500 mb-1">연락처</div>
        <div class="text-sm text-slate-600">{{ applicant.phone }}</div>
      </div>
      <div>
        <div class="text-xs text-gray-500 mb-1">지원경로</div>
        <div class="text-sm text-slate-600">헤드헌터(박진태)</div>
      </div>
      <div>
        <div class="text-xs text-gray-500 mb-1">접수일</div>
        <div class="text-sm text-slate-600">{{ applicant.appliedDate }}</div>
      </div>
      <button class="flex items-center gap-1 text-sm text-slate-600 hover:underline">
        <Plus :size="16" />
        태그
      </button>
    </div>

    <!-- Sections Menu -->
    <div class="flex-1 overflow-y-auto">
      <div class="p-4">
        <button class="w-full flex items-center gap-3 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded">
          <FileText :size="18" class="text-gray-400" />
          <span>지원자 관리</span>
          <span class="ml-auto text-xs text-gray-400">0</span>
        </button>
        <button class="w-full flex items-center gap-3 px-3 py-2 text-left text-sm text-slate-600 bg-gray-100 rounded font-medium">
          <FileText :size="18" class="text-slate-600" />
          <span>지원서</span>
        </button>
        <button class="w-full flex items-center gap-3 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded">
          <FileText :size="18" class="text-gray-400" />
          <span>면접 질문</span>
          <span class="ml-auto text-xs text-gray-400">0</span>
        </button>
        <button class="w-full flex items-center gap-3 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded">
          <FileText :size="18" class="text-gray-400" />
          <span>요청 자료</span>
          <span class="ml-auto text-xs text-gray-400">0</span>
        </button>
        <button class="w-full flex items-center gap-3 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded">
          <FileText :size="18" class="text-gray-400" />
          <span>외부 서비스</span>
          <span class="ml-auto text-xs text-gray-400">0</span>
        </button>
        <button class="w-full flex items-center gap-3 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded">
          <FileText :size="18" class="text-gray-400" />
          <span>채용 오퍼</span>
          <span class="ml-auto text-xs text-gray-400">0</span>
        </button>
        <button class="w-full flex items-center gap-3 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded">
          <FileText :size="18" class="text-gray-400" />
          <span>내 메모</span>
        </button>
        <button class="w-full flex items-center gap-3 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded">
          <FileText :size="18" class="text-gray-400" />
          <span>내부 자료</span>
          <span class="ml-auto text-xs text-gray-400">0</span>
        </button>
      </div>
    </div>

    <!-- Add Schedule Button -->
    <div class="p-4 border-t border-gray-200">
      <button class="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-gray-50 rounded border border-gray-300">
        <Plus :size="16" />
        <span>일정 만들기</span>
      </button>
    </div>

    <!-- Notes Section -->
    <div class="border-t border-gray-200 max-h-96 overflow-y-auto">
      <div class="p-4">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-sm font-semibold text-slate-600">메모</h3>
        </div>
        <textarea
          v-model="newNote"
          placeholder="메모를 입력하세요..."
          class="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent resize-none mb-2"
          rows="3"
        ></textarea>
        <button
          @click="handleAddNote"
          class="w-full px-3 py-2 bg-slate-600 text-white text-sm rounded hover:bg-slate-700 transition"
        >
          메모 추가
        </button>

        <div class="mt-4 space-y-3">
          <div v-for="note in recruiterNotes" :key="note.id" class="p-3 bg-gray-50 rounded text-xs">
            <div class="flex items-center justify-between mb-1">
              <span class="font-semibold text-slate-600">{{ note.author }} 님이 실행</span>
            </div>
            <p class="text-gray-700 mb-1">{{ note.content }}</p>
            <span class="text-gray-400">{{ note.createdAt }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

textarea::-webkit-scrollbar {
  width: 6px;
}
</style>
