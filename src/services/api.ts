import axios from 'axios'

// On crée une instance configurée pour pointer vers ton API Gateway
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000, // Annule la requête si le backend met plus de 10 secondes
})

// INTERCEPTEUR : Le "videur" qui ajoute le jeton Keycloak à chaque requête
api.interceptors.request.use((config) => {
  // ⚠️ TEMPORAIRE : Comme nous n'avons pas encore d'écran de connexion en Vue.js,
  // va copier le token "eyJ..." que tu utilises dans Bruno et colle-le ici :
  const token = import.meta.env.VITE_TEMP_KEYCLOAK_TOKEN

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})
