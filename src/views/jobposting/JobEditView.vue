<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import JobForm from './JobForm.vue'
import { getEditResponse } from '@/api/jobposting/index'

const route = useRoute()
const router = useRouter()
const jobId = Number(route.params.id)
const jobData = ref(null)
const isLoading = ref(true)

onMounted(async () => {
  const res = await getEditResponse(jobId)
  if (res.success) {
    jobData.value = res.results
  } else {
    alert('데이터를 불러오지 못했습니다.')
    router.push('/recruiter/jobs')
  }
  isLoading.value = false
})

const onCompleted = () => {
  router.push('/recruiter/jobs')
}
</script>

<template>
  <div v-if="!isLoading && jobData">
    <JobForm mode="edit" :initialData="jobData" @completed="onCompleted" />
  </div>
</template>
