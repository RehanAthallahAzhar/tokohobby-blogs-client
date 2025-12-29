<template>
  <div v-if="blog" class="container mx-auto px-4 md:px-8 py-8 animate-fade-in max-w-5xl">
    <router-link to="/blogs" class="inline-flex items-center text-gray-500 hover:text-primary transition-colors mb-8 font-medium">
      <span class="mr-2">←</span> Back to List
    </router-link>
    
    <article class="bg-white dark:bg-dark-card rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-8 md:p-12">
      <header class="text-center mb-10">
        <div v-if="blog.categoryName" class="mb-4">
          <span class="px-4 py-1.5 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase tracking-wider">
            {{ blog.categoryName }}
          </span>
        </div>
        <h1 class="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">{{ blog.title }}</h1>
        <div class="flex items-center justify-center gap-3 text-gray-500 dark:text-gray-400">
            <div class="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                {{ blog.authorId ? blog.authorId[0].toUpperCase() : 'A' }}
            </div>
            <div class="flex flex-col items-start text-left">
              <span class="font-bold text-gray-900 dark:text-gray-200">{{ blog.authorId }}</span>
              <span class="text-xs">Published on {{ new Date(blog.publishedAt || blog.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) }}</span>
            </div>
            <div v-if="blog.status === 'DRAFT'" class="ml-2 px-2 py-0.5 bg-yellow-100 text-yellow-700 text-[10px] font-bold rounded uppercase">
              Draft Preview
            </div>
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

      <!-- Tags -->
      <div v-if="blog.tags && blog.tags.length > 0" class="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800 flex flex-wrap gap-2">
        <span v-for="tag in blog.tags" :key="tag" class="px-3 py-1 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-sm rounded-lg">
          #{{ tag }}
        </span>
      </div>
    </article>

    <!-- Comment Section -->
    <section class="mt-12 bg-white dark:bg-dark-card rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-8 md:p-12">
      <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-8">Comments ({{ comments.length }})</h3>
      
      <!-- Comment Form -->
      <div class="mb-10">
        <textarea 
          v-model="newComment"
          class="w-full p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
          rows="3"
          placeholder="Share your thoughts..."
        ></textarea>
        <div class="flex justify-end mt-3">
          <button 
            @click="postComment"
            :disabled="!newComment.trim() || isSubmitting"
            class="px-6 py-2.5 bg-primary hover:bg-primary-hover disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white rounded-xl font-semibold transition-all shadow-md active:scale-95 flex items-center gap-2"
          >
            <span v-if="isSubmitting" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            {{ isSubmitting ? 'Posting...' : 'Post Comment' }}
          </button>
        </div>
      </div>

      <!-- Comment List -->
      <div class="space-y-6">
        <div v-if="comments.length === 0" class="text-center py-10 text-gray-500">
          No comments yet. Be the first to comment!
        </div>
        <!-- Render Comments recursively -->
        <CommentItem 
          v-for="comment in comments" 
          :key="comment.id" 
          :comment="comment"
          :votedComments="votedComments"
          @like="handleLike"
          @dislike="handleDislike"
          @delete="deleteComment"
          @reply="onReply"
        />
      </div>

      <!-- Reply Modal/Dialog (Optional but simpler to use a sliding input) -->
      <div v-if="replyingTo" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in">
        <div class="bg-white dark:bg-dark-card rounded-3xl p-6 w-full max-w-lg shadow-2xl">
          <h4 class="text-lg font-bold mb-2">Reply to {{ replyingTo.userId }}</h4>
          <p class="text-gray-500 mb-4 text-sm truncate italic">"{{ replyingTo.content }}"</p>
          <textarea 
            v-model="replyText"
            class="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white mb-4 outline-none focus:ring-2 focus:ring-primary"
            rows="3"
            placeholder="Write your reply..."
          ></textarea>
          <div class="flex justify-end gap-3">
            <button @click="replyingTo = null" class="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-xl transition-all">Cancel</button>
            <button 
              @click="submitReply"
              :disabled="!replyText.trim()"
              class="px-6 py-2 bg-primary text-white rounded-xl font-bold shadow-md active:scale-95"
            >Post Reply</button>
          </div>
        </div>
      </div>
    </section>
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
import CommentItem from './CommentItem.vue'

const route = useRoute()
const blog = ref(null)
const comments = ref([])
const votedComments = ref(new Map())
const newComment = ref('')
const isSubmitting = ref(false)
const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8084'

// Reply state
const replyingTo = ref(null)
const replyText = ref('')

const getVisitorId = () => {
  let id = localStorage.getItem('blog_visitor_id')
  if (!id) {
    id = 'v-' + Math.random().toString(36).substr(2, 9) + '-' + Date.now()
    localStorage.setItem('blog_visitor_id', id)
  }
  return id
}

const visitorId = getVisitorId()

const getHeaders = () => ({
  headers: { 'X-Visitor-Id': visitorId }
})

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

const getTimeAgo = (dateString) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffInSeconds = Math.floor((now - past) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return past.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

const syncVoted = (data) => {
  data.forEach(comment => {
    if (comment.currentVote) {
      votedComments.value.set(comment.id, comment.currentVote)
    }
    if (comment.replies) syncVoted(comment.replies)
  })
}

const fetchComments = async (blogId) => {
  try {
    const res = await axios.get(`${API_URL}/comments/blog/${blogId}`, getHeaders())
    comments.value = res.data
    syncVoted(res.data)
  } catch (err) {
    console.error("Failed to fetch comments", err)
  }
}

const postComment = async () => {
  if (!newComment.value.trim() || isSubmitting.value) return
  
  isSubmitting.value = true
  try {
    const res = await axios.post(`${API_URL}/comments`, {
      blogId: blog.value.id,
      content: newComment.value,
      userId: visitorId
    }, getHeaders())
    comments.value.unshift(res.data)
    newComment.value = ''
  } catch (err) {
    alert("Failed to post comment")
  } finally {
    isSubmitting.value = false
  }
}

const onReply = (comment) => {
  replyingTo.value = comment
  replyText.value = ''
}

const submitReply = async () => {
  if (!replyText.value.trim()) return
  
  try {
    const res = await axios.post(`${API_URL}/comments`, {
      blogId: blog.value.id,
      content: replyText.value,
      userId: visitorId,
      parentId: replyingTo.value.id
    }, getHeaders())
    
    // Refresh comments to show nested structure (or optimize by inserting locally)
    await fetchComments(blog.value.id)
    replyingTo.value = null
    replyText.value = ''
  } catch (err) {
    alert("Failed to post reply")
  }
}

const handleLike = async (id) => {
  if (votedComments.value.has(id)) return
  
  try {
    const res = await axios.post(`${API_URL}/comments/${id}/like`, {}, getHeaders())
    // Update local state recursively for better performance
    const updateLikes = (list) => {
      const idx = list.findIndex(c => c.id === id)
      if (idx !== -1) {
        // Pertahankan replies yang sudah ada di frontend agar tidak hilang
        const existingReplies = list[idx].replies
        list[idx] = { ...res.data, replies: existingReplies }
        votedComments.value.set(id, 'LIKE')
        return true
      }
      return list.some(c => c.replies && updateLikes(c.replies))
    }
    updateLikes(comments.value)
  } catch (err) {
    console.error("Failed to like", err)
  }
}

const handleDislike = async (id) => {
  if (votedComments.value.has(id)) return

  try {
    const res = await axios.post(`${API_URL}/comments/${id}/dislike`, {}, getHeaders())
    const updateDislikes = (list) => {
      const idx = list.findIndex(c => c.id === id)
      if (idx !== -1) {
        // Pertahankan replies yang sudah ada di frontend agar tidak hilang
        const existingReplies = list[idx].replies
        list[idx] = { ...res.data, replies: existingReplies }
        votedComments.value.set(id, 'DISLIKE')
        return true
      }
      return list.some(c => c.replies && updateDislikes(c.replies))
    }
    updateDislikes(comments.value)
  } catch (err) {
    console.error("Failed to dislike", err)
  }
}

const deleteComment = async (id) => {
  if (!confirm("Are you sure you want to delete this comment?")) return
  
  try {
    await axios.delete(`${API_URL}/comments/${id}`, getHeaders())
    await fetchComments(blog.value.id)
  } catch (err) {
    alert("Failed to delete comment")
  }
}

onMounted(async () => {
  const { slug, token } = route.params
  try {
    let url = `${API_URL}/blogs/${slug}`
    if (token) {
        url = `${API_URL}/blogs/preview/${token}`
    } else if (route.path.includes('/preview/')) {
        const parts = route.path.split('/')
        const tokenFromPath = parts[parts.length - 1]
        url = `${API_URL}/blogs/preview/${tokenFromPath}`
    }

    const res = await axios.get(url)
    blog.value = res.data
    if (blog.value && blog.value.id) {
      await fetchComments(blog.value.id)
    }
  } catch (err) {
    console.error("Failed to fetch blog", err)
  }
})
</script>
