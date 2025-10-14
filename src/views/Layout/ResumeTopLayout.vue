<script setup lang="ts">
import { ref, provide } from 'vue';

interface Tab {
  id: number;
  name: string;
}

const tabs: Tab[] = [
  { id: 0, name: '기본내용' },
  { id: 1, name: '상세경력/자격' },
  { id: 2, name: '교육' },
  { id: 3, name: '자기소개' },
  { id: 4, name: '파일첨부' }
];

const currentTab = ref(0);

const goToTab = (tabId: number) => {
  currentTab.value = tabId;
};

// 자식 컴포넌트에서 사용할 수 있도록 provide
provide('currentTab', currentTab);
provide('goToTab', goToTab);
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="max-w-6xl mx-auto pt-6 px-6 mb-8">
      <h1 class="text-3xl font-bold text-slate-600 mb-2">입사 지원서 작성</h1>
      <p class="text-gray-600">모든 항목을 정확하게 입력해주세요</p>
    </div>

    <!-- Notice Box -->
    <div class="max-w-6xl mx-auto px-6 mb-6">
      <div class="bg-red-50 border border-red-200 rounded-lg p-4">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <div class="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
              !
            </div>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-semibold text-red-800 mb-1">허위사실 기재에 주의하세요</h3>
            <ul class="text-sm text-red-700 space-y-1">
              <li>• 적발시 고용관계 취소 및 법적 제제의 무제가 발생 할 수 있습니다.</li>
              <li>• 사실만을 적시해주실 것을 당부 드립니다.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Tab Navigation -->
    <div class="max-w-6xl mx-auto px-6 mb-6">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="flex">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="goToTab(tab.id)"
            :class="[
                            'flex-1 py-3 px-4 text-sm font-medium transition-colors',
                            currentTab === tab.id
                                ? 'bg-slate-600 text-white'
                                : 'text-gray-600 hover:bg-gray-50'
                        ]"
          >
            {{ tab.name }}
          </button>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-6xl mx-auto px-6 pb-8">
      <router-view></router-view>
    </div>
  </div>
</template>

<style scoped>
</style>
