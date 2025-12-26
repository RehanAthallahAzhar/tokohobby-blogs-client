import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import BlogList from './components/BlogList.vue'
import BlogDetail from './components/BlogDetail.vue'
import AdminPanel from './components/AdminPanel.vue'

import './style.css'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/blogs', component: BlogList },
        { path: '/blogs/:slug', component: BlogDetail },
        { path: '/blogs/preview/:token', component: BlogDetail },
        { path: '/admin/blogs', component: AdminPanel },
        { path: '/', redirect: '/blogs' }
    ]
})

createApp(App).use(router).mount('#app')
