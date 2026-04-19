<script setup lang="ts">
import { authService } from '@/services/oauth/AuthService';

const loginWithKeycloak = () => {
  authService.login();
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div class="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg text-center">
      <h2 class="text-3xl font-extrabold text-gray-900">Bienvenue sur Lex Couture</h2>
      <p class="mt-2 text-sm text-gray-600">Connectez-vous pour accéder à votre tableau de bord</p>

      <button
        @click="loginWithKeycloak"
        class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150"
      >
        Se connecter avec Keycloak
      </button>

      <div class="text-xs text-gray-400 mt-4">
        Sécurité gérée par Keycloak SSO
      </div>
    </div>
  </div>
</template>
