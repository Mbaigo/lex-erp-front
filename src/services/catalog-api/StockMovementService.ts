
import api from '../api'; // Ton instance Axios configurée
import type {
  StockMovementRequest,
  StockMovementResponse,
  PageStockMovement
} from '@/models/stockMovement';

export const stockMovementService = {

  // 🟢 US 3.3 - Création d'un mouvement de stock (Entrée/Sortie)
  async create(movement: StockMovementRequest): Promise<StockMovementResponse> {
    const { data } = await api.post<StockMovementResponse>('/stock-movements', movement);
    return data;
  },

  // 🟢 Récupération de l'historique global (avec filtres optionnels)
  async getHistory(
    page = 0,
    size = 10,
    reference?: string,
    designation?: string
  ): Promise<PageStockMovement> {
    const { data } = await api.get<PageStockMovement>('/stock-movements', {
      params: {
        page,
        size,
        ...(reference && { reference }),     // Ajoute le paramètre seulement s'il est défini
        ...(designation && { designation })
      }
    });
    return data;
  },

  // 🟢 Récupération de l'historique ciblé pour UN seul article (ex: dans un modal de détails)
  async getHistoryByArticleId(
    articleId: number,
    page = 0,
    size = 10
  ): Promise<PageStockMovement> {
    const { data } = await api.get<PageStockMovement>(`/articles/${articleId}/stock-movements`, {
      params: { page, size }
    });
    return data;
  }
};
