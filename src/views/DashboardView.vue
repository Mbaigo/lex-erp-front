<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { api } from '../services/api' // Notre fichier configuré à l'étape 1

interface Commande {
  statut: 'CREEE' | 'EN_CONFECTION' | 'ESSAYAGE' | 'TERMINEE'
  [key: string]: unknown
}

// 1. Nos variables réactives (qui mettront l'écran à jour toutes seules)
const isLoading = ref(true)
const stats = ref({
  creees: 0,
  enConfection: 0,
  essayage: 0,
  terminees: 0,
})

// 2. La fonction qui s'exécute quand la page s'affiche
onMounted(async () => {
  try {
    // On appelle ta Gateway (qui va router vers order-service)
    const response = await api.get('/v1/commandes')
    const commandes = response.data

    // On parcourt les vraies commandes pour faire les totaux
    // (J'assume ici que ton backend renvoie un champ 'statut' ou 'status')
    commandes.forEach((cmd: Commande) => {
      // Adapte les mots exactement comme tes Enum Java !
      if (cmd.statut === 'CREEE') stats.value.creees++
      if (cmd.statut === 'EN_CONFECTION') stats.value.enConfection++
      if (cmd.statut === 'ESSAYAGE') stats.value.essayage++
      if (cmd.statut === 'TERMINEE') stats.value.terminees++
    })
  } catch (error: any) {
    console.error("Détail complet de l'erreur :", error)
    if (error.response) {
      // Le backend a répondu, mais avec une erreur
      console.error('Statut HTTP du backend :', error.response.status) // ex: 401, 404, 403
      console.error('Message du backend :', error.response.data)
    } else if (error.request) {
      // Le backend n'a même pas pu être atteint (Gateway éteinte ou CORS)
      console.error('Aucune réponse de la Gateway (Problème réseau ou CORS)')
    }
  } finally {
    isLoading.value = false // On cache le chargement
  }
})
</script>

<template>
  <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">📊 Tableau de bord global</h1>
    </div>

    <p class="text-gray-600 mb-6">Suivi de la production de l'atelier Lex Couture en temps réel.</p>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-blue-50 p-5 rounded-xl border border-blue-100 shadow-sm flex flex-col">
        <div class="flex items-center justify-between mb-2">
          <h3 class="text-blue-800 font-semibold text-sm uppercase tracking-wider">Créées</h3>
          <span class="text-blue-500 text-xl">🆕</span>
        </div>
        <p class="text-3xl font-bold text-blue-700 mt-auto">{{ stats.creees }}</p>
        <p class="text-blue-600 text-xs mt-1">En attente de démarrage</p>
      </div>

      <div class="bg-amber-50 p-5 rounded-xl border border-amber-100 shadow-sm flex flex-col">
        <div class="flex items-center justify-between mb-2">
          <h3 class="text-amber-800 font-semibold text-sm uppercase tracking-wider">
            En Confection
          </h3>
          <span class="text-amber-500 text-xl">✂️</span>
        </div>
        <p class="text-3xl font-bold text-amber-700 mt-auto">{{ stats.enConfection }}</p>
        <p class="text-amber-600 text-xs mt-1">Coupe et couture en cours</p>
      </div>

      <div class="bg-purple-50 p-5 rounded-xl border border-purple-100 shadow-sm flex flex-col">
        <div class="flex items-center justify-between mb-2">
          <h3 class="text-purple-800 font-semibold text-sm uppercase tracking-wider">Essayage</h3>
          <span class="text-purple-500 text-xl">📏</span>
        </div>
        <p class="text-3xl font-bold text-purple-700 mt-auto">{{ stats.essayage }}</p>
        <p class="text-purple-600 text-xs mt-1">Client attendu</p>
      </div>

      <div class="bg-green-50 p-5 rounded-xl border border-green-100 shadow-sm flex flex-col">
        <div class="flex items-center justify-between mb-2">
          <h3 class="text-green-800 font-semibold text-sm uppercase tracking-wider">Terminées</h3>
          <span class="text-green-500 text-xl">✅</span>
        </div>
        <p class="text-3xl font-bold text-green-700 mt-auto">{{ stats.terminees }}</p>
        <p class="text-green-600 text-xs mt-1">Cette semaine</p>
      </div>
    </div>

    <div class="mt-8">
      <h2 class="text-lg font-semibold text-gray-800 mb-4">Activité récente</h2>
      <div
        class="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center text-gray-500 text-sm"
      >
        Le tableau des 5 dernières commandes de la semaine s'affichera ici.
      </div>
    </div>
  </div>
</template>
