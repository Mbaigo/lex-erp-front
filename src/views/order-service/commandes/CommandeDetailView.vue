<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'

// On importe les outils du routeur
const route = useRoute() // 'route' (sans R) permet de lire l'URL actuelle
const router = useRouter() // 'router' (avec R) permet de forcer une navigation (ex: bouton retour)

// On extrait l'ID depuis l'URL (/commandes/:id)
const commandeId = route.params.id

// Fonction pour le bouton retour
const goBack = () => {
  router.push('/commandes')
}
</script>

<template>
  <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
    <button
      @click="goBack"
      class="mb-6 flex items-center text-gray-500 hover:text-indigo-600 transition"
    >
      <svg
        class="w-4 h-4 mr-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M10 19l-7-7m0 0l7-7m-7 7h18"
        ></path>
      </svg>
      Retour aux commandes
    </button>

    <div class="border-b border-gray-200 pb-4 mb-4 flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-800">
        Détails de la Commande <span class="text-indigo-600">#{{ commandeId }}</span>
      </h1>
      <span class="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold"
        >En cours</span
      >
    </div>

    <p class="text-gray-600">
      C'est sur cette page que nous ferons appel à Axios pour récupérer toutes les informations de
      la commande {{ commandeId }} depuis le microservice Java !
    </p>
  </div>
</template>
