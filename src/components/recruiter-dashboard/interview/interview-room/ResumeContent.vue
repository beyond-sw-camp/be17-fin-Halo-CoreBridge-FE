<template>
  <div>
    <!-- 지원자 정보 -->
    <div class="mb-8 pb-6 border-b border-slate-200">
      <div class="flex items-start gap-6">
        <div
          class="w-24 h-24 rounded-full bg-slate-200 flex items-center justify-center text-3xl font-bold text-slate-600"
        >
          {{ getInitial(candidate.name) }}
        </div>
        <div class="flex-1">
          <h2 class="text-2xl font-bold text-slate-800 mb-2">
            {{ candidate.name }}
          </h2>
          <div class="space-y-2">
            <div class="flex items-center gap-2 text-slate-600">
              <Mail class="w-4 h-4" />
              <span>{{ candidate.email }}</span>
            </div>
            <div class="flex items-center gap-2 text-slate-600">
              <Phone class="w-4 h-4" />
              <span>{{ candidate.phone }}</span>
            </div>
            <div v-if="candidate.github" class="flex items-center gap-2 text-slate-600">
              <Github class="w-4 h-4" />
              <span>{{ candidate.github }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 경력 -->
    <section class="mb-8">
      <h3 class="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <Briefcase class="w-5 h-5" />
        경력
      </h3>
      <div class="space-y-4">
        <div
          v-for="(exp, index) in candidate.experiences"
          :key="index"
          class="pl-6 border-l-2 border-slate-300"
        >
          <div class="flex items-start justify-between mb-2">
            <h4 class="font-semibold text-slate-800">{{ exp.company }}</h4>
            <span class="text-sm text-slate-600">
              {{ formatPeriod(exp.startDate, exp.endDate) }}
            </span>
          </div>
          <p class="text-slate-600 mb-2">{{ exp.position }}</p>
          <ul class="list-disc list-inside text-sm text-slate-600 space-y-1">
            <li v-for="(desc, idx) in exp.description" :key="idx">{{ desc }}</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- 기술 스택 -->
    <section class="mb-8">
      <h3 class="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <Code class="w-5 h-5" />
        기술 스택
      </h3>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="skill in candidate.skills"
          :key="skill"
          class="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm"
        >
          {{ skill }}
        </span>
      </div>
    </section>

    <!-- 프로젝트 -->
    <section class="mb-8">
      <h3 class="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <Folder class="w-5 h-5" />
        프로젝트
      </h3>
      <div class="space-y-4">
        <div
          v-for="(project, index) in candidate.projects"
          :key="index"
          class="p-4 bg-slate-50 rounded-lg"
        >
          <h4 class="font-semibold text-slate-800 mb-2">{{ project.title }}</h4>
          <p class="text-sm text-slate-600 mb-2">{{ project.period }}</p>
          <p class="text-sm text-slate-700">{{ project.description }}</p>
        </div>
      </div>
    </section>

    <!-- 학력 -->
    <section>
      <h3 class="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <GraduationCap class="w-5 h-5" />
        학력
      </h3>
      <div
        v-for="(edu, index) in candidate.education"
        :key="index"
        class="pl-6 border-l-2 border-slate-300"
      >
        <div class="flex items-start justify-between mb-2">
          <h4 class="font-semibold text-slate-800">{{ edu.school }}</h4>
          <span class="text-sm text-slate-600">
            {{ formatPeriod(edu.startDate, edu.endDate) }}
          </span>
        </div>
        <p class="text-slate-600">{{ edu.major }}</p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import {
  Mail,
  Phone,
  Github,
  Briefcase,
  Code,
  Folder,
  GraduationCap,
} from 'lucide-vue-next';

interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  github?: string;
  experiences: Experience[];
  skills: string[];
  projects: Project[];
  education: Education[];
}

interface Experience {
  company: string;
  position: string;
  startDate: string;
  endDate: string | null;
  description: string[];
}

interface Project {
  title: string;
  period: string;
  description: string;
}

interface Education {
  school: string;
  major: string;
  startDate: string;
  endDate: string;
}

defineProps<{
  candidate: Candidate;
}>();

const getInitial = (name: string) => {
  return name.charAt(0);
};

const formatPeriod = (startDate: string, endDate: string | null) => {
  const formatDate = (date: string) => {
    const [year, month] = date.split('-');
    return `${year}.${month}`;
  };

  const start = formatDate(startDate);
  const end = endDate ? formatDate(endDate) : '현재';

  return `${start} - ${end}`;
};
</script>
