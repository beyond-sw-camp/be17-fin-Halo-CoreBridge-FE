<script setup lang="ts">
import KanbanColumn from './KanbanColumn.vue'
import KanbanCard from './KanbanCard.vue'

type Card = { id:number; name:string; role:string; tags?:string[]; note?:string }
type Column = { id:number; title:string; toneClass?:string; headerTextClass?:string }

// ✅ 정적 샘플 데이터(화면 확인용). 추후 API 연동 시 props로 전환.
const columns: Column[] = [
  { id: 1, title: '서류 접수', toneClass: 'bg-slate-100', headerTextClass: 'text-slate-700' },
  { id: 2, title: '서류 합격', toneClass: 'bg-blue-50',  headerTextClass: 'text-blue-700' },
  { id: 3, title: '1차 면접', toneClass: 'bg-yellow-50', headerTextClass: 'text-yellow-700' },
  { id: 4, title: '2차 면접', toneClass: 'bg-purple-50', headerTextClass: 'text-purple-700' },
  { id: 5, title: '최종 합격', toneClass: 'bg-green-50', headerTextClass: 'text-green-700' },
]

const byColumn: Record<number, Card[]> = {
  1: [
    { id: 1, name: '김민수', role: '백엔드 개발자', tags: ['Java','Spring'], note: '이력서 업데이트(10/12)' },
    { id: 2, name: '이영희', role: '프론트엔드 개발자', tags: ['Vue','TypeScript'], note: '포트폴리오 링크 첨부' },
    { id: 3, name: '박지훈', role: '디자이너', tags: ['Figma'], note: '과제 파일 제출 예정' },
  ],
  2: [
    { id: 4, name: '정수진', role: '데브옵스 엔지니어', tags: ['AWS','Docker'], note: '추천서 첨부' },
  ],
  3: [
    { id: 5, name: '최우석', role: '백엔드 개발자', tags: ['JPA','QueryDSL'], note: '10/16 14:00 1차 면접 예정' },
    { id: 6, name: '한예린', role: '프론트엔드 개발자', tags: ['Vue','Pinia'], note: '10/17 10:00 1차 면접 예정' },
  ],
  4: [
    { id: 7, name: '오지훈', role: 'QA 엔지니어', tags: ['Cypress'], note: '오퍼 발송 완료' },
  ],
  5: [
    { id: 8, name: '홍길동', role: 'dev 엔지니어', tags: ['Cypress'], note: '칸반 툴' },
  ],
}
</script>

<template>
  <div class="flex gap-4 overflow-x-auto pb-4">
    <KanbanColumn
      v-for="col in columns"
      :key="col.id"
      :title="col.title"
      :count="(byColumn[col.id] || []).length"
      :toneClass="col.toneClass"
      :headerTextClass="col.headerTextClass"
    >
      <template #default>
        <KanbanCard
          v-for="card in byColumn[col.id] || []"
          :key="card.id"
          :name="card.name"
          :role="card.role"
          :tags="card.tags"
          :note="card.note"
          :avatarText="card.name[0]"
        />
      </template>
    </KanbanColumn>
  </div>
</template>
