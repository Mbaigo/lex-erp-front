import { UserManager, WebStorageStateStore, type User } from 'oidc-client-ts'

const settings = {
  authority: import.meta.env.VITE_KEYCLOAK_URL, // URL de Keycloak
  client_id: import.meta.env.VITE_CLIENT_ID,
  redirect_uri: import.meta.env.VITE_REDIRECT_URI, // URL après login
  response_type: import.meta.env.VITE_RESPONSE_TYPE,
  scope: import.meta.env.VITE_SCOPE,
  post_logout_redirect_uri: import.meta.env.VITE_POST_LOGOUT_REDIRECT_URI,
  userStore: new WebStorageStateStore({ store: window.localStorage }),
}

export const userManager = new UserManager(settings)
export const authService = {
  // Lance la redirection vers Keycloak
  login() {
    return userManager.signinRedirect()
  },
  // Déconnecte l'utilisateur
  logout() {
    return userManager.signoutRedirect()
  },
  // Récupère l'utilisateur actuel et ses tokens
  getUser(): Promise<User | null> {
    return userManager.getUser()
  },
  // À appeler dans le composant Callback
  handleCallback() {
    return userManager.signinRedirectCallback()
  },
}
