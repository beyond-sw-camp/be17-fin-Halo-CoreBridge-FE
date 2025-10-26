<template>
  <div class="bg-slate-50 h-screen overflow-hidden flex flex-col">
    <!-- 상단 헤더 -->
    <div class="bg-white border-b border-slate-200 px-6 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <button @click="goBack" class="text-slate-600 hover:text-slate-800">
            <ArrowLeft class="w-5 h-5" />
          </button>
          <div>
            <h1 class="text-xl font-bold text-slate-800">
              {{ candidate.position }} - {{ candidate.name }}
            </h1>
            <p class="text-sm text-slate-600">
              {{ interview.round }} · {{ interview.date }} {{ interview.time }}
            </p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <div class="flex items-center gap-2 px-3 py-2 bg-green-50 text-green-700 rounded-lg">
            <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span class="text-sm font-medium">진행중</span>
          </div>
          <button
            @click="endInterview"
            class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
          >
            <X class="w-4 h-4" />
            면접 종료
          </button>
        </div>
      </div>
    </div>

    <!-- 메인 컨텐츠 -->
    <div class="flex flex-1 overflow-hidden">
      <!-- 왼쪽 패널 - 평가지 -->
      <div class="flex-1 bg-white border-r border-slate-200 flex flex-col">
        <!-- 탭 -->
        <div class="flex border-b border-slate-200">
          <button
            @click="activeTab = 'resume'"
            :class="[
              'flex-1 px-6 py-3 font-medium flex items-center justify-center gap-2',
              activeTab === 'resume'
                ? 'text-slate-600 border-b-2 border-slate-600'
                : 'text-slate-500 hover:text-slate-600'
            ]"
          >
            <FileText class="w-4 h-4" />
            이력서
          </button>
          <button
            @click="activeTab = 'evaluation'"
            :class="[
              'flex-1 px-6 py-3 font-medium flex items-center justify-center gap-2',
              activeTab === 'evaluation'
                ? 'text-slate-600 border-b-2 border-slate-600'
                : 'text-slate-500 hover:text-slate-600'
            ]"
          >
            <ClipboardCheck class="w-4 h-4" />
            평가지
          </button>
        </div>

        <!-- 평가지 내용 -->
        <div class="flex-1 overflow-y-auto p-6">
          <!-- 평가 안내 -->
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div class="flex items-start gap-3">
              <Info class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 class="font-semibold text-blue-900 mb-1">평가 작성 안내</h3>
                <p class="text-sm text-blue-800">
                  각 평가 항목에 대해 1-5점으로 평가하고, 구체적인 의견을 작성해주세요.
                </p>
              </div>
            </div>
          </div>

          <!-- 평가 항목 -->
          <div
            v-for="(criterion, index) in evaluationCriteria"
            :key="criterion.id"
            class="mb-8 pb-8 border-b border-slate-200"
          >
            <h3 class="text-lg font-bold text-slate-800 mb-4">
              {{ index + 1 }}. {{ criterion.title }}
            </h3>
            <p class="text-sm text-slate-600 mb-4">{{ criterion.description }}</p>

            <!-- 점수 선택 -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-slate-700 mb-3">평가 점수</label>
              <div class="flex gap-2">
                <button
                  v-for="score in 5"
                  :key="score"
                  @click="criterion.score = score"
                  :class="[
                    'w-12 h-12 rounded-lg border-2 transition-colors flex items-center justify-center font-semibold',
                    criterion.score === score
                      ? 'border-slate-600 bg-slate-600 text-white'
                      : 'border-slate-300 hover:border-slate-600 hover:bg-slate-50 text-slate-700'
                  ]"
                >
                  {{ score }}
                </button>
              </div>
            </div>

            <!-- 의견 작성 -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">평가 의견</label>
              <textarea
                v-model="criterion.comment"
                class="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-600 focus:border-transparent resize-none"
                rows="4"
                placeholder="구체적인 평가 의견을 작성해주세요..."
              ></textarea>
            </div>
          </div>

          <!-- 종합 의견 -->
          <div class="mb-6">
            <h3 class="text-lg font-bold text-slate-800 mb-4">종합 의견</h3>
            <textarea
              v-model="overallComment"
              class="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-600 focus:border-transparent resize-none"
              rows="6"
              placeholder="지원자에 대한 전반적인 평가와 의견을 작성해주세요..."
            ></textarea>
          </div>

          <!-- 최종 평가 -->
          <div class="mb-6">
            <h3 class="text-lg font-bold text-slate-800 mb-4">최종 평가</h3>
            <div class="grid grid-cols-3 gap-3">
              <button
                v-for="decision in finalDecisions"
                :key="decision.value"
                @click="finalDecision = decision.value"
                :class="[
                  'px-6 py-3 border-2 rounded-lg transition-colors font-medium',
                  finalDecision === decision.value
                    ? decision.activeClass
                    : 'border-slate-300 hover:border-slate-600 hover:bg-slate-50 text-slate-700'
                ]"
              >
                {{ decision.label }}
              </button>
            </div>
          </div>

          <!-- 저장 버튼 -->
          <div class="flex gap-3">
            <button
              @click="saveEvaluation"
              class="flex-1 px-6 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors font-medium"
            >
              평가 저장
            </button>
            <button
              @click="saveDraft"
              class="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
            >
              임시 저장
            </button>
          </div>
        </div>
      </div>

      <!-- 오른쪽 패널 - 채팅 -->
      <div class="w-96 bg-white flex flex-col">
        <!-- 채팅 헤더 -->
        <div class="px-4 py-3 border-b border-slate-200">
          <h3 class="font-semibold text-slate-800 flex items-center gap-2">
            <MessageSquare class="w-5 h-5" />
            면접관 채팅
          </h3>
          <p class="text-sm text-slate-600 mt-1">
            참여 면접관 {{ interviewers.length }}명
          </p>
        </div>

        <!-- 참여 면접관 -->
        <div class="px-4 py-3 border-b border-slate-200">
          <div class="flex items-center gap-2 mb-2">
            <div class="flex -space-x-2">
              <div
                v-for="(interviewer, index) in interviewers"
                :key="index"
                :class="[
                  'w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-medium',
                  getAvatarColor(index)
                ]"
              >
                {{ interviewer.charAt(0) }}
              </div>
            </div>
            <span class="text-sm text-slate-600">{{ interviewers.join(', ') }}</span>
          </div>
        </div>

        <!-- 채팅 메시지 영역 -->
        <div class="flex-1 overflow-y-auto p-4 space-y-4">
          <!-- 시스템 메시지 -->
          <div class="text-center">
            <span class="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              면접이 시작되었습니다
            </span>
          </div>

          <!-- 메시지 -->
          <div
            v-for="message in messages"
            :key="message.id"
            :class="[
              'flex items-start gap-2',
              message.isMe && 'flex-row-reverse'
            ]"
          >
            <div
              :class="[
                'w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-medium',
                message.isMe ? 'bg-slate-600' : getAvatarColor(message.senderIndex || 0)
              ]"
            >
              {{ message.sender.charAt(0) }}
            </div>
            <div class="flex-1">
              <div
                :class="[
                  'flex items-center gap-2 mb-1',
                  message.isMe && 'flex-row-reverse'
                ]"
              >
                <span class="text-sm font-medium text-slate-800">{{ message.sender }}</span>
                <span class="text-xs text-slate-500">{{ message.time }}</span>
              </div>
              <div
                :class="[
                  'rounded-lg px-3 py-2 text-sm',
                  message.isMe
                    ? 'bg-slate-600 text-white ml-auto max-w-fit'
                    : 'bg-slate-100 text-slate-800'
                ]"
              >
                {{ message.content }}
              </div>
            </div>
          </div>
        </div>

        <!-- 채팅 입력 영역 -->
        <div class="p-4 border-t border-slate-200">
          <div class="flex items-end gap-2">
            <textarea
              v-model="newMessage"
              @keydown.enter.exact.prevent="sendMessage"
              class="flex-1 resize-none border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-600 focus:border-transparent"
              rows="2"
              placeholder="메시지를 입력하세요..."
            ></textarea>
            <button
              @click="sendMessage"
              class="bg-slate-600 text-white p-2 rounded-lg hover:bg-slate-700 transition-colors flex-shrink-0"
            >
              <Send class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  ArrowLeft,
  X,
  FileText,
  ClipboardCheck,
  Info,
  MessageSquare,
  Send
} from 'lucide-vue-next';

interface EvaluationCriterion {
  id: number;
  title: string;
  description: string;
  score: number | null;
  comment: string;
}

interface Message {
  id: number;
  sender: string;
  senderIndex?: number;
  content: string;
  time: string;
  isMe: boolean;
}

const activeTab = ref<'resume' | 'evaluation'>('evaluation');
const newMessage = ref('');
const overallComment = ref('');
const finalDecision = ref<'highly_recommend' | 'recommend' | 'hold' | null>(null);

const interview = {
  round: '1차 면접',
  date: '2025.10.22',
  time: '14:00 - 15:00'
};

const candidate = {
  name: '김지수',
  position: '프론트엔드 개발자'
};

const interviewers = ['박민준', '이서연', '최현우'];

const evaluationCriteria = ref<EvaluationCriterion[]>([
  {
    id: 1,
    title: '기술 역량',
    description: '지원 직무에 필요한 기술적 지식과 실무 경험',
    score: 4,
    comment: 'Vue.js와 TypeScript에 대한 깊은 이해를 보여줌. 실제 프로젝트 경험을 통해 성능 최적화와 유지보수성 개선에 대한 고민이 돋보임.'
  },
  {
    id: 2,
    title: '문제 해결 능력',
    description: '복잡한 문제를 논리적으로 분석하고 해결하는 능력',
    score: 5,
    comment: '기술 부채 해결 사례를 구체적으로 설명함. 마이그레이션 과정에서 발생한 문제들을 체계적으로 접근하여 해결한 경험이 인상적.'
  },
  {
    id: 3,
    title: '커뮤니케이션',
    description: '명확하게 의사를 전달하고 협업하는 능력',
    score: 4,
    comment: ''
  },
  {
    id: 4,
    title: '성장 가능성',
    description: '새로운 기술을 학습하고 발전하려는 의지와 잠재력',
    score: null,
    comment: ''
  }
]);

const finalDecisions = [
  {
    value: 'highly_recommend' as const,
    label: '적극 추천',
    activeClass: 'border-green-500 bg-green-50 text-green-700'
  },
  {
    value: 'recommend' as const,
    label: '추천',
    activeClass: 'border-blue-500 bg-blue-50 text-blue-700'
  },
  {
    value: 'hold' as const,
    label: '보류',
    activeClass: 'border-amber-500 bg-amber-50 text-amber-700'
  }
];

const messages = ref<Message[]>([
  {
    id: 1,
    sender: '박민준',
    senderIndex: 0,
    content: 'Vue 3 경험이 풍부해 보이네요',
    time: '14:05',
    isMe: false
  },
  {
    id: 2,
    sender: '나',
    content: '네, TypeScript 활용도도 높아 보입니다',
    time: '14:06',
    isMe: true
  },
  {
    id: 3,
    sender: '이서연',
    senderIndex: 1,
    content: '프로젝트 경험에 대해 더 구체적으로 질문해볼까요?',
    time: '14:08',
    isMe: false
  }
]);

const getAvatarColor = (index: number) => {
  const colors = ['bg-slate-400', 'bg-slate-500', 'bg-slate-600'];
  return colors[index % colors.length];
};

const goBack = () => {
  console.log('뒤로 가기');
  // 라우터로 목록 화면으로 이동
};

const endInterview = () => {
  console.log('면접 종료');
  // 면접 종료 확인 모달 표시
};

const saveEvaluation = () => {
  // 유효성 검사
  const hasAllScores = evaluationCriteria.value.every(c => c.score !== null);
  if (!hasAllScores) {
    alert('모든 평가 항목에 점수를 입력해주세요.');
    return;
  }

  if (!finalDecision.value) {
    alert('최종 평가를 선택해주세요.');
    return;
  }

  console.log('평가 저장:', {
    criteria: evaluationCriteria.value,
    overallComment: overallComment.value,
    finalDecision: finalDecision.value
  });

  alert('평가가 저장되었습니다.');
};

const saveDraft = () => {
  console.log('임시 저장:', {
    criteria: evaluationCriteria.value,
    overallComment: overallComment.value,
    finalDecision: finalDecision.value
  });

  alert('임시 저장되었습니다.');
};

const sendMessage = () => {
  if (!newMessage.value.trim()) return;

  const now = new Date();
  const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

  messages.value.push({
    id: messages.value.length + 1,
    sender: '나',
    content: newMessage.value,
    time,
    isMe: true
  });

  newMessage.value = '';
};
</script>
