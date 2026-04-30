import api from '../api' // Ton instance axios configurée
import type { CategorieRequest, CategorieResponse, Page } from '@/models/catalog-service-api'

export const catalogService = {
  /**
   * Récupère toutes les catégories (Réservé MANAGER)
   */
  async getAllCategories(page: number = 0, size: number = 10): Promise<Page<CategorieResponse>> {
    const response = await api.get<Page<CategorieResponse>>('/categories',{
      params: { page, size }
    })
    return response.data
  },

  /**
   * Récupère une catégorie par son ID
   */
  async getCategorieById(id: number): Promise<CategorieResponse> {
    const response = await api.get<CategorieResponse>(`/categories/${id}`)
    return response.data
  },

  /**
   * Crée une nouvelle catégorie (MANAGER ou TAILOR)
   */
  async createCategorie(request: CategorieRequest): Promise<CategorieResponse> {
    const response = await api.post<CategorieResponse>('/categories', request)
    return response.data
  },

  /**
   * Met à jour une catégorie existante
   */
  async updateCategorie(id: number, request: CategorieRequest): Promise<CategorieResponse> {
    const response = await api.put<CategorieResponse>(`/categories/${id}`, request)
    return response.data
  },
}
