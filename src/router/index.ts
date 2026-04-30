import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '../views/DashboardView.vue'
import CallbackView from '../views/auth/CallbackView.vue'
import { authService } from '@/services/oauth/AuthService'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // src/router/index.ts
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/auth/LoginView.vue'),
    },
    {
      path: '/callback', // Cette URL doit être celle déclarée dans Keycloak
      name: 'callback',
      component: CallbackView,
    },

    {
      path: '/dashboard',
      component: () => import('@/views/DashboardView.vue'),
      meta: { requiresAuth: true },
    },

    {
      path: '/',
      name: 'dashboard',
      component: DashboardView,
      meta: { requiresAuth: true },
    },
    {
      path: '/commandes',
      name: 'commandes',
      component: () => import('../views/order-service/commandes/ListeCommandeView.vue'),
      meta: { requiresAuth: true },
    },
    // NOUVELLE ROUTE DYNAMIQUE : L'utilisation des deux points ":" est cruciale !
    {
      path: '/commandes/:id',
      name: 'commande-details',
      component: () => import('../views/order-service/commandes/CommandeDetailView.vue'),
    },
    {
      path: '/rendez-vous/:periode', // journalier, semaine ou mois
      name: 'planning',
      component: () => import('../views/order-service/rendezVous/RendezVousView.vue'),
    },
    {
      path: '/clients/liste',
      name: 'clients',
      component: () => import('../views/customer-service/client/ClientsView.vue'),
    },
    {
      path: '/clients/:id/fiches-mesures',
      name: 'fiches-mesures',
      // Cette route affichera toutes les fiches de mesures globales, ou tu peux la lier à un client spécifique plus tard
      component: () => import('../views/customer-service/client/ClientFichesMesuresView.vue'),
    },
    {
      path: '/fiches-mesures',
      name: 'all-fiches-mesures',
      // Cette route affichera toutes les fiches de mesures globales, ou tu peux la lier à un client spécifique plus tard
      component: () => import('../views/customer-service/fiche-mesure/FichesMesuresView.vue'),
    },

    //Catégories et articles de catalogue service

    {
      path: '/catalogue/categories',
      name: 'all-categories-articles',
      // Cette route affichera toutes les fiches de mesures globales, ou tu peux la lier à un client spécifique plus tard
      component: () => import('../views/catalog-service/CategoriesArticlesView.vue'),
    },
    {
      path: '/catalogue/articles',
      name: 'all-articles',
      // Cette route affichera toutes les fiches de mesures globales, ou tu peux la lier à un client spécifique plus tard
      component: () => import('../views/catalog-service/ArticlesView.vue'),
    },
  ],
})

// Protection des routes
router.beforeEach(async (to, from, next) => {
  const user = await authService.getUser()

  if (to.meta.requiresAuth && !user) {
    // Si la route demande une auth et que l'user n'est pas là -> direction login
    next('/login')
  } else if (to.path === '/login' && user) {
    // Si l'user est déjà connecté et va sur /login -> direction dashboard
    next('/dashboard')
  } else {
    next()
  }
})

export default router
