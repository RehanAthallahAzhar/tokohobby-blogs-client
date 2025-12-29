<template>
  <div class="flex flex-col gap-4">
    <div class="flex gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/30 border border-gray-50 dark:border-gray-800 transition-hover group">
      <div class="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center font-bold text-gray-500 shrink-0">
        {{ comment.userId[0].toUpperCase() }}
      </div>
      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between mb-1">
          <div class="flex items-center gap-2">
            <div class="flex items-center gap-1.5 font-bold text-gray-900 dark:text-white truncate">
                <span>{{ comment.userId }}</span>
                <template v-if="comment.replyToUserId">
                    <span class="text-gray-400 font-normal text-[10px]">▶</span>
                    <span>{{ comment.replyToUserId }}</span>
                </template>
            </div>
            <span class="text-xs text-gray-400">• {{ getTimeAgo(comment.createdAt) }}</span>
          </div>
          <button 
            v-if="comment.userId === 'guest' || comment.userId.startsWith('v-')"
            @click="$emit('delete', comment.id)"
            class="text-xs text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
          >
            Delete
          </button>
        </div>
        <p class="text-gray-700 dark:text-gray-300 break-words">
          {{ comment.content }}
        </p>
        <div class="flex items-center gap-4 mt-3 text-sm text-gray-500">
            <button 
              @click="$emit('like', comment.id)"
              :disabled="votedComments.has(comment.id)"
              :class="[
                'flex items-center gap-1 transition-all px-2 py-1 rounded-lg',
                votedComments.get(comment.id) === 'LIKE'
                  ? 'bg-blue-50 text-primary border border-blue-200 shadow-sm' 
                  : (votedComments.has(comment.id) ? 'opacity-50 grayscale cursor-default' : 'hover:bg-gray-100 hover:text-primary')
              ]"
            >
              👍 {{ comment.likes }}
            </button>
            <button 
              @click="$emit('dislike', comment.id)"
              :disabled="votedComments.has(comment.id)"
              :class="[
                'flex items-center gap-1 transition-all px-2 py-1 rounded-lg',
                votedComments.get(comment.id) === 'DISLIKE' 
                  ? 'bg-red-50 text-red-500 border border-red-200 shadow-sm' 
                  : (votedComments.has(comment.id) ? 'opacity-50 grayscale cursor-default' : 'hover:bg-gray-100 hover:text-red-500')
              ]"
            >
              👎 {{ comment.dislikes }}
            </button>
            <button 
              @click="$emit('reply', comment)"
              class="hover:text-primary transition-colors flex items-center gap-1"
            >
              <span class="text-lg">↩</span> Reply
            </button>
        </div>
      </div>
    </div>

    <!-- Recursive Replies -->
    <div v-if="comment.replies && comment.replies.length > 0" class="ml-8 md:ml-12 space-y-4 border-l-2 border-gray-100 dark:border-gray-800 pl-4 md:pl-6">
      <CommentItem 
        v-for="reply in comment.replies" 
        :key="reply.id" 
        :comment="reply"
        :votedComments="votedComments"
        @like="$emit('like', $event)"
        @dislike="$emit('dislike', $event)"
        @delete="$emit('delete', $event)"
        @reply="$emit('reply', $event)"
      />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  comment: Object,
  votedComments: Map
})

defineEmits(['like', 'dislike', 'delete', 'reply'])

const getTimeAgo = (dateString) => {
    if (!dateString) return 'Just now';
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
</script>
