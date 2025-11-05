<script setup lang="ts">
import JobForm from './JobForm.vue'
import { useRouter } from 'vue-router'
const router = useRouter()

const onCompleted = () => {
  router.push('/recruiter/jobs')
}
</script>

<template>
  <JobForm mode="create" @completed="onCompleted" />
</template>
