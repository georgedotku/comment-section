import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import CommentPage from '../views/CommentPage.vue';
import SignUp from '../views/SignUp.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    props: true,
  },
  {
    path: '/sign-up',
    name: 'sign-up',
    component: SignUp,
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
