<script setup lang="ts">
import { ref, computed } from 'vue'
import { X, Search } from 'lucide-vue-next'
import BoardRegisterModal from './BoardRegister.vue'
import type { Announcement } from '@/types/board'

const props = defineProps<{ open: boolean; items: Announcement[] }>()
const emit  = defineEmits<{
  (e:'update:open', v:boolean): void
  (e:'created', v: Announcement): void
  (e:'updated', v: Announcement): void
  (e:'deleted', id: string | number): void
}>()

/* 검색/필터/정렬 */
const query = ref('')
const onlyPosted = ref(true)
const sort = ref<'recent' | 'old'>('recent')
function closeManager(){ emit('update:open', false) }

const filtered = computed(() => {
  let arr = [...props.items]
  if (onlyPosted.value) arr = arr.filter(i => i.status === 'POSTED')
  if (query.value.trim()) {
    const q = query.value.trim().toLowerCase()
    arr = arr.filter(i => i.title.toLowerCase().includes(q))
  }
  arr.sort((a,b) => sort.value === 'recent'
    ? +new Date(b.createdAt) - +new Date(a.createdAt)
    : +new Date(a.createdAt) - +new Date(b.createdAt))
  return arr
})

/* 체크박스 */
const selectedIds = ref<Set<string | number>>(new Set())
const allChecked = computed(() => filtered.value.length > 0 && filtered.value.every(r => selectedIds.value.has(r.id)))
function toggleAll(checked: boolean) { checked ? filtered.value.forEach(r => selectedIds.value.add(r.id))
                                            : filtered.value.forEach(r => selectedIds.value.delete(r.id)) }
function toggleRow(row: Announcement, checked: boolean) { checked ? selectedIds.value.add(row.id) : selectedIds.value.delete(row.id) }

/* 상세/생성/수정 */
const openDetail = ref(false)
const selected   = ref<Announcement | null>(null)
function openDetailWith(row: Announcement){ selected.value = row; openDetail.value = true }

const openCreate = ref(false)
const openEdit   = ref(false)
const editTarget = ref<Announcement | null>(null)
function startCreate(){ openCreate.value = true }
function startEdit(row: Announcement){ editTarget.value = { ...row }; openEdit.value = true }

/* 삭제 */
function removeRow(row: Announcement){
  if (!confirm('이 공지를 삭제할까요?')) return
  selectedIds.value.delete(row.id)
  emit('deleted', String(row.id))
}

/* 생성/수정 콜백 */
function handleSave(v: Announcement){
  const newItem: Announcement = {
    id: (v as any).id || crypto.randomUUID(),
    title: v.title,
    content: (v as any).content ?? '',
    audience: (v as any).audience ?? 'ALL',
    files: (v as any).files ?? [],
    status: (v as any).status ?? 'POSTED',
    createdAt: (v as any).createdAt ?? new Date().toISOString(),
    createdBy: (v as any).createdBy ?? 'Halo',
    isNew: (v as any).isNew ?? true,
  } as any
  emit('created', newItem)
  openCreate.value = false
}
function handleUpdate(v: Announcement){
  emit('updated', v)
  openEdit.value = false
  // 상세 창에도 반영
  if (openDetail.value && selected.value && String(selected.value.id) === String(v.id)) {
    selected.value = { ...selected.value, ...v }
  }
}

/* 날짜 */
function fmtDate(v?: string | number | Date, withTime = false) {
  if (!v) return '-'
  const d = v instanceof Date ? v : new Date(v)
  if (isNaN(d.getTime())) return '-'
  return withTime ? d.toLocaleString('ko-KR')
                  : d.toLocaleDateString('ko-KR', { year:'numeric', month:'long', day:'numeric', weekday:'long' })
}
</script>

<template>
  <transition name="fade">
    <div v-if="open" class="fixed inset-0 z-[60]">
      <div class="absolute inset-0 bg-black/30" @click="closeManager"></div>
      <div class="absolute inset-0 flex items-start justify-center p-4 sm:p-6">
        <div class="w-[min(100vw-2rem)] max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden">
          <!-- 헤더 -->
          <div class="flex items-center justify-between px-6 py-4 border-b border-slate-200">
            <h3 class="font-semibold text-slate-800">공지사항 관리</h3>
            <button class="size-9 grid place-items-center rounded-xl hover:bg-slate-100" @click="closeManager" type="button">
              <X class="size-5 text-slate-500" />
            </button>
          </div>

          <!-- 컨트롤 -->
          <div class="px-6 pt-4 pb-3 flex flex-wrap gap-3 items-center">
            <div class="relative">
              <Search class="size-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input v-model="query" type="text" placeholder="공지 제목 검색"
                     class="h-10 pl-9 pr-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-600/30" />
            </div>

            <select v-model="sort" class="h-10 px-3 rounded-xl border border-slate-200 text-sm focus:outline-none">
              <option value="recent">정렬 : 최신순</option>
              <option value="old">정렬 : 오래된순</option>
            </select>

            <button class="h-10 px-3 rounded-xl border border-slate-200 text-sm"
                    :class="onlyPosted ? 'bg-slate-100 text-slate-800' : 'text-slate-700 hover:bg-slate-50'"
                    @click="onlyPosted = !onlyPosted">
              게시 중인 공지만 보기
            </button>

            <div class="ml-auto">
              <button class="h-10 px-4 rounded-xl bg-slate-600 text-white" @click="startCreate" type="button">
                공지사항 만들기
              </button>
            </div>
          </div>

          <!-- 테이블 -->
          <div class="px-6 pb-6 max-h-[min(100vh-10rem)] overflow-auto">
            <div class="overflow-x-auto border border-slate-200 rounded-2xl">
              <table class="min-w-full text-sm">
                <thead class="bg-slate-50 text-slate-600">
                  <tr>
                    <th class="text-left font-medium px-4 py-3 w-10">
                      <input type="checkbox" class="accent-slate-600"
                             :checked="allChecked"
                             @change="toggleAll(($event.target as HTMLInputElement).checked)" />
                    </th>
                    <th class="text-left font-medium px-4 py-3">공지 제목</th>
                    <th class="text-left font-medium px-4 py-3">게시 상태</th>
                    <th class="text-left font-medium px-4 py-3">게시 시작일 / 마감일</th>
                    <th class="text-left font-medium px-4 py-3">공지 대상</th>
                    <th class="text-left font-medium px-4 py-3">생성일</th>
                    <th class="text-left font-medium px-4 py-3">생성자</th>
                    <th class="text-right font-medium px-4 py-3 w-28">작업</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="row in filtered" :key="row.id" class="border-t border-slate-100">
                    <td class="px-4 py-3">
                      <input type="checkbox" class="accent-slate-600"
                             :checked="selectedIds.has(row.id)"
                             @change.stop="toggleRow(row, ($event.target as HTMLInputElement).checked)" />
                    </td>
                    <td class="px-4 py-3 text-slate-800 cursor-pointer" @click="openDetailWith(row)">{{ row.title }}</td>
                    <td class="px-4 py-3">
                      <span v-if="row.status==='POSTED'" class="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-700 border border-indigo-200">게시 중</span>
                      <span v-else class="text-xs px-2 py-0.5 rounded-full bg-slate-500/10 text-slate-700 border border-slate-200">예약/임시</span>
                    </td>
                    <td class="px-4 py-3 text-slate-600">
                      <span>{{ fmtDate(row.startAt, true) }}</span>
                      <span class="text-slate-400"> / </span>
                      <span>{{ fmtDate(row.endAt, true) }}</span>
                    </td>
                    <td class="px-4 py-3 text-slate-700">{{ row.audience==='ALL' ? '전체' : (row.audience==='ADMIN' ? '관리자' : '커스텀') }}</td>
                    <td class="px-4 py-3 text-slate-700">{{ fmtDate(row.createdAt) }}</td>
                    <td class="px-4 py-3 text-slate-700">{{ row.createdBy }}</td>
                    <td class="px-4 py-3 text-right">
                      <div class="flex justify-end gap-2">
                        <button class="px-3 h-8 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs"
                                @click.stop="startEdit(row)">수정</button>
                        <button class="px-3 h-8 rounded-lg border border-red-200 hover:bg-red-50 text-red-600 text-xs"
                                @click.stop="removeRow(row)">삭제</button>
                      </div>
                    </td>
                  </tr>
                  <tr v-if="!filtered.length">
                    <td colspan="8" class="px-4 py-12 text-center text-slate-500">등록된 공지사항이 없습니다.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>

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
                <path d="M18 6 6 18M6 6l12 12" stroke-width="2" stroke-linecap="round" />
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
                <strong class="text-slate-700">{{ selected!.audience==='ALL'?'전체':(selected!.audience==='ADMIN'?'관리자':'커스텀') }}</strong>
              </span>
            </div>
            <hr class="my-4 border-slate-200" />
            <div class="min-h-48 whitespace-pre-wrap break-words text-slate-800 leading-7">
              {{ selected!.content }}
            </div>
          </div>

          <div class="px-6 py-4 border-t border-slate-200 flex justify-between">
            <button class="h-10 px-5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50"
                    @click="openDetail=false; startEdit(selected!)" type="button">수정</button>
            <button class="h-10 px-5 rounded-xl bg-slate-700 text-white" @click="openDetail=false" type="button">확인</button>
          </div>
        </div>
      </div>
    </div>
  </transition>

  <!-- 생성/수정 모달 -->
  <BoardRegisterModal v-model:open="openCreate" @save="handleSave" />
  <BoardRegisterModal v-model:open="openEdit" mode="edit" :notice="editTarget ?? undefined" @save-edit="handleUpdate" />
</template>

<style scoped>
.fade-enter-active,.fade-leave-active{ transition: opacity .15s; }
.fade-enter-from,.fade-leave-to{ opacity: 0; }
</style>
