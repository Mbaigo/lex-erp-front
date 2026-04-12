import { api } from '../api' // Ton instance Axios configurée avec le token
import type { ClientRequestDTO, ClientResponseDTO, Page } from '@/models/customer-service-api'

export const clientApi = {
  // Récupérer la liste paginée
  getAllClients(page: number = 0, size: number = 10) {
    return api.get('/clients', {
      params: { page, size },
    })
  },

  // Recherche rapide par téléphone
  searchByTelephone(telephone: string) {
    return api.get('/clients/search', {
      params: { telephone },
    })
  },

  // POST /api/v1/clients (La fameuse méthode de création !)
  createClient(data: ClientRequestDTO) {
    return api.post<ClientResponseDTO>('/clients', data)
  },

  // PUT /api/v1/clients/{id} (Pour l'édition future)
  updateClient(id: number, data: ClientRequestDTO) {
    return api.put<ClientResponseDTO>(`/clients/${id}`, data)
  },
}
