
import api from '../api' // Ton instance axios configurée
import type { ArticleRequest, ArticleResponse, Page, StockMovementRequest, RestockItemRequest } from '@/models/catalog-service-api'

export const articleService = {
  // US 3.1 - Création
  async create(article: ArticleRequest): Promise<ArticleResponse> {
    const { data } = await api.post<ArticleResponse>('/articles', article);
    return data;
  },

  // US 3.2 - Alertes
  async getAlerts(): Promise<ArticleResponse[]> {
    const { data } = await api.get<ArticleResponse[]>(`/articles/alertes`);
    return data;
  },

  // US 3.3 - Mouvement de stock
  async updateStock(reference: string, movement: StockMovementRequest): Promise<ArticleResponse> {
    const { data } = await api.patch<ArticleResponse>(
      `/articles/${reference}/stock`,
      movement // L'objet est envoyé ici comme corps de la requête (Body)
    );
    return data;
  },

  // Liste paginée
  async getAll(page = 0, size = 5): Promise<Page<ArticleResponse>> {
    const { data } = await api.get('/articles', { params: { page, size } });
    return data; // Spring Page object
  },

  // Récupération par lot (batch)
  async getBatch(ids: number[]): Promise<ArticleResponse[]> {
    const { data } = await api.post<ArticleResponse[]>(`/articles/batch`, ids);
    return data;
  },
  // US 6.2 - Restockage suite à annulation commande
  async restockBatch(items: RestockItemRequest[]) {
    await api.post('/api/v1/articles/stock/restock-batch', items);
  }
};
