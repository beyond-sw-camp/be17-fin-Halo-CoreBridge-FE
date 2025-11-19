import { defineStore } from 'pinia'
import type {
  EvaluationSaveForm,
  EvaluationTemplates,
  EvaluationScoreForm,
} from '@/types/evaluation/Evaluation'

export const useEvaluationStore = defineStore('evaluation', {
  state: () => ({
    templates: [] as EvaluationTemplates['evaluationTemplates'],
    saveForm: {
      assignmentId: 0,
      overallComment: '',
      evaluationScores: [{}] as EvaluationScoreForm[],
    } as EvaluationSaveForm,
  }),

  actions: {
    setTemplates(templates: EvaluationTemplates['evaluationTemplates']) {
      this.templates = templates

      // 템플릿 기준으로 evaluationScores 초기화
      this.saveForm.evaluationScores = templates.map((t) => ({
        id: t.id,
        score: null,
        comment: '',
      }))
    },

    setAssignmentId(id: number) {
      this.saveForm.assignmentId = id
    },

    updateScore(criteriaId: number, score: number) {
      const target = this.saveForm.evaluationScores.find((e) => e.id === criteriaId)
      if (target) target.score = score
    },

    updateComment(criteriaId: number, comment: string) {
      const target = this.saveForm.evaluationScores.find((e) => e.id === criteriaId)
      if (target) target.comment = comment
    },

    updateOverallComment(comment: string) {
      this.saveForm.overallComment = comment
    },

    reset() {
      this.templates = []
      this.saveForm = {
        assignmentId: 0,
        overallComment: '',
        evaluationScores: [],
      }
    },
  },
})
