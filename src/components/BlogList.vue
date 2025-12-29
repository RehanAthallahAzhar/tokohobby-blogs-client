<template>
  <div class="container mx-auto px-4 md:px-8 pb-20 max-w-7xl">
    <!-- Slogan Section -->
    <div v-show="!loading && !showLoader" class="text-center px-12 py-12 animate-fade-in">
        <h1 class="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500 mb-4 tracking-tight">
            Discover your passion.
        </h1>
        <p class="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Explore the latest updates, guides, and stories from the Tokohobby community.
        </p>
    </div>

    <div class="animate-fade-in">
        <!-- Header & Search -->
        <div v-if="!loading && !showLoader" class="flex flex-col md:flex-row items-center gap-6 mb-8 mt-4 px-4">
            <h2 class="text-3xl font-bold text-gray-800 dark:text-white whitespace-nowrap">Latest Posts</h2>
            
            <div class="relative w-full max-w-md group">
                <input 
                    v-model="keywordInput" 
                    placeholder="Search resources..." 
                    @input="debouncedSearch" 
                    class="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-card text-gray-800 dark:text-gray-200 focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all shadow-sm group-hover:shadow-md"
                >
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl group-focus-within:text-primary transition-colors">🔍</span>
            </div>
        </div>

        <!-- Category Pills -->
        <div v-if="!loading && !showLoader && categories.length > 0" class="flex flex-wrap gap-2.5 mb-12 px-4 animate-fade-in delay-200">
            <button 
                @click="filterByCategory(null)"
                :class="['px-5 py-2 rounded-full text-xs font-bold transition-all border uppercase tracking-wider', !selectedCategory ? 'bg-primary border-primary text-white shadow-lg' : 'bg-white dark:bg-dark-card border-gray-100 dark:border-gray-800 text-gray-500 hover:border-primary/50']"
            >
                All Feed
            </button>
            <button 
                v-for="cat in categories" 
                :key="cat.id" 
                @click="filterByCategory(cat.id)"
                :class="['px-5 py-2 rounded-full text-xs font-bold transition-all border uppercase tracking-wider', selectedCategory === cat.id ? 'bg-primary border-primary text-white shadow-lg' : 'bg-white dark:bg-dark-card border-gray-100 dark:border-gray-800 text-gray-500 hover:border-primary/50']"
            >
                {{ cat.name }}
            </button>
        </div>
    
        <!-- Custom Loading Screen (Fixed Overlay) -->
        <div v-if="loading || showLoader" class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-dark-bg/95 backdrop-blur-sm">
            <div class="flex gap-4 text-5xl mb-6 animate-bounce">
                <span>📷</span><span>🎮</span><span>🍳</span><span>✈️</span>
            </div>
            <p class="text-primary font-bold animate-pulse text-xl">Curating your feed...</p>
        </div>
        
        <div v-else>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                <router-link 
                v-for="blog in blogs" 
                :key="blog.id" 
                :to="'/blogs/' + blog.slug" 
                class="group flex flex-col bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-800 rounded-3xl overflow-hidden hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/50 transition-all duration-300 h-full"
                >
                <!-- Media Section -->
                <div class="relative w-full pt-[56.25%] bg-gray-100 dark:bg-gray-800 overflow-hidden">
                    <div v-if="blog.categoryName" class="absolute top-3 left-3 z-10">
                        <span class="px-2 py-1 bg-white/90 backdrop-blur-sm dark:bg-dark-card/90 text-primary text-[10px] font-bold rounded-lg shadow-sm uppercase tracking-wider">
                            {{ blog.categoryName }}
                        </span>
                    </div>
                    <img v-if="getMediaUrl(blog)" :src="getMediaUrl(blog)" loading="lazy" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Cover">
                    <div v-else class="absolute inset-0 flex items-center justify-center text-4xl group-hover:scale-110 transition-transform duration-500" :style="{ background: getRandomGradient(blog.id) }">
                        ☕
                    </div>
                    
                    <div v-if="blog.youtubeLink" class="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm text-white p-1.5 rounded-lg">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
                    </div>
                </div>

                <!-- Content Section -->
                <div class="p-5 flex flex-col flex-grow">
                    <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                        {{ blog.title }}
                    </h2>

                    <!-- Tags -->
                    <div v-if="blog.tags && blog.tags.length > 0" class="flex flex-wrap gap-1.5 mb-4">
                        <span v-for="tag in blog.tags" :key="tag" class="text-[10px] text-gray-400 bg-gray-50 dark:bg-gray-800 px-2 py-0.5 rounded-md border border-gray-100 dark:border-gray-800 italic">
                            #{{ tag }}
                        </span>
                    </div>
                    
                    <div class="mt-auto flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                        <div class="flex items-center gap-2">
                            <div class="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-blue-500 text-white text-xs font-bold flex items-center justify-center">
                                {{ blog.authorId ? blog.authorId[0].toUpperCase() : 'A' }}
                            </div>
                            <span class="text-xs font-semibold text-gray-500 dark:text-gray-400 capitalize">{{ blog.authorId || 'Author' }}</span>
                        </div>
                        <span class="text-xs font-medium text-gray-400">{{ formatDate(blog.publishedAt) }}</span>
                    </div>
                </div>
                </router-link>
            </div>

            <div class="flex justify-center items-center mt-16 gap-6">
                <button 
                    :disabled="page === 0" 
                    @click="changePage(-1)" 
                    class="w-12 h-12 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-xl hover:bg-primary hover:text-white hover:scale-110 disabled:opacity-30 disabled:hover:scale-100 transition-all duration-300 bg-white dark:bg-dark-card"
                >
                    ←
                </button>
                <span class="font-bold text-gray-400">Page {{ page + 1 }}</span>
                <button 
                    :disabled="lastPage" 
                    @click="changePage(1)" 
                    class="w-12 h-12 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-xl hover:bg-primary hover:text-white hover:scale-110 disabled:opacity-30 disabled:hover:scale-100 transition-all duration-300 bg-white dark:bg-dark-card"
                >
                    →
                </button>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const blogs = ref([])
const categories = ref([])
const selectedCategory = ref(null)
const page = ref(0)
const lastPage = ref(false)
const keyword = ref('') // Actual keyword used for fetch
const keywordInput = ref('') // Input value
const loading = ref(false)
const showLoader = ref(true) // Start with loader

const API_URL = 'http://localhost:8084'

// Custom Debounce function since we might not have lodash installed
const debounce = (fn, delay) => {
    let timeoutId
    return (...args) => {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => fn.apply(this, args), delay)
    }
}

const fetchBlogs = async () => {
  loading.value = true
  try {
    let url = `${API_URL}/blogs?page=${page.value}&size=12&keyword=${keyword.value}`
    if (selectedCategory.value) {
        url += `&categoryId=${selectedCategory.value}`
    }
    const res = await axios.get(url)
    blogs.value = res.data.content
    lastPage.value = res.data.last
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

const fetchCategories = async () => {
    try {
        const res = await axios.get(`${API_URL}/categories`)
        categories.value = res.data
    } catch (err) {
        console.error("Failed to fetch categories")
    }
}

const filterByCategory = (id) => {
    selectedCategory.value = id
    page.value = 0
    fetchBlogs()
}

// Debounced search handler
const debouncedSearch = debounce(() => {
    keyword.value = keywordInput.value
    page.value = 0 // Reset to first page
    fetchBlogs()
}, 500) // 500ms delay

const changePage = (delta) => {
  page.value += delta
  fetchBlogs()
}

const getMediaUrl = (blog) => {
    if (blog.youtubeLink) {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = blog.youtubeLink.match(regExp);
        if (match && match[2].length === 11) {
            return `https://img.youtube.com/vi/${match[2]}/mqdefault.jpg`;
        }
    }
    if (blog.imagePath) {
        return blog.imagePath;
    }
    return null;
}

const getRandomGradient = (id) => {
    const gradients = [
        'linear-gradient(135deg, #FF9A9E 0%, #FECFEF 100%)',
        'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
        'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
        'linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)'
    ]
    return gradients[id % gradients.length]
}

const formatDate = (dateStr) => {
    if(!dateStr) return ''
    const date = new Date(dateStr)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if(diffDays < 7) {
        return diffDays === 1 ? 'Yesterday' : `${diffDays} days ago`
    }
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

onMounted(() => {
    // Initial artificial loading for "Fun" experience
    setTimeout(() => {
        showLoader.value = false
        fetchBlogs()
        fetchCategories()
    }, 1000)
})
</script>
