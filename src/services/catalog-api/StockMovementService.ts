import api from '../api' // Chemin vers ton instance Axios configurée (qui inclut sûrement déjà baseURL: '/api/v1')
import type {
  StockMovementRequestDTO,
  StockMovementResponseDTO,
  PageStockMovement,
} from '@/models/stockMovement'

export const stockMovementService = {
  /**
   * Crée un nouveau mouvement de stock (Entrée ou Sortie)
   * CORRESPOND À : POST /api/v1/stock-movements
   */
  async createMovement(dto: StockMovementRequestDTO): Promise<StockMovementResponseDTO> {
    const { data } = await api.post<StockMovementResponseDTO>('/stock-movements', dto)
    console.log
    return data
  },

  /**
   * Récupère l'historique global des mouvements avec filtres optionnels et pagination
   * CORRESPOND À : GET /api/v1/stock-movements
   */
  async getHistory(
    page: number = 0,
    size: number = 10,
    articleId?: number,
  ): Promise<PageStockMovement> {
    const { data } = await api.get<PageStockMovement>('/stock-movements', {
      params: {
        page,
        size,
        // L'opérateur de décomposition conditionnelle permet de n'envoyer
        // les paramètres de filtre que s'ils sont définis et non vides
        ...(articleId && { articleId }),
      },
    })
    return data
  },

  async getHistoryAll(
    page: number = 0,
    size: number = 10,
    reference?: string,
    designation?: string,
  ): Promise<PageStockMovement> {
    const { data } = await api.get<PageStockMovement>('/stock-movements/Alls', {
      params: {
        page,
        size,
        // L'opérateur de décomposition conditionnelle permet de n'envoyer
        // les paramètres de filtre que s'ils sont définis et non vides
        ...(reference && reference.trim() !== '' && { reference }),
        ...(designation && designation.trim() !== '' && { designation }),
      },
    })
    return data
  },
}
