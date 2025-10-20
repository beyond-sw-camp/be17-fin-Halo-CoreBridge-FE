<template>
  <div class="relative" ref="dropdownRef">
    <!-- Profile Button -->
    <button @click="toggleDropdown"
      class="w-10 h-10 bg-slate-600 rounded-full flex items-center justify-center text-white font-semibold hover:bg-slate-800 transition focus:outline-none focus:ring-3 focus:ring-slate-500 focus:ring-offset-2"
      :aria-expanded="isOpen" aria-haspopup="true">
      {{ userInitial }}
    </button>

    <!-- Dropdown Menu -->
    <Transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100" leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
      <div v-if="isOpen"
        class="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50">
        <!-- User Info Section -->
        <div class="p-4 border-b border-gray-200">
          <div class="flex items-center space-x-3">
            <div
              class="w-12 h-12 bg-slate-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
              {{ userInitial }}
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center space-x-2">
                <span class="font-semibold text-gray-900 truncate">{{ userName }}</span>
                <span v-if="userRole"
                  class="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded whitespace-nowrap">
                  {{ userRole }}
                </span>
              </div>
              <p class="text-sm text-gray-600 truncate">{{ userEmail }}</p>
            </div>
          </div>
        </div>

        <!-- Menu Items -->
        <div class="py-2">
          <DropdownMenuItem v-for="item in menuItems" :key="item.id" :icon="item.icon" :label="item.label"
            @click="handleMenuClick(item.id)" />
        </div>

        <!-- Divider -->
        <div class="border-t border-gray-200"></div>

        <!-- Bottom Section -->
        <div class="py-2">
          <DropdownMenuItem icon="logout" label="로그아웃" variant="danger" @click="handleLogout" />
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import DropdownMenuItem from '@/components/RecruiterDashboard/DropdownMenuItem.vue';

interface MenuItem {
  id: string;
  icon: string;
  label: string;
}

interface Props {
  userName?: string;
  userEmail?: string;
  userRole?: string;
}

const props = withDefaults(defineProps<Props>(), {
  userName: '이상우',
  userEmail: 'com.corebridge@gmail.com',
  userRole: '관리자'
});

const emit = defineEmits<{
  menuClick: [menuId: string];
  logout: [];
  mobileAppClick: [];
}>();

// State
const isOpen = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);

// Computed
const userInitial = ref(props.userName.charAt(0));

// Menu items
const menuItems: MenuItem[] = [
  { id: 'account', icon: 'user', label: '계정 설정' },
  { id: 'security', icon: 'lock', label: '보안 설정' },
  { id: 'notification', icon: 'bell', label: '알림 설정' },
];

// Methods
const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const closeDropdown = () => {
  isOpen.value = false;
};

const handleMenuClick = (menuId: string) => {
  emit('menuClick', menuId);
  closeDropdown();
};

const handleLogout = () => {
  emit('logout');
  closeDropdown();
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
