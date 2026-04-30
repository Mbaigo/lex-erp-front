import axios from 'axios'
import { userManager } from './oauth/AuthService'
import { useToast } from 'vue-toastification'

// On crée une instance configurée pour pointer vers ton API Gateway
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000, // Annule la requête si le backend met plus de 10 secondes
})

const toast = useToast()

// 1. INTERCEPTEUR DE REQUÊTE (Injection du Token)
api.interceptors.request.use(
  async (config) => {
    try {
      const user = await userManager.getUser()
      if (user && user.access_token) {
        config.headers.Authorization = `Bearer ${user.access_token}`
      }
    } catch (e) {
      console.error('Erreur lors de la récupération du token', e)
    }
    return config
  },
  (error) => Promise.reject(error),
)

// 2. INTERCEPTEUR DE RÉPONSE (Gestion centralisée des Toasts)
api.interceptors.response.use(
  (response) => response, // Succès : on retourne la réponse telle quelle
  (error) => {
    const status = error.response?.status
    const data = error.response?.data

    // Logique de message basée sur ton @ControllerAdvice backend
    let errorMessage = 'Une erreur est survenue lors de la communication avec le serveur.'

    if (data && typeof data === 'object') {
      // On cherche le message d'erreur envoyé par ton @ControllerAdvice
      // Souvent 'message', 'error', ou 'detail' selon ta config Spring
      errorMessage = data.message || data.error || data.detail || errorMessage
    }

    switch (status) {
      case 400:
        // Pour les erreurs de validation (@Valid), on affiche le message spécifique
        toast.error(`Données invalides : ${errorMessage}`)
        break
      case 401:
        toast.warning('Votre session a expiré. Redirection...')
        // Optionnel : rediriger vers login ici
        break
      case 403:
        toast.error("Accès refusé : vous n'avez pas les permissions nécessaires.")
        break
      case 404:
        toast.info("La ressource demandée n'existe pas.")
        break
      case 500:
        toast.error('Erreur interne du serveur. Nos tailleurs réparent le problème !')
        break
      default:
        // Erreurs réseaux ou serveurs éteints (status est undefined)
        if (!status) {
          toast.error('Impossible de contacter le Gateway. Vérifiez votre connexion.')
        } else {
          toast.error(errorMessage)
        }
    }

    return Promise.reject(error)
  },
)

export default api
