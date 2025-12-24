<template>
  <nav class="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/90 dark:bg-dark-bg/90 backdrop-blur-md transition-colors duration-300">
    <div class="w-full px-6 md:px-12 h-16 flex justify-between items-center">
      <!-- Logo -->
      <router-link to="/blogs" class="text-2xl font-serif font-bold text-gray-900 dark:text-white tracking-tight hover:opacity-80 transition-opacity">
        Toko<span class="text-primary">hobby</span> Blog
      </router-link>
      
      <!-- Actions -->
      <div class="flex items-center gap-4">
        <!-- Fun Write Button -->
        <router-link 
          to="/admin/blogs" 
          class="group relative px-6 py-2 rounded-full bg-gradient-to-r from-primary to-blue-400 text-white font-bold shadow-lg hover:shadow-primary/50 transition-all duration-300 hover:-translate-y-1 active:scale-95 flex items-center gap-2 overflow-hidden"
        >
          <span class="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
          <svg class="w-5 h-5 group-hover:animate-bounce-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
          <span class="relative">Write</span>
        </router-link>
        
        <!-- Fun Theme Toggle -->
        <button 
          @click="$emit('toggle-theme')" 
          class="relative p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-primary hover:text-white transition-all duration-300 hover:rotate-12 active:scale-90 shadow-sm"
          aria-label="Toggle Dark Mode"
        >
          <svg v-if="isDark" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
          <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
        </button>

        <!-- Profile Dropdown -->
        <div class="relative" ref="menuRef">
            <button @click="toggleMenu" class="w-10 h-10 rounded-full bg-primary text-white font-bold flex items-center justify-center border-2 border-transparent hover:border-white shadow-md transition-all active:scale-95">
                A
            </button>
            
            <transition 
              enter-active-class="transition duration-200 ease-out"
              enter-from-class="translate-y-2 opacity-0"
              enter-to-class="translate-y-0 opacity-100"
              leave-active-class="transition duration-150 ease-in"
              leave-from-class="translate-y-0 opacity-100"
              leave-to-class="translate-y-2 opacity-0"
            >
              <div v-if="isOpen" class="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-card rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 py-2 z-50 overflow-hidden">
                  <router-link to="/admin/blogs?view=published" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors" @click="closeMenu">My Blogs</router-link>
                  <router-link to="/admin/blogs" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors" @click="closeMenu">Drafts</router-link>
                  <a href="#" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors" @click.prevent="closeMenu">Settings</a>
                  <div class="my-1 border-t border-gray-200 dark:border-gray-700"></div>
                  <a href="#" class="block px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors" @click.prevent="logout">Log out</a>
              </div>
            </transition>
        </div>

      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

defineProps({
  isDark: Boolean
})

const isOpen = ref(false)
const menuRef = ref(null)

const emit = defineEmits(['toggle-theme'])

const toggleMenu = () => {
    isOpen.value = !isOpen.value
}

const closeMenu = () => {
    isOpen.value = false
}

const logout = () => {
    localStorage.removeItem('theme')
    closeMenu()
    window.location.reload()
}

const handleClickOutside = (event) => {
    if (menuRef.value && !menuRef.value.contains(event.target)) {
        isOpen.value = false
    }
}

onMounted(() => {
    document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
})
</script>
