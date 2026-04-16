import { api } from '../api' // Ajuste le chemin vers ton instance Axios configurée (baseURL: '/api/v1')
import type {
  FicheMesureRequestDTO,
  FicheMesureResponseDTO,
  Page
} from '@/models/customer-service-api'

export const ficheMesureApi = {

  /**
   * US : Créer une fiche de mesures
   * POST /api/v1/fiches-mesures
   */
  createFicheMesure(data: FicheMesureRequestDTO) {
    return api.post<FicheMesureResponseDTO>('/fiches-mesures', data)
  },

  /**
   * US : Récupérer une fiche précise
   * GET /api/v1/fiches-mesures/{id}
   */
  getFicheById(id: number) {
    return api.get<FicheMesureResponseDTO>(`/fiches-mesures/${id}`)
  },

  /**
   * US : Consulter l'historique d'un client
   * GET /api/v1/fiches-mesures/client/{clientId}
   */
  getFichesByClientId(clientId: number) {
    // Spring Boot renvoie une List<FicheMesureResponseDTO>, donc le type de retour est un tableau []
    return api.get<FicheMesureResponseDTO[]>(`/fiches-mesures/client/${clientId}`)
  },

  /**
   * US : Mettre à jour une fiche
   * PUT /api/v1/fiches-mesures/{id}
   */
  updateFicheMesure(id: number, data: FicheMesureRequestDTO) {
    return api.put<FicheMesureResponseDTO>(`/fiches-mesures/${id}`, data)
  },

  /**
   * US : Récupérer toutes les fiches de l'atelier (Paginé)
   * GET /api/v1/fiches-mesures
   */
  getAllFichesMesures(page: number = 0, size: number = 10) {
    return api.get<Page<FicheMesureResponseDTO>>('/fiches-mesures', {
      params: { page, size }
    })
  },
}
