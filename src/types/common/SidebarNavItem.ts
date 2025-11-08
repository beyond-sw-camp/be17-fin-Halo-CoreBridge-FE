import type { Component } from 'vue'

export interface SidebarNavItem {
  path: string
  label: string
  icon: Component
  role: string[]
}
