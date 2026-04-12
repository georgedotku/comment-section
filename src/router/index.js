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
  //   {
  //     path: '/comment/:id',
  //     name: 'comment',
  //     component: CommentCard,
  //   },

  //   redirect
  {
    path: '/all-jobs',
    redirect: '/jobs',
  },
  //   catch all 404 - define a route that will catch all undefined paths and redirect to a NotFound component or a specific page
  {
    path: '/:catchAll(.*)',
    name: 'NotFound',
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
