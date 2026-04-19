<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { api } from '../services/api'
import { authService } from '../services/oauth/AuthService' // Import de ton service Keycloak
import type { User, UserProfile } from 'oidc-client-ts'

interface KeycloakProfile extends UserProfile {
  roles?: string[]
}

// On définit un type d'utilisateur qui utilise notre profil enrichi
interface KeycloakUser extends User {
  profile: KeycloakProfile
}

interface Commande {
  statut: 'CREEE' | 'EN_CONFECTION' | 'ESSAYAGE' | 'TERMINEE'
  [key: string]: unknown
}

// --- LOGIQUE AUTHENTIFICATION ---
const user = ref<KeycloakUser | null>(null)

// --- LOGIQUE DASHBOARD ---
const isLoading = ref(true)
const stats = ref({
  creees: 0,
  enConfection: 0,
  essayage: 0,
  terminees: 0,
})

onMounted(async () => {
  try {
    // 1. On récupère les infos de l'utilisateur connecté
    user.value = await authService.getUser()

    // 2. On appelle la Gateway (le token sera ajouté par l'intercepteur dans api.ts)
    const response = await api.get('/commandes')
    const commandes = response.data

    commandes.forEach((cmd: Commande) => {
      if (cmd.statut === 'CREEE') stats.value.creees++
      if (cmd.statut === 'EN_CONFECTION') stats.value.enConfection++
      if (cmd.statut === 'ESSAYAGE') stats.value.essayage++
      if (cmd.statut === 'TERMINEE') stats.value.terminees++
    })
  } catch (error: any) {
    console.error('Erreur détaillée :', error)
    // Si erreur 401, l'utilisateur sera probablement redirigé par le router guard
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="p-6 max-w-7xl mx-auto">
      <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-2xl font-bold text-gray-800">📊 Tableau de bord global</h1>
          <span v-if="isLoading" class="text-sm text-gray-400 animate-pulse"
            >Mise à jour des données...</span
          >
        </div>

        <p class="text-gray-600 mb-6">Suivi de la production de l'atelier en temps réel.</p>

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
              <h3 class="text-purple-800 font-semibold text-sm uppercase tracking-wider">
                Essayage
              </h3>
              <span class="text-purple-500 text-xl">📏</span>
            </div>
            <p class="text-3xl font-bold text-purple-700 mt-auto">{{ stats.essayage }}</p>
            <p class="text-purple-600 text-xs mt-1">Client attendu</p>
          </div>

          <div class="bg-green-50 p-5 rounded-xl border border-green-100 shadow-sm flex flex-col">
            <div class="flex items-center justify-between mb-2">
              <h3 class="text-green-800 font-semibold text-sm uppercase tracking-wider">
                Terminées
              </h3>
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
            Le tableau des dernières commandes s'affichera ici.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
