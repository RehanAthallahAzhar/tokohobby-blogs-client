<template>
  <div v-if="blog" class="container mx-auto px-4 md:px-8 py-8 animate-fade-in max-w-5xl">
    <router-link to="/blogs" class="inline-flex items-center text-gray-500 hover:text-primary transition-colors mb-8 font-medium">
      <span class="mr-2">←</span> Back to List
    </router-link>
    
    <article class="bg-white dark:bg-dark-card rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-8 md:p-12">
      <header class="text-center mb-10">
        <h1 class="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">{{ blog.title }}</h1>
        <div class="flex items-center justify-center gap-3 text-gray-500 dark:text-gray-400">
            <div class="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                {{ blog.authorId ? blog.authorId[0].toUpperCase() : 'A' }}
            </div>
            <span>Published on <strong class="text-gray-900 dark:text-gray-200">{{ new Date(blog.publishedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) }}</strong></span>
        </div>
      </header>

      <!-- Media Section -->
      <div v-if="hasMedia(blog)" class="mb-10 rounded-2xl overflow-hidden shadow-lg bg-black">
        <div v-if="blog.youtubeLink && getYoutubeEmbed(blog.youtubeLink)" class="relative w-full pt-[56.25%]">
             <iframe 
                class="absolute inset-0 w-full h-full"
                :src="getYoutubeEmbed(blog.youtubeLink)" 
                title="YouTube video player" 
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen>
             </iframe>
        </div>
        <img v-else-if="blog.imagePath" :src="blog.imagePath" class="w-full h-auto max-h-[600px] object-cover" alt="Article Cover">
      </div>
      
      <div class="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
          {{ blog.content }}
      </div>
    </article>
  </div>
  
  <div v-else class="flex flex-col items-center justify-center min-h-[50vh]">
    <div class="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
    <p class="text-gray-500 font-medium">Loading post details...</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const blog = ref(null)
const API_URL = 'http://localhost:8084'

const hasMedia = (b) => !!(b.youtubeLink || b.imagePath)

const getYoutubeEmbed = (url) => {
    if(!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
        return `https://www.youtube.com/embed/${match[2]}`;
    }
    return null;
}

onMounted(async () => {
  try {
    const res = await axios.get(`${API_URL}/blogs/${route.params.slug}`)
    blog.value = res.data
  } catch (err) {
    alert("Blog not found")
  }
})
</script>
