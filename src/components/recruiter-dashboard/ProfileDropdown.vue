<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue"
import { useRouter } from "vue-router"
import DropdownMenuItem from "@/components/recruiter-dashboard/DropdownMenuItem.vue"
import userAPI from "@/api/user"
import { useUserStore } from "@/store/useUserStore.ts"




const userStore = useUserStore()
const router = useRouter()

interface MenuItem {
  id: string
  icon: string
  label: string
}

// State
const isOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

// User Initial
const userInitial = ref(userStore.userInfo.name.charAt(0))

// Menu items (⭐ 마이페이지 추가)
const menuItems: MenuItem[] = [
  { id: "account", icon: "user", label: "계정 설정" },
  // { id: 'security', icon: 'lock', label: '보안 설정' },
  // { id: 'notification', icon: 'bell', label: '알림 설정' },
]

// Methods
const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const closeDropdown = () => {
  isOpen.value = false
}

const handleMenuClick = (menuId: string) => {
  switch (menuId) {
    case "mypage":
      router.push("/jobs/mypage")
      break
    case "account":
      // router.push("/account")
      break
  }
  closeDropdown()
}

const handleLogout = async () => {
  closeDropdown()

  const response = await userAPI.requestLogout()
  if (response.success) {
    userStore.logout()
  }
}

// Click outside to close
const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    closeDropdown()
  }
}

onMounted(() => {
  document.addEventListener("click", handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside)
})

onMounted(() => {
  console.log("role:", userStore.userInfo.role)
})
</script>

<template>
  <div class="relative" ref="dropdownRef">
    <!-- Profile Button -->
    <button @click="toggleDropdown"
      class="hover:cursor-pointer w-10 h-10 bg-slate-600 rounded-full flex items-center justify-center text-white font-semibold hover:bg-slate-800 transition focus:outline-none focus:ring-3 focus:ring-slate-500 focus:ring-offset-2"
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
                <span class="font-semibold text-gray-900 truncate">
                  {{ userStore.userInfo.name }}
                </span>
                <span class="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded whitespace-nowrap">
                  {{ userStore.userInfo.role }}
                </span>
              </div>
              <p class="text-sm text-gray-600 truncate">
                {{ userStore.userInfo.email }}
              </p>
            </div>
          </div>
        </div>

        <!-- Menu Items -->
        <div class="py-2">
          <DropdownMenuItem v-for="item in menuItems" :key="item.id" :icon="item.icon" :label="item.label"
            @click="handleMenuClick(item.id)" />

          <!-- 지원자만 보이는 ‘지원현황’ -->
          <DropdownMenuItem v-if="userStore.isApplicant()" icon="bell" label="지원현황"
            @click="handleMenuClick('mypage')" />
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
