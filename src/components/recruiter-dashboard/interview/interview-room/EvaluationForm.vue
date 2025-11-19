<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { Info } from 'lucide-vue-next';
import type { EvaluationSaveForm, EvaluationTemplates } from '@/types/evaluation/Evaluation';
import evaluationAPI from '@/api/evaluation';
import { useRoute, useRouter } from 'vue-router'


const router = useRouter()
const route = useRoute()

const localEvaluation = ref<EvaluationTemplates>({
  evaluationTemplates: []
});

const evaluationSaveForm = ref<EvaluationSaveForm>({
  interviewId: Number(route.params.interviewId),
  overallComment: '',
  evaluationScores: [{
    id: 0,
    score: null,
    comment: ''
  }]
})

// watch(
//   () => props.evaluation,
//   (newVal) => {
//     localEvaluation.value = JSON.parse(JSON.stringify(newVal));
//   }
// );

const canSave = computed(() => {
  // 모든 항목에 점수가 입력되고 최종 평가가 선택되어야 저장 가능
  const allScored = localEvaluation.value.evaluationTemplates.every((c) => (c.score !== null) && (c.comment !== ''));
  const hasDecision = evaluationSaveForm.value.overallComment !== '';
  return allScored && hasDecision;
});

const selectScore = (criteriaId: number, score: number) => {
  const criteria = localEvaluation.value.evaluationTemplates.find((c) => c.id === criteriaId);
  if (criteria) {
    criteria.score = score;
  }
};

const handleSave = async () => {

  if (!canSave.value) {
    alert("모든 항목에 점수를 입력하세요.");
    return;
  }

  if (confirm("평가를 완료하면 수정할 수 없습니다. 완료하시겠습니까?")) {

    evaluationSaveForm.value.evaluationScores = localEvaluation.value.evaluationTemplates.map((e) => ({
      id: e.id,
      score: e.score,
      comment: e.comment
    }))

    const response = await evaluationAPI.requestEvaluationCompelete(evaluationSaveForm.value)
    if (response.success) {
      alert("평가를 완료하였습니다.")
      router.push('/')
    }
  }
};

onMounted(async () => {

  const response = await evaluationAPI.requestEvaluationCriteriaData()
  if (response.success) {
    localEvaluation.value.evaluationTemplates = response.results.evaluationTemplates
  }
})
</script>
<template>
  <div>
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
    <div v-for="(criteria, index) in localEvaluation.evaluationTemplates" :key="criteria.id"
      class="mb-8 pb-8 border-b border-slate-200">
      <h3 class="text-lg font-bold text-slate-800 mb-4">
        {{ index + 1 }}. {{ criteria.title }}
      </h3>
      <p class="text-sm text-slate-600 mb-4">{{ criteria.description }}</p>

      <!-- 점수 선택 -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-slate-700 mb-3">평가 점수</label>
        <div class="flex gap-2">
          <button v-for="score in [1, 2, 3, 4, 5]" :key="score" @click="selectScore(criteria.id, score)"
            class="hover:cursor-pointer w-12 h-12 rounded-lg border-2 transition-colors flex items-center justify-center font-semibold"
            :class="criteria.score === score
              ? 'border-slate-600 bg-slate-600 text-white'
              : 'border-slate-300 hover:border-slate-600 hover:bg-slate-50 text-slate-700'
              ">
            {{ score }}
          </button>
        </div>
      </div>

      <!-- 의견 작성 -->
      <div>
        <label class="block text-sm font-medium text-slate-700 mb-2">평가 의견</label>
        <textarea v-model="criteria.comment"
          class="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-600 focus:border-transparent resize-none"
          rows="4" placeholder="구체적인 평가 의견을 작성해주세요..."></textarea>
      </div>
    </div>

    <!-- 종합 의견 -->
    <div class="mb-6">
      <h3 class="text-lg font-bold text-slate-800 mb-4">종합 의견</h3>
      <textarea v-model="evaluationSaveForm.overallComment"
        class="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-600 focus:border-transparent resize-none"
        rows="6" placeholder="지원자에 대한 전반적인 평가와 의견을 작성해주세요..."></textarea>
    </div>

    <!-- 저장 버튼 -->
    <div class="flex gap-3">
      <button @click="handleSave"
        class="hover:cursor-pointer flex-1 px-6 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors font-medium disabled:bg-slate-300 disabled:cursor-not-allowed">
        평가 완료
      </button>
    </div>
  </div>
</template>