<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { authService, userManager } from '@/services/oauth/AuthService'
import { useAuthStore } from '@/stores/useAuthStore'

const router = useRouter()

onMounted(async () => {
  try {

    await authService.handleCallback();
    const authStore = useAuthStore();
    await authStore.refreshUser(); // 👈 On force la mise à jour du store i
    // 1. On traite le retour de Keycloak (échange du code contre le token)
    await userManager.signinRedirectCallback()

    // 2. Une fois réussi, on redirige vers l'accueil (ou la page précédente)
    router.push('/')
  } catch (erreur) {
    console.error("Erreur lors de la finalisation de l'authentification :", erreur)
    // En cas d'erreur, on peut rediriger vers une page d'erreur ou de login
    router.push('/login')
  }
})
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen">
    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
    <p class="text-gray-600 font-medium">Initialisation de votre session...</p>
  </div>
</template>
