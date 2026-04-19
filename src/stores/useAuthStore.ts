import { defineStore } from 'pinia';
import { ref } from 'vue';
import { authService } from '@/services/oauth/AuthService';
import type { User } from 'oidc-client-ts';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const isAuthenticated = ref(false);

  // Cette fonction sera appelée pour rafraîchir l'état
  async function refreshUser() {
    const currentUser = await authService.getUser();
    user.value = currentUser;
    isAuthenticated.value = !!currentUser;
  }

  return { user, isAuthenticated, refreshUser };
});
