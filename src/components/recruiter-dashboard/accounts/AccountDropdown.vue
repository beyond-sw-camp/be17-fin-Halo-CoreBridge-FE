<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import DropdownMenuItem from '@/components/recruiter-dashboard/DropdownMenuItem.vue';
import { EllipsisVertical } from 'lucide-vue-next'

interface MenuItem {
    id: string;
    icon: string;
    label: string;
}

const emit = defineEmits<{
    deleteMenuClick: [];
}>();

// State
const isOpen = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);

// Menu items
const menuItems: MenuItem[] = [
    { id: 'delete', icon: 'trash2', label: '삭제' },
];

// Methods
const toggleDropdown = () => {
    isOpen.value = !isOpen.value;
};

const closeDropdown = () => {
    isOpen.value = false;
};

const handleMenuClick = (menuId: string) => {
    closeDropdown();

    if (menuId === 'delete') {
        emit('deleteMenuClick');
    }
};

// Click outside handler
const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
        closeDropdown();
    }
};

// Lifecycle hooks
onMounted(() => {
    document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside);
});
</script>
<template>
    <div class="relative" ref="dropdownRef">
        <!-- Profile Button -->
        <button @click="toggleDropdown" class="p-2 hover:bg-slate-100 hover:cursor-pointer rounded-xl transition-all"
            :aria-expanded="isOpen" aria-haspopup="true">
            <EllipsisVertical :size="20" />
        </button>

        <!-- Dropdown Menu -->
        <Transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100" leave-active-class="transition ease-in duration-150"
            leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
            <div v-if="isOpen"
                class="absolute right-0 mt-2  bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50">

                <!-- Menu Items -->
                <div class="py-2">
                    <DropdownMenuItem v-for="item in menuItems" :key="item.id" :icon="item.icon" :label="item.label"
                        @click="handleMenuClick(item.id)" />
                </div>

            </div>
        </Transition>
    </div>
</template>
