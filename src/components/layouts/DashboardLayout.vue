<script setup lang="ts">
import { ref } from 'vue'
import LogoEsperanza from '@/utils/LogoEsperanza.vue'

// Gère le menu actuellement ouvert (Accordéon)
// null = tout est fermé. On peut mettre 'commandes' par défaut si on veut qu'il soit ouvert au démarrage.
const activeMenu = ref<string | null>(null)

// Fonction déclenchée au survol (ou au clic) pour changer la rubrique active
const toggleMenu = (menuName: string) => {
  activeMenu.value = menuName
}
</script>

<template>
  <div class="flex h-screen bg-gray-100">
    <aside class="w-64 bg-gray-900 text-white flex flex-col">
      <div class="h-40 flex items-center justify-center border-b border-gray-800 p-4">
        <router-link to="/">
          <logo-esperanza size="200" />
        </router-link>
      </div>

      <nav class="flex-1 p-4 space-y-1">
        <router-link
          to="/"
          class="block px-4 py-2 mb-4 rounded text-gray-400 hover:bg-gray-700 hover:text-white transition"
          exact-active-class="bg-indigo-600 text-white font-semibold"
        >
          📊 Tableau de bord
        </router-link>

        <div class="group" @mouseenter="toggleMenu('clients')" @click="toggleMenu('clients')">
          <div
            class="px-4 py-2 mt-2 rounded flex justify-between items-center cursor-pointer text-gray-400 hover:bg-gray-800 hover:text-white transition"
            :class="{ 'text-white': activeMenu === 'clients' }"
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
            class="overflow-hidden transition-all duration-300 ease-in-out"
            :class="activeMenu === 'clients' ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'"
          >
            <div class="pl-4 pr-2 py-1 space-y-1 border-l-2 border-gray-800 ml-6 mt-1">
              <router-link
                to="/clients/liste"
                class="block px-4 py-2 text-sm rounded text-gray-400 hover:text-white hover:bg-gray-800 transition"
                active-class="text-indigo-400 font-semibold"
              >
                👥 Liste des Clients
              </router-link>
              <router-link
                to="/fiches-mesures"
                class="block px-4 py-2 text-sm rounded text-gray-400 hover:text-white hover:bg-gray-800 transition"
                active-class="text-indigo-400 font-semibold"
              >
                📏 Fiches de Mesures
              </router-link>
            </div>
          </div>
        </div>

        <div class="group" @mouseenter="toggleMenu('commandes')" @click="toggleMenu('commandes')">
          <div
            class="px-4 py-2 mt-2 rounded flex justify-between items-center cursor-pointer text-gray-400 hover:bg-gray-800 hover:text-white transition"
            :class="{ 'text-white': activeMenu === 'commandes' }"
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
            class="overflow-hidden transition-all duration-300 ease-in-out"
            :class="activeMenu === 'commandes' ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'"
          >
            <div class="pl-4 pr-2 py-1 space-y-1 border-l-2 border-gray-800 ml-6 mt-1">
              <router-link
                to="/commandes/creees"
                class="block px-4 py-2 text-sm rounded text-gray-400 hover:text-white hover:bg-gray-800 transition"
                active-class="text-indigo-400 font-semibold"
                >🆕 Créées</router-link
              >
              <router-link
                to="/commandes/en-confection"
                class="block px-4 py-2 text-sm rounded text-gray-400 hover:text-white hover:bg-gray-800 transition"
                active-class="text-indigo-400 font-semibold"
                >✂️ En Confection</router-link
              >
              <router-link
                to="/commandes/essayage"
                class="block px-4 py-2 text-sm rounded text-gray-400 hover:text-white hover:bg-gray-800 transition"
                active-class="text-indigo-400 font-semibold"
                >📏 Essayage</router-link
              >
              <router-link
                to="/commandes/terminees"
                class="block px-4 py-2 text-sm rounded text-gray-400 hover:text-white hover:bg-gray-800 transition"
                active-class="text-indigo-400 font-semibold"
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
      <header class="h-16 bg-white shadow z-10 flex items-center justify-between px-6">
        <h2 class="text-xl font-semibold text-gray-800">Espace Gérant</h2>
        <div class="flex items-center space-x-4">
          <span class="text-sm text-gray-600">Connecté en tant que Admin</span>
          <div
            class="h-8 w-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold cursor-pointer hover:bg-indigo-700 transition"
          >
            A
          </div>
        </div>
      </header>

      <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
        <slot></slot>
      </main>
    </div>
  </div>
</template>
