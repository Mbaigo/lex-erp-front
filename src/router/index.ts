import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '../views/DashboardView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: DashboardView,
    },
    {
      path: '/commandes',
      name: 'commandes',
      component: () => import('../views/order-service/commandes/ListeCommandeView.vue'),
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
      path: '/clients/fiches-mesures',
      name: 'fiches-mesures',
      // Cette route affichera toutes les fiches de mesures globales, ou tu peux la lier à un client spécifique plus tard
      component: () => import('../views/customer-service/fiche-mesure/FichesMesuresView.vue'),
    },
  ],
})

export default router
