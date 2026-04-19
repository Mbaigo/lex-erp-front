import axios from 'axios'
import { userManager } from './oauth/AuthService'

// On crée une instance configurée pour pointer vers ton API Gateway
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000, // Annule la requête si le backend met plus de 10 secondes
})

// INTERCEPTEUR : Le "videur" qui ajoute le jeton Keycloak à chaque requête
api.interceptors.request.use(
  async (config) => {
    const user = await userManager.getUser()
    if (user && user.access_token) {
      config.headers.Authorization = `Bearer ${user.access_token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)
export default api
