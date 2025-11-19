export interface Evaluation {
  criteria: EvaluationCriteria[]
  assignmentId: number
}

export interface EvaluationTemplates {
  evaluationTemplates: EvaluationCriteria[]
}

export interface EvaluationCriteria {
  id: number
  title: string
  description: string
  score: number | null
  comment: string
}

export interface EvaluationScoreForm {
  id: number
  score: number | null
  comment: string
}

export interface EvaluationSaveForm {
  interviewId: number
  overallComment: string
  evaluationScores: EvaluationScoreForm[]
}
