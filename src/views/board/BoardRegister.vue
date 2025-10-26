<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { X, Paperclip, Image as ImageIcon, Link as LinkIcon } from 'lucide-vue-next'
import type { Audience, Announcement } from '@/types/board'

const props = defineProps<{ open: boolean; notice?: Announcement; mode?: 'create' | 'edit' }>()
const emit  = defineEmits<{
  (e:'update:open', v:boolean): void
  (e:'save', v: Announcement): void
  (e:'save-edit', v: Announcement): void
}>()

const isEdit   = computed(() => props.mode === 'edit')
const title    = ref('')
const audience = ref<Audience>('ALL')
const files    = ref<Array<{ name: string; size: number }>>([])
const content  = ref('')

watch(() => props.notice, (n) => {
  if (!n) return
  title.value    = n.title ?? ''
  audience.value = (n.audience as Audience) ?? 'ALL'
  content.value  = n.content ?? ''
  files.value    = Array.isArray((n as any).files) ? [...(n as any).files] : []
}, { immediate: true })

const canSubmit = computed(() => title.value.trim().length > 0 && content.value.trim().length > 0)

function close(){ emit('update:open', false) }

function onFile(e: Event) {
  const t = e.target as HTMLInputElement
  if (!t.files) return
  const picked = Array.from(t.files).map(f => ({ name: f.name, size: f.size }))
  if (picked.some(p => p.size > 50 * 1024 * 1024)) { alert('파일 용량은 개당 50MB 이하만 가능합니다.'); return }
  files.value.push(...picked)
  t.value = ''
}
function removeFile(i:number){ files.value.splice(i,1) }

/* 저장 */
function submit() {
  if (!canSubmit.value) return
  const payload: Announcement = {
    id: props.notice?.id ?? '',
    title: title.value.trim(),
    content: content.value.trim(),
    audience: audience.value,
    files: files.value as any,
    status: (props.notice as any)?.status ?? 'POSTED',
    createdAt: props.notice?.createdAt ?? new Date().toISOString(), // 수정 시 기존 값 유지
    createdBy: props.notice?.createdBy ?? 'Halo',
    isNew: (props.notice as any)?.isNew ?? true,
  } as any
  if (isEdit.value) emit('save-edit', payload)
  else emit('save', payload)
  emit('update:open', false)   // 저장 후 즉시 닫기
}
</script>

<template>
  <!-- 수정/작성 모달을 최상위에 표시 -->
  <transition name="fade">
    <div v-if="open" class="fixed inset-0 z-[90]">
      <div class="absolute inset-0 bg-black/30" @click="close"></div>
      <div class="absolute inset-0 flex items-start justify-center p-4 sm:p-6">
        <div class="w-[min(100vw-2rem)] max-w-3xl bg-white rounded-2xl shadow-xl overflow-hidden">
          <!-- 헤더 -->
          <div class="flex items-center justify-between px-6 py-4 border-b border-slate-200">
            <h3 class="font-semibold text-slate-800">{{ isEdit ? '내부 공지사항 수정' : '공지사항 만들기' }}</h3>
            <button class="size-9 grid place-items-center rounded-xl hover:bg-slate-100" @click="close" type="button">
              <X class="size-5 text-slate-500" />
            </button>
          </div>

          <!-- 본문 -->
          <div class="px-6 py-5 space-y-5 max-h-[min(100vh-10rem)] overflow-auto">
            <!-- 제목 -->
            <div>
              <label class="block text-sm text-slate-600 mb-1">공지 제목</label>
              <input
                v-model="title"
                type="text"
                placeholder="공지 제목을 입력해 주세요."
                class="w-full h-11 px-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-600/30" />
            </div>

            <!-- 대상 -->
            <div>
              <label class="block text-sm text-slate-600 mb-1">공지 대상</label>
              <div class="flex items-center gap-6">
                <label class="inline-flex items-center gap-2 text-slate-700">
                  <input type="radio" class="accent-slate-600" value="ALL" v-model="audience" />
                  전체
                </label>
                <label class="inline-flex items-center gap-2 text-slate-700">
                  <input type="radio" class="accent-slate-600" value="ADMIN" v-model="audience" />
                  관리자
                </label>
                <label class="inline-flex items-center gap-2 text-slate-700">
                  <input type="radio" class="accent-slate-600" value="CUSTOM" v-model="audience" />
                  멤버 및 커스텀 권한
                </label>
              </div>
            </div>

            <!-- 파일 첨부 -->
            <div>
              <label class="block text-sm text-slate-600 mb-1">파일 첨부</label>
              <div class="flex items-center gap-3">
                <label class="inline-flex items-center gap-2 h-10 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                  <Paperclip class="size-4 text-slate-600" />
                  <span class="text-sm">파일 선택</span>
                  <input type="file" class="hidden" @change="onFile" multiple />
                </label>
                <span class="text-xs text-slate-500">파일 용량 50MB 이하</span>
              </div>

              <div v-if="files.length" class="mt-3 grid gap-2">
                <div v-for="(f, i) in files" :key="i"
                     class="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
                  <div class="flex items-center gap-2 text-sm text-slate-700">
                    <ImageIcon class="size-4 text-slate-500" />
                    <span class="break-words">{{ f.name }}</span>
                    <span class="text-slate-400">· {{ (f.size/1024/1024).toFixed(1) }}MB</span>
                  </div>
                  <button class="text-slate-500 hover:text-slate-800" @click="removeFile(i)" type="button">삭제</button>
                </div>
              </div>
            </div>

            <!-- 에디터(텍스트) -->
            <div>
              <label class="block text-sm text-slate-600 mb-1">내용</label>
              <div class="flex items-center gap-2 mb-2">
                <button class="size-9 rounded-lg border border-slate-200 grid place-items-center hover:bg-slate-50" type="button">
                  <b class="text-slate-700">B</b>
                </button>
                <button class="size-9 rounded-lg border border-slate-200 grid place-items-center hover:bg-slate-50 italic" type="button">I</button>
                <button class="size-9 rounded-lg border border-slate-200 grid place-items-center hover:bg-slate-50 underline" type="button">U</button>
                <button class="size-9 rounded-lg border border-slate-200 grid place-items-center hover:bg-slate-50" type="button">
                  <LinkIcon class="size-4 text-slate-600" />
                </button>
              </div>
              <textarea
                v-model="content"
                rows="12"
                placeholder="내용을 입력해 주세요."
                class="w-full rounded-xl border border-slate-200 p-3 focus:outline-none focus:ring-2 focus:ring-slate-600/30 whitespace-pre-wrap break-words resize-none"></textarea>
            </div>
          </div>

          <!-- 푸터 -->
          <div class="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
            <button class="h-10 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700" type="button">
              미리보기
            </button>
            <div class="flex items-center gap-2">
              <button class="h-10 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700" @click="close" type="button">
                취소
              </button>
              <button class="h-10 px-5 rounded-xl bg-slate-600 text-white disabled:opacity-40"
                      :disabled="!canSubmit" @click="submit" type="button">
                {{ isEdit ? '저장' : '완료' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.fade-enter-active,.fade-leave-active{ transition: opacity .15s; }
.fade-enter-from,.fade-leave-to{ opacity: 0; }
</style>
