<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Settings, Plus, ChevronLeft, ChevronRight, BadgeInfo } from 'lucide-vue-next'
import BoardRegister from './BoardRegister.vue'
import BoardManager from './BoardManager.vue'
import type { Announcement } from '@/types/board'

const openRegister = ref(false)
const openManager  = ref(false)

const items = ref<Announcement[]>([
  {
    id: crypto.randomUUID(),
    title: 'tttt',
    content: '샘플 공지 내용입니다.',
    audience: 'ALL',
    files: [],
    status: 'POSTED',
    createdAt: new Date().toISOString(),
    createdBy: 'Halo',
    isNew: true,
  },
])

/* 상세 */
const openDetail = ref(false)
const selected   = ref<Announcement | null>(null)
function openDetailWith(row: Announcement) { selected.value = row; openDetail.value = true }

/* 새 글 저장(작성 모달) */
function handleSave(a: Announcement) {
  items.value.unshift({
    ...a,
    id: (a as any).id || crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    createdBy: 'Halo',
    status: 'POSTED',
    isNew: true,
  })
  openRegister.value = false
  page.value = 1
}

/* 날짜 */
function fmtDate(v?: string | number | Date) {
  if (!v) return '-'
  const d = v instanceof Date ? v : new Date(v)
  return isNaN(d.getTime())
    ? '-'
    : d.toLocaleDateString('ko-KR', { year:'numeric', month:'long', day:'numeric', weekday:'long' })
}

/* 페이지네이션 */
const page = ref(1)
const pageSize = ref(10)
const pageSizeOptions = [5, 10, 15, 20, 30, 50]
const totalPages = computed(() => Math.max(1, Math.ceil(items.value.length / pageSize.value)))
const paginatedItems = computed(() => {
  const start = (page.value - 1) * pageSize.value
  return items.value.slice(start, start + pageSize.value)
})
function prevPage(){ page.value = Math.max(1, page.value - 1) }
function nextPage(){ page.value = Math.min(totalPages.value, page.value + 1) }
watch([() => items.value.length, pageSize], () => { page.value = Math.min(page.value, totalPages.value) })
</script>

<template>
  <div class="max-w-6xl mx-auto p-6">
    <!-- 상단 바 -->
    <div class="flex flex-wrap items-center justify-between gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4">
      <div class="flex items-center gap-3">
        <h2 class="text-slate-700 font-semibold">사내 공지사항</h2>

        <!-- 페이지네이션 -->
        <div class="flex items-center gap-2 text-slate-500">
          <button class="inline-flex items-center justify-center size-8 rounded-lg border border-slate-200 hover:bg-slate-100"
                  :disabled="page===1" @click="prevPage">
            <ChevronLeft class="size-4" />
          </button>
          <span class="text-sm select-none">{{ page }} / {{ totalPages }}</span>
          <button class="inline-flex items-center justify-center size-8 rounded-lg border border-slate-200 hover:bg-slate-100"
                  :disabled="page===totalPages" @click="nextPage">
            <ChevronRight class="size-4" />
          </button>
        </div>

        <!-- 페이지당 개수 -->
        <div class="flex items-center gap-2 text-sm text-slate-600">
          <span class="hidden sm:inline">페이지 당</span>
          <select v-model.number="pageSize" class="h-9 px-2 rounded-lg border border-slate-200 bg-white">
            <option v-for="n in pageSizeOptions" :key="n" :value="n">{{ n }}</option>
          </select>
          <span>개 (최대 50)</span>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <button class="inline-flex items-center gap-2 px-3 h-10 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700"
                @click="openManager = true">
          <Settings class="size-4" />
          <span class="text-sm">관리</span>
        </button>

        <button class="inline-flex items-center gap-2 px-4 h-10 rounded-xl bg-slate-600 text-white hover:opacity-90"
                @click="openRegister = true">
          <Plus class="size-4" />
          <span class="text-sm">공지사항 만들기</span>
        </button>
      </div>
    </div>

    <!-- 리스트(페이지 적용) -->
    <div class="mt-4 space-y-4">
      <div v-for="a in paginatedItems" :key="a.id"
           class="bg-white border border-slate-200 rounded-2xl p-6 cursor-pointer hover:bg-slate-50"
           @click="openDetailWith(a)">
        <div class="flex items-start justify-between">
          <div class="flex items-center gap-3">
            <span class="text-slate-800 font-medium break-words">{{ a.title }}</span>
            <span v-if="a.isNew" class="text-xs px-2 py-0.5 rounded-full bg-violet-600/10 text-violet-700 border border-violet-200">새 공지</span>
            <span v-if="a.audience==='ADMIN'" class="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 border border-amber-200">관리자</span>
            <span v-if="a.audience==='CUSTOM'" class="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 border border-emerald-200">커스텀</span>
          </div>
          <div class="text-slate-500 text-sm">{{ fmtDate(a.createdAt) }}</div>
        </div>
        <p class="mt-3 text-slate-600 text-sm flex gap-2">
          <BadgeInfo class="size-4 mt-0.5 shrink-0 text-slate-400" />
          <span class="leading-6 break-words">{{ a.content }}</span>
        </p>
      </div>

      <div v-if="!paginatedItems.length" class="text-center text-slate-500 py-20 border border-dashed rounded-2xl">
        표시할 공지가 없습니다.
      </div>
    </div>

    <!-- 작성 모달 -->
    <BoardRegister v-model:open="openRegister" @save="handleSave" />

    <!-- 관리 모달 (create/update/delete 이벤트 수신) -->
    <BoardManager
      v-model:open="openManager"
      :items="items"
      @created="(v) => { items.value.unshift({ ...v, id: v.id || crypto.randomUUID() }); page.value = 1 }"
      @updated="(v) => {
        const i = items.value.findIndex(x => String(x.id) === String(v.id))
        if (i >= 0) {
          items.value[i] = { ...items.value[i], ...v }
          items.value = items.value.slice()    // 강제 반응성 플러시
        } else {
          items.value.unshift(v)
        }
      }"
      @deleted="(id) => { items.value = items.value.filter(x => String(x.id)!==String(id)) }"
    />

    <!-- 상세 모달 -->
    <transition name="fade">
      <div v-if="openDetail && selected" class="fixed inset-0 z-[70]">
        <div class="absolute inset-0 bg-black/40" @click="openDetail=false"></div>
        <div class="absolute inset-0 flex items-start justify-center p-4 sm:p-6">
          <div class="w-[min(100vw-2rem)] max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden">
            <div class="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <div class="flex items-center gap-3">
                <div class="size-9 rounded-full bg-slate-700 text-white grid place-items-center font-semibold">H</div>
                <div class="text-slate-800 font-semibold">Halo 공지사항</div>
              </div>
              <button class="size-9 grid place-items-center rounded-xl hover:bg-slate-100" @click="openDetail=false" type="button">
                <svg class="size-5 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M18 6 6 18M6 6l12 12" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </button>
            </div>

            <div class="px-6 py-5 max-h-[min(100vh-10rem)] overflow-auto">
              <h2 class="text-2xl font-bold text-slate-900 break-words">{{ selected!.title }}</h2>
              <div class="mt-2 text-slate-500 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                <span>{{ fmtDate(selected!.createdAt) }}</span>
                <span class="text-slate-300">|</span>
                <span>{{ selected!.createdBy }}</span>
                <span class="ml-auto">
                  공지 대상 :
                  <strong class="text-slate-700">
                    {{ selected!.audience === 'ALL' ? '전체' : (selected!.audience === 'ADMIN' ? '관리자' : '커스텀') }}
                  </strong>
                </span>
              </div>
              <hr class="my-4 border-slate-200" />
              <div class="min-h-48 whitespace-pre-wrap break-words text-slate-800 leading-7">
                {{ selected!.content }}
              </div>
            </div>

            <div class="px-6 py-4 border-t border-slate-200 flex justify-end">
              <button class="h-10 px-5 rounded-xl bg-slate-700 text-white" @click="openDetail=false" type="button">확인</button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.fade-enter-active,.fade-leave-active{ transition: opacity .15s; }
.fade-enter-from,.fade-leave-to{ opacity: 0; }
</style>
