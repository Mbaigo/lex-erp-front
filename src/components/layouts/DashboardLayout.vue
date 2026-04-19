<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { authService } from '@/services/oauth/AuthService'
import LogoEsperanza from '@/utils/LogoEsperanza.vue'
import { useAuthStore } from '@/stores/useAuthStore'

// --- Logique d'Authentification ---
//const user = ref<User | null>(null)

const authStore = useAuthStore()

onMounted(async () => {
  if (!authStore.user) {
    console.log("Header monté, vérification de l'utilisateur...")
    await authStore.refreshUser()
    console.log('Utilisateur dans le store après refresh :', authStore.user)
  }
})

const handleLogout = () => {
  authService.logout()
}

// Calcul de l'initiale
// Utilisation de computed basée sur le STORE
const userInitial = computed(() => {
  const name = authStore.user?.profile?.preferred_username || 'U'
  return name.charAt(0).toUpperCase()
})

// --- Logique du Sidebar (Accordéon) ---
const activeMenu = ref<string | null>(null)

const toggleMenu = (menuName: string) => {
  activeMenu.value = activeMenu.value === menuName ? null : menuName
}
</script>

<template>
  <div class="flex h-screen bg-gray-100">
    <aside class="w-64 bg-gray-900 text-white flex flex-col shadow-xl">
      <div class="h-40 flex items-center justify-center border-b border-gray-800 p-4">
        <router-link to="/">
          <logo-esperanza size="200" />
        </router-link>
      </div>

      <nav class="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
        <router-link
          to="/dashboard"
          class="block px-4 py-2 mb-4 rounded text-gray-400 hover:bg-gray-700 hover:text-white transition"
          exact-active-class="bg-indigo-600 text-white font-semibold"
        >
          📊 Tableau de bord
        </router-link>

        <div class="group" @mouseenter="toggleMenu('clients')" @click="toggleMenu('clients')">
          <div
            class="px-4 py-2 mt-2 rounded flex justify-between items-center cursor-pointer text-gray-400 hover:bg-gray-800 hover:text-white transition"
            :class="{ 'text-white bg-gray-800': activeMenu === 'clients' }"
          >
            <span class="text-xs font-semibold uppercase tracking-wider">🤝 Relation Client</span>
            <svg
              :class="{ 'rotate-180': activeMenu === 'clients' }"
              class="w-4 h-4 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </div>
          <div
            class="overflow-hidden transition-all duration-300"
            :class="activeMenu === 'clients' ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'"
          >
            <div class="pl-4 py-1 space-y-1 border-l-2 border-gray-700 ml-6 mt-1">
              <router-link
                to="/clients/liste"
                class="block px-4 py-2 text-sm text-gray-400 hover:text-white transition"
                active-class="text-indigo-400"
                >👥 Liste des Clients</router-link
              >
              <router-link
                to="/fiches-mesures"
                class="block px-4 py-2 text-sm text-gray-400 hover:text-white transition"
                active-class="text-indigo-400"
                >📏 Fiches de Mesures</router-link
              >
            </div>
          </div>
        </div>

        <div class="group" @mouseenter="toggleMenu('commandes')" @click="toggleMenu('commandes')">
          <div
            class="px-4 py-2 mt-2 rounded flex justify-between items-center cursor-pointer text-gray-400 hover:bg-gray-800 hover:text-white transition"
            :class="{ 'text-white bg-gray-800': activeMenu === 'commandes' }"
          >
            <span class="text-xs font-semibold uppercase tracking-wider">📦 Commandes</span>
            <svg
              :class="{ 'rotate-180': activeMenu === 'commandes' }"
              class="w-4 h-4 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </div>
          <div
            class="overflow-hidden transition-all duration-300"
            :class="activeMenu === 'commandes' ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'"
          >
            <div class="pl-4 py-1 space-y-1 border-l-2 border-gray-700 ml-6 mt-1">
              <router-link
                to="/commandes/creees"
                class="block px-4 py-2 text-sm text-gray-400 hover:text-white"
                >🆕 Créées</router-link
              >
              <router-link
                to="/commandes/en-confection"
                class="block px-4 py-2 text-sm text-gray-400 hover:text-white"
                >✂️ En Confection</router-link
              >
              <router-link
                to="/commandes/essayage"
                class="block px-4 py-2 text-sm text-gray-400 hover:text-white"
                >📏 Essayage</router-link
              >
              <router-link
                to="/commandes/terminees"
                class="block px-4 py-2 text-sm text-gray-400 hover:text-white"
                >✅ Terminées</router-link
              >
            </div>
          </div>
        </div>

        <div class="group" @mouseenter="toggleMenu('catalogue')" @click="toggleMenu('catalogue')">
          <div
            class="px-4 py-2 mt-2 rounded flex justify-between items-center cursor-pointer text-gray-400 hover:bg-gray-800 hover:text-white transition"
            :class="{ 'text-white': activeMenu === 'catalogue' }"
          >
            <span class="text-xs font-semibold uppercase tracking-wider">👗 Catalogue</span>

            <svg
              :class="{ 'rotate-180': activeMenu === 'catalogue' }"
              class="w-4 h-4 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </div>

          <div
            class="overflow-hidden transition-all duration-300 ease-in-out"
            :class="activeMenu === 'catalogue' ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'"
          >
            <div class="pl-4 pr-2 py-1 space-y-1 border-l-2 border-gray-800 ml-6 mt-1">
              <router-link
                to="/catalogue/homme"
                class="block px-4 py-2 text-sm rounded text-gray-400 hover:text-white hover:bg-gray-800 transition"
                active-class="text-indigo-400 font-semibold"
                >👔 Homme</router-link
              >

              <router-link
                to="/catalogue/femme"
                class="block px-4 py-2 text-sm rounded text-gray-400 hover:text-white hover:bg-gray-800 transition"
                active-class="text-indigo-400 font-semibold"
                >👗 Femme</router-link
              >

              <router-link
                to="/catalogue/enfant"
                class="block px-4 py-2 text-sm rounded text-gray-400 hover:text-white hover:bg-gray-800 transition"
                active-class="text-indigo-400 font-semibold"
                >🧸 Enfant</router-link
              >
            </div>
          </div>
        </div>

        <div class="group" @mouseenter="toggleMenu('rdv')" @click="toggleMenu('rdv')">
          <div
            class="px-4 py-2 mt-2 rounded flex justify-between items-center cursor-pointer text-gray-400 hover:bg-gray-800 hover:text-white transition"
            :class="{ 'text-white': activeMenu === 'rdv' }"
          >
            <span class="text-xs font-semibold uppercase tracking-wider">📅 Rendez-vous</span>

            <svg
              :class="{ 'rotate-180': activeMenu === 'rdv' }"
              class="w-4 h-4 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </div>

          <div
            class="overflow-hidden transition-all duration-300 ease-in-out"
            :class="activeMenu === 'rdv' ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'"
          >
            <div class="pl-4 pr-2 py-1 space-y-1 border-l-2 border-gray-800 ml-6 mt-1">
              <router-link
                to="/rendez-vous/journalier"
                class="block px-4 py-2 text-sm rounded text-gray-400 hover:text-white hover:bg-gray-800 transition"
                active-class="text-indigo-400 font-semibold"
              >
                ☀️ Journalier
              </router-link>

              <router-link
                to="/rendez-vous/semaine"
                class="block px-4 py-2 text-sm rounded text-gray-400 hover:text-white hover:bg-gray-800 transition"
                active-class="text-indigo-400 font-semibold"
              >
                🗓️ Semaine
              </router-link>

              <router-link
                to="/rendez-vous/mois"
                class="block px-4 py-2 text-sm rounded text-gray-400 hover:text-white hover:bg-gray-800 transition"
                active-class="text-indigo-400 font-semibold"
              >
                🌙 Mois
              </router-link>
            </div>
          </div>
        </div>

        <div class="group" @mouseenter="toggleMenu('admin')" @click="toggleMenu('admin')">
          <div
            class="px-4 py-2 mt-2 rounded flex justify-between items-center cursor-pointer text-gray-400 hover:bg-gray-800 hover:text-white transition"
            :class="{ 'text-white': activeMenu === 'admin' }"
          >
            <span class="text-xs font-semibold uppercase tracking-wider">⚙️ Administration</span>
            <svg
              :class="{ 'rotate-180': activeMenu === 'admin' }"
              class="w-4 h-4 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </div>
          <div
            class="overflow-hidden transition-all duration-300 ease-in-out"
            :class="activeMenu === 'admin' ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'"
          >
            <div class="pl-4 pr-2 py-1 space-y-1 border-l-2 border-gray-800 ml-6 mt-1">
              <router-link
                to="/utilisateurs"
                class="block px-4 py-2 text-sm rounded text-gray-400 hover:text-white hover:bg-gray-800 transition"
                active-class="text-indigo-400 font-semibold"
                >👥 Utilisateurs</router-link
              >
              <router-link
                to="/articles"
                class="block px-4 py-2 text-sm rounded text-gray-400 hover:text-white hover:bg-gray-800 transition"
                active-class="text-indigo-400 font-semibold"
                >📦 Stock Articles</router-link
              >
            </div>
          </div>
        </div>
      </nav>
    </aside>

    <div class="flex-1 flex flex-col overflow-hidden">
      <header
        class="h-16 bg-white shadow-sm z-10 flex items-center justify-between px-6 border-b border-gray-200"
      >
        <div class="flex items-center gap-3">
          <span class="text-2xl">🪡</span>
          <h1 class="text-xl font-bold text-gray-800 tracking-tight">Lex Couture</h1>
        </div>

        <div v-if="authStore.user" class="flex items-center">
          <div class="group relative flex items-center">
            <span class="mr-3 text-xs font-semibold text-indigo-600 uppercase tracking-wider">
              {{ (authStore.user.profile as any).roles?.[0] || 'Utilisateur' }}
            </span>

            <div
              class="h-10 w-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-sm cursor-pointer border-2 border-white group-hover:bg-indigo-700 transition-all"
            >
              {{ userInitial }}
            </div>

            <div
              class="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50"
            >
              <div class="p-3 border-b border-gray-100">
                <p class="text-xs text-gray-400">Connecté en tant que</p>
                <p class="text-sm font-bold text-gray-800">
                  {{ authStore.user.profile.preferred_username }}
                </p>
              </div>
              <button
                @click="handleLogout"
                class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 rounded-b-lg transition"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </header>

      <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
        <slot></slot>
      </main>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #374151;
  border-radius: 10px;
}
</style>
