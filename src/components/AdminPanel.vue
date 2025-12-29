<template>
  <div class="container mx-auto px-4 md:px-8 py-8 animate-fade-in max-w-7xl">
    <div class="flex items-center justify-between mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Manage Your Blogs</h1>
        
        <!-- Tabs -->
        <div class="bg-gray-100 dark:bg-gray-800 p-1 rounded-xl flex gap-1">
            <button 
                @click="activeTab = 'DRAFT'" 
                :class="['px-6 py-2 rounded-lg text-sm font-bold transition-all', activeTab === 'DRAFT' ? 'bg-white dark:bg-dark-card shadow-sm text-primary' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300']">
                Drafts ({{ drafts.length }})
            </button>
            <button 
                @click="activeTab = 'PUBLISHED'" 
                :class="['px-6 py-2 rounded-lg text-sm font-bold transition-all', activeTab === 'PUBLISHED' ? 'bg-white dark:bg-dark-card shadow-sm text-primary' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300']">
                Published ({{ publishedBlogs.length }})
            </button>
        </div>
    </div>
    
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Create/Edit Form (Sticky) -->
        <div class="bg-white dark:bg-dark-card rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-8 h-fit sticky top-24">
            <h3 class="text-xl font-bold mb-6 flex items-center gap-2">
                <span>✍️</span> {{ form.id ? 'Edit Blog' : 'Create New Blog' }}
            </h3>
            <form @submit.prevent="saveBlog" class="space-y-5">
                <div>
                    <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Title</label>
                    <input v-model="form.title" placeholder="Enter a catchy title..." required
                           class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none">
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Category</label>
                        <select v-model="form.categoryId"
                               class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none">
                            <option :value="null">No Category</option>
                            <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Status</label>
                        <select v-model="form.status"
                               class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none">
                            <option value="DRAFT">Draft (Private)</option>
                            <option value="PUBLISHED">Published (Public)</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Tags</label>
                    <div class="flex flex-wrap gap-2 p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                        <label v-for="tag in tags" :key="tag.id" 
                               class="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                            <input type="checkbox" :value="tag.id" v-model="form.tagIds" class="rounded border-gray-300 text-primary focus:ring-primary">
                            <span class="text-xs font-medium">{{ tag.name }}</span>
                        </label>
                        <div v-if="tags.length === 0" class="text-xs text-gray-400 py-1">No tags available.</div>
                    </div>
                </div>
                
                <div>
                    <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">YouTube Link (Optional)</label>
                    <input v-model="form.youtubeLink" placeholder="e.g. https://youtu.be/..." type="url"
                           class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none">
                </div>

                <div>
                    <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Image Path / URL (Optional)</label>
                    <input v-model="form.imagePath" placeholder="e.g. /images/cool-cover.png" type="text"
                           class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none">
                </div>
                
                <div>
                    <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Content</label>
                    <textarea v-model="form.content" rows="8" placeholder="Start writing your story..." required
                              class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none resize-y"></textarea>
                </div>
                
                <div class="flex gap-4">
                    <button type="submit" :disabled="loading"
                            class="flex-1 py-4 rounded-xl bg-primary text-white font-bold text-lg hover:bg-primary-hover hover:shadow-lg hover:-translate-y-1 transition-all disabled:opacity-50 disabled:hover:translate-y-0">
                        {{ loading ? 'Saving...' : (form.id ? 'Update Blog' : 'Create Blog') }}
                    </button>
                    <button v-if="form.id" type="button" @click="resetForm"
                            class="px-6 py-4 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-all">
                        Cancel
                    </button>
                </div>
            </form>
        </div>

        <!-- Lists (Drafts or Published) -->
        <div class="bg-white dark:bg-dark-card rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-8">
            <h3 class="text-xl font-bold mb-6 flex items-center gap-2">
                <span>{{ activeTab === 'DRAFT' ? '📑' : '🚀' }}</span>
                {{ activeTab === 'DRAFT' ? 'Your Drafts' : 'Your Published Blogs' }}
            </h3>
            
            <div v-if="currentList.length === 0" class="text-center py-12 text-gray-400">
                <div class="text-4xl mb-4">📭</div>
                <p>No {{ activeTab.toLowerCase() }} blogs found.</p>
            </div>
            
            <div v-else class="space-y-4">
                <div v-for="blog in currentList" :key="blog.id" 
                     class="group p-4 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-primary/50 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all cursor-pointer relative" 
                     @click="editBlog(blog)">
                    
                    <div class="flex justify-between items-start">
                        <div class="flex-1">
                            <h4 class="font-bold text-lg mb-1 group-hover:text-primary transition-colors line-clamp-1">{{ blog.title }}</h4>
                            <div class="flex items-center gap-3 mb-2">
                                <span v-if="blog.categoryName" class="text-[10px] font-bold px-2 py-0.5 bg-primary/10 text-primary rounded-md uppercase tracking-wider">{{ blog.categoryName }}</span>
                                <span class="text-xs text-gray-400">Update: {{ new Date(blog.updatedAt || Date.now()).toLocaleDateString() }}</span>
                            </div>
                            <div class="flex flex-wrap gap-1">
                                <span v-for="tagName in blog.tags" :key="tagName" class="text-[10px] text-gray-500 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded italic">#{{ tagName }}</span>
                            </div>
                        </div>
                        <span v-if="blog.status === 'PUBLISHED'" class="text-[10px] font-bold px-2 py-1 bg-green-100 text-green-600 rounded-full">LIVE</span>
                        <span v-else class="text-[10px] font-bold px-2 py-1 bg-yellow-100 text-yellow-600 rounded-full">DRAFT</span>
                    </div>

                    
                    <div class="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                        <button class="text-xs px-3 py-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200 z-10" @click.stop="deleteBlog(blog.id)">Delete</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import axios from 'axios'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const form = ref({
    id: null,
    title: '',
    content: '',
    status: 'DRAFT',
    youtubeLink: '',
    imagePath: '',
    categoryId: null,
    tagIds: []
})
const loading = ref(false)
const blogs = ref([])
const categories = ref([])
const tags = ref([])
const activeTab = ref('DRAFT')

const API_URL = 'http://localhost:8084'

const drafts = computed(() => blogs.value.filter(b => b.status === 'DRAFT'))
const publishedBlogs = computed(() => blogs.value.filter(b => b.status === 'PUBLISHED'))
const currentList = computed(() => activeTab.value === 'DRAFT' ? drafts.value : publishedBlogs.value)

const fetchBlogs = async () => {
    try {
        const res = await axios.get(`${API_URL}/blogs/manage`)
        blogs.value = res.data.content
    } catch (err) {
        console.log("Could not fetch blogs")
    }
}

const fetchCategories = async () => {
    try {
        const res = await axios.get(`${API_URL}/admin/categories`)
        categories.value = res.data
    } catch (err) {
        console.log("Could not fetch categories")
    }
}

const fetchTags = async () => {
    try {
        const res = await axios.get(`${API_URL}/admin/tags`)
        tags.value = res.data
    } catch (err) {
        console.log("Could not fetch tags")
    }
}

const saveBlog = async () => {
    loading.value = true
    try {
        if (form.value.id) {
             await axios.put(`${API_URL}/blogs/${form.value.id}`, form.value)
             alert('✨ Blog Updated!')
        } else {
             await axios.post(`${API_URL}/blogs`, form.value)
             alert('✨ Blog Created!')
        }
        resetForm()
        fetchBlogs()
    } catch (err) {
        alert('Error saving blog: ' + err.message)
    } finally {
        loading.value = false
    }
}

const deleteBlog = async (id) => {
    if(!confirm('Are you sure you want to delete this blog?')) return
    try {
        await axios.delete(`${API_URL}/blogs/${id}`)
        fetchBlogs()
    } catch (err) {
        alert('Error deleting: ' + err.message)
    }
}

const editBlog = (blog) => {
    form.value = { 
        ...blog,
        // Match the categoryId and tagIds if they exist in the blog object
        // The blog object from list might not have categoryId/tagIds directly, 
        // but it has categoryName and tags (list of strings).
        // For a full edit, we'd need the IDs.
        // Assuming the blog object from /manage contains categoryId and tagIds
        categoryId: blog.categoryId || null,
        tagIds: blog.tagIds || []
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
}

const resetForm = () => {
    form.value = { 
        id: null, title: '', content: '', status: 'DRAFT', 
        youtubeLink: '', imagePath: '', categoryId: null, tagIds: [] 
    }
}

onMounted(() => {
    if (route.query.view === 'published') {
        activeTab.value = 'PUBLISHED'
    }
    fetchBlogs()
    fetchCategories()
    fetchTags()
})

// Watch query param changes
watch(() => route.query.view, (newView) => {
    if (newView === 'published') {
        activeTab.value = 'PUBLISHED'
    } else {
        activeTab.value = 'DRAFT'
    }
})
</script>
