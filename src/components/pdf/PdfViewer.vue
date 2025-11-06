<template>
  <div class="pdf-viewer">
    <!-- 로딩 상태 -->
    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
      <p>PDF 로딩중...</p>
    </div>

    <!-- 에러 상태 -->
    <div v-else-if="error" class="error-container">
      <p class="error-message">{{ error }}</p>
      <button @click="retry" class="retry-button">다시 시도</button>
    </div>

    <!-- PDF 뷰어 -->
    <div v-else class="pdf-container">
      <!-- 컨트롤 바 -->
      <div class="controls">
        <button @click="previousPage" :disabled="currentPage <= 1" class="control-button">
          이전
        </button>
        <span class="page-info">
          {{ currentPage }} / {{ totalPages }}
        </span>
        <button @click="nextPage" :disabled="currentPage >= totalPages" class="control-button">
          다음
        </button>
        <button @click="zoomOut" class="control-button">축소</button>
        <span class="zoom-info">{{ Math.round(scale * 100) }}%</span>
        <button @click="zoomIn" class="control-button">확대</button>
        <button @click="downloadPdf" class="download-button">다운로드</button>
      </div>

      <!-- PDF 캔버스 -->
      <div class="canvas-container">
        <canvas ref="pdfCanvas"></canvas>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted, nextTick } from 'vue'
import * as pdfjsLib from 'pdfjs-dist'
import { downloadPdfV2, viewPdfV2 } from '@/api/resume'

// PDF.js Worker 설정
pdfjsLib.GlobalWorkerOptions.workerSrc = '/assets/pdf.worker.mjs'

interface Props {
  resumeId: number
}

const props = defineProps<Props>()

// 상태
const pdfCanvas = ref<HTMLCanvasElement | null>(null)
let pdfDocument: pdfjsLib.PDFDocumentProxy | null = null
const currentPage = ref(1)
const totalPages = ref(0)
const scale = ref(1.5)
const loading = ref(true)
const error = ref<string | null>(null)
const pdfBlobUrl = ref<string | null>(null)

// PDF 로드
const loadPdf = async () => {
  try {
    loading.value = true
    error.value = null

    console.log('🔍 PDF 로드 시작, resumeId:', props.resumeId)

    // 이전 Blob URL만 정리 (PDF 객체는 자동으로 가비지 컬렉션됨)
    if (pdfBlobUrl.value) {
      URL.revokeObjectURL(pdfBlobUrl.value)
      pdfBlobUrl.value = null
    }

    const blob = await viewPdfV2(props.resumeId)

    console.log('✅ Blob 받기 성공:', blob.size, 'bytes, type:', blob.type)

    if (blob.size === 0) {
      throw new Error('받은 PDF 파일이 비어있습니다.')
    }

    const url = URL.createObjectURL(blob)
    pdfBlobUrl.value = url
    console.log('✅ Blob URL 생성:', url)

    const loadingTask = pdfjsLib.getDocument(url)
    console.log('✅ PDF.js 로딩 태스크 생성')

    const pdf = await loadingTask.promise
    console.log('✅ PDF ���드 완료, 페이지 수:', pdf.numPages)

    // 새로운 PDF 객체 저장
    pdfDocument = pdf
    totalPages.value = pdf.numPages
    currentPage.value = 1

    // 먼저 로딩 상태를 false로 변경하여 캔버스가 DOM에 렌더링되도록 함
    loading.value = false

    // DOM이 업데이트될 때까지 대기
    await nextTick()

    // 캔버스가 준비되었는지 확인
    if (!pdfCanvas.value) {
      console.error('❌ 캔버스가 아직 준비되지 않았습니다.')
      error.value = '캔버스를 초기화하는데 실패했습니다.'
      return
    }

    await renderPage(1)
    console.log('✅ PDF 렌더링 완료')
  } catch (err) {
    console.error('❌ PDF 로드 실패:', err)
    if (err instanceof Error) {
      error.value = `PDF 로드 실패: ${err.message}`
    } else {
      error.value = 'PDF를 불러오는데 실패했습니다.'
    }
    loading.value = false
  }
}

// 페이지 렌더링
const renderPage = async (pageNumber: number) => {
  // PDF 문서 유효성 검사
  if (!pdfDocument) {
    console.error('❌ PDF 문서가 없습니다.')
    return
  }

  // 캔버스 유효성 검사
  if (!pdfCanvas.value) {
    console.error('❌ 캔버스가 없습니다.')
    return
  }

  try {
    console.log('🖼️ 페이지 렌더링 시��:', pageNumber)

    // PDF 문서에서 페이지 가져오기
    const page = await pdfDocument.getPage(pageNumber)
    const viewport = page.getViewport({ scale: scale.value })

    const canvas = pdfCanvas.value
    const context = canvas.getContext('2d')
    if (!context) {
      console.error('❌ Canvas context를 가져올 수 없습니다.')
      return
    }

    canvas.height = viewport.height
    canvas.width = viewport.width

    const renderContext = {
      canvasContext: context,
      viewport: viewport,
      canvas: canvas,
    }

    await page.render(renderContext).promise
    currentPage.value = pageNumber
    console.log('✅ 페이지 렌더링 완료:', pageNumber)
  } catch (err) {
    console.error('❌ 페이지 렌더링 실패:', err)
    error.value = '페이지를 렌더링하는데 실패했습니다.'
  }
}

// 페이지 네비게이션
const previousPage = () => {
  if (currentPage.value > 1) {
    renderPage(currentPage.value - 1)
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    renderPage(currentPage.value + 1)
  }
}

// 줌 기능
const zoomIn = () => {
  scale.value = Math.min(scale.value + 0.25, 3)
  renderPage(currentPage.value)
}

const zoomOut = () => {
  scale.value = Math.max(scale.value - 0.25, 0.5)
  renderPage(currentPage.value)
}

// 다시 시도
const retry = () => {
  loadPdf()
}

// PDF 다운로드
const downloadPdf = async () => {
  try {
    const blob = await downloadPdfV2(props.resumeId)
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `resume_${props.resumeId}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (err) {
    console.error('PDF 다운로드 실패:', err)
    alert('PDF 다운로드에 실패했습니다.')
  }
}

// resumeId 변경 감지
watch(() => props.resumeId, () => {
  loadPdf()
})

// 컴포넌트 마운트
onMounted(() => {
  loadPdf()
})

// 컴포넌트 언마운트 시 정리
onUnmounted(() => {
  // Blob URL만 정리 (PDF 객체는 자동으로 가비지 컬렉션됨)
  if (pdfBlobUrl.value) {
    URL.revokeObjectURL(pdfBlobUrl.value)
  }
})
</script>

<style scoped>
.pdf-viewer {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.loading-container,
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
  gap: 16px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.error-message {
  color: #e74c3c;
  font-size: 16px;
}

.retry-button {
  padding: 8px 16px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.retry-button:hover {
  background-color: #2980b9;
}

.pdf-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.controls {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #dee2e6;
}

.control-button,
.download-button {
  padding: 8px 16px;
  background-color: #ffffff;
  color: #495057;
  border: 1px solid #ced4da;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.control-button:hover:not(:disabled),
.download-button:hover {
  background-color: #e9ecef;
}

.control-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.download-button {
  margin-left: auto;
  background-color: #28a745;
  color: white;
  border-color: #28a745;
}

.download-button:hover {
  background-color: #218838;
}

.page-info,
.zoom-info {
  font-size: 14px;
  font-weight: 500;
  color: #495057;
  min-width: 80px;
  text-align: center;
}

.canvas-container {
  overflow: auto;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  background-color: #e9ecef;
  display: flex;
  justify-content: center;
  padding: 20px;
}

canvas {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  background-color: white;
}
</style>
