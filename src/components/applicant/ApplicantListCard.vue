<script setup lang="ts">
import { Briefcase, Calendar, Award, GraduationCap } from 'lucide-vue-next';

interface Applicant { 
    id: number;
    name: string;
    email: string;
    appliedAt: string;
    status: string;
    statusColor: string;
    education: string;
    certificates: number;
    careerType: string;
    skills: string[];
}

interface Props {
    applicant: Applicant;
}

defineProps<Props>();
defineEmits(['click', 'viewDetail']);
</script>

<template>
    <div @click="$emit('click')"
        class="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-all cursor-pointer bg-white">
        <div class="flex items-start justify-between mb-4">
            <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                    <span class="text-lg font-semibold text-slate-600">{{ applicant.name[0] }}</span>
                </div>
                <div>
                    <h3 class="text-lg font-semibold text-slate-700">{{ applicant.name }}</h3>
                    <p class="text-sm text-gray-500">{{ applicant.email }}</p>
                </div>
            </div>
            <span :class="[
                'px-3 py-1 rounded-full text-xs font-medium',
                applicant.statusColor === 'blue' ? 'bg-blue-50 text-blue-600' :
                    applicant.statusColor === 'green' ? 'bg-green-50 text-green-600' :
                        applicant.statusColor === 'yellow' ? 'bg-yellow-50 text-yellow-600' :
                            applicant.statusColor === 'purple' ? 'bg-purple-50 text-purple-600' :
                                'bg-gray-50 text-gray-600'
            ]">
                {{ applicant.status }}
            </span>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div class="flex items-center gap-2">
                <Briefcase :size="16" class="text-gray-400" />
                <span class="text-sm text-gray-600">{{ applicant.careerType }}</span>
            </div>
            <div class="flex items-center gap-2">
                <GraduationCap :size="16" class="text-gray-400" />
                <span class="text-sm text-gray-600">{{ applicant.education }}</span>
            </div>
            <div class="flex items-center gap-2">
                <Award :size="16" class="text-gray-400" />
                <span class="text-sm text-gray-600">자격증 {{ applicant.certificates }}개</span>
            </div>
            <div class="flex items-center gap-2">
                <Calendar :size="16" class="text-gray-400" />
                <span class="text-sm text-gray-600">{{ applicant.appliedAt }}</span>
            </div>
        </div>

        <div class="flex flex-wrap gap-2">
            <span v-for="skill in applicant.skills.slice(0, 5)" :key="skill"
                class="px-2 py-1 bg-slate-50 text-slate-600 rounded text-xs">
                {{ skill }}
            </span>
            <span v-if="applicant.skills.length > 5" class="px-2 py-1 text-slate-500 rounded text-xs">
                +{{ applicant.skills.length - 5 }}
            </span>
        </div>
    </div>
</template>
