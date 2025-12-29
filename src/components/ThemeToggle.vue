<template>
  <button
    @click="$emit('toggle')"
    class="relative inline-flex h-8 w-16 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
    :class="isDark ? 'bg-primary' : 'bg-gray-200'"
    aria-label="Toggle theme"
    role="switch"
    :aria-checked="isDark"
  >
    <!-- Sliding circle -->
    <span
      class="inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform duration-300 ease-in-out"
      :class="isDark ? 'translate-x-9' : 'translate-x-1'"
    />
    
    <!-- Sun icon (light mode) -->
    <svg
      class="absolute left-2 h-4 w-4 transition-opacity duration-300 text-amber-500"
      :class="isDark ? 'opacity-0' : 'opacity-100'"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>
    
    <!-- Moon icon (dark mode) -->
    <svg
      class="absolute right-2 h-4 w-4 transition-opacity duration-300 text-white"
      :class="isDark ? 'opacity-100' : 'opacity-0'"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
      />
    </svg>
  </button>
</template>

<script setup>
defineProps({
  isDark: Boolean
})

defineEmits(['toggle'])
</script>
