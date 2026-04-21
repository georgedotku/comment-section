import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import CommentPage from '../views/CommentPage.vue';
import NotFound from '../views/NotFound.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    props: true,
  },
  {
    path: '/comment/:id',
    name: 'comment',
    component: CommentPage,
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
