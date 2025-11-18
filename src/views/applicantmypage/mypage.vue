<script setup lang="ts">
import { ref, onMounted } from "vue"
import { getMyPage } from "@/api/applicant"
import type { MyPageResponse, AppliedJobResponse } from "@/types/applicant/mypageTypes"
import { useRouter } from "vue-router"

const router = useRouter()

const profile = ref({
    name: "",
    email: "",
})

const appliedList = ref<AppliedJobResponse[]>([])
const isLoading = ref(true)

const progressWidth = (job: AppliedJobResponse) => {
    const total = job.process.length
    const currentIndex = job.process.indexOf(job.currentStage) + 1
    return (currentIndex / total) * 100
}

onMounted(async () => {
    try {
        const res = await getMyPage()
        const data = res.results

        profile.value = {
            name: data.profile.name,
            email: data.profile.email,
        }

        appliedList.value = data.applications
    } catch (e) {
        console.error("마이페이지 로딩 실패:", e)
    } finally {
        isLoading.value = false
    }
})

const goBack = () => {
    router.push("/jobs")
}
</script>

<template>
    <div class="min-h-screen bg-gray-100">
        <div class="max-w-5xl mx-auto px-6 pt-16 pb-24">

            <!-- Profile -->
            <div class="bg-white rounded-2xl shadow-md border border-gray-100 p-8 mb-10">
                <div class="flex items-center justify-between">

                    <!-- 좌측 -->
                    <div class="flex items-center gap-6">
                        <div
                            class="w-20 h-20 rounded-2xl bg-gray-200 flex items-center justify-center text-3xl font-light text-gray-600">
                            {{ profile.name[0] }}
                        </div>

                        <div>
                            <h1 class="text-2xl font-semibold text-gray-900">
                                {{ profile.name }}
                            </h1>
                            <p class="text-gray-500 mt-1">
                                {{ profile.email }}
                            </p>

                            <div class="flex items-center gap-3 mt-3 text-sm text-gray-600">
                                <span>{{ appliedList.length }}건 지원 중</span>
                            </div>
                        </div>
                    </div>

                    <!-- 우측 버튼 -->
                    <div class="flex items-center gap-2">
                        <button
                            class="px-4 py-2 border border-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50 transition">
                            프로필 편집
                        </button>

                        <button @click="goBack"
                            class="px-4 py-2 border border-gray-300 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition">
                            나가기
                        </button>
                    </div>
                </div>
            </div>

            <!-- 지원현황 -->
            <div class="space-y-6">
                <h2 class="text-xl font-semibold text-gray-900">
                    지원 현황
                </h2>

                <!-- 지원한 공고 없음 -->
                <div v-if="!appliedList.length && !isLoading"
                    class="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
                    <div class="text-6xl mb-4">📪</div>
                    <p class="text-gray-500">아직 지원한 공고가 없습니다</p>
                </div>

                <!-- 로딩 -->
                <div v-if="isLoading" class="text-center py-12 text-gray-500">
                    로딩 중...
                </div>

                <!-- 지원 리스트 -->
                <div
                    v-for="job in appliedList"
                    :key="job.jobPostingId"
                    class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:border-gray-300 transition">

                    <div class="flex justify-between items-start mb-5">
                        <div>
                            <h3 class="font-semibold text-gray-900">
                                {{ job.jobTitle }}
                            </h3>
                            <p class="text-sm text-gray-600 mt-1">
                                {{ job.departmentName }}
                            </p>
                        </div>

                        <span class="text-xs px-3 py-1 bg-gray-100 text-gray-600 rounded-full">
                            {{ job.appliedDate }}
                        </span>
                    </div>

                    <!-- Progress -->
                    <div class="mt-6">
                        <div class="flex items-center justify-between mb-3">
                            <span class="text-sm text-gray-600">진행 단계</span>
                            <span class="text-sm font-medium text-gray-900">
                                {{ job.currentStage }}
                            </span>
                        </div>

                        <div class="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                class="absolute left-0 top-0 h-full bg-gray-900 transition-all duration-700"
                                :style="{ width: progressWidth(job) + '%' }">
                            </div>
                        </div>

                        <div class="flex justify-between mt-3 text-xs text-gray-500">
                            <span v-for="(step, i) in job.process" :key="i">
                                {{ step }}
                            </span>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    </div>
</template>
