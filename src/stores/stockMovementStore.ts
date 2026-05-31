import { defineStore } from 'pinia'
import { stockMovementService } from '@/services/catalog-api/StockMovementService'
import { useArticleStore } from '@/stores/articleStore'
import type { StockMovementRequestDTO, StockMovementResponseDTO } from '@/models/stockMovement'

export const useStockMovementStore = defineStore('stockMovements', {
  state: () => ({
    movements: [] as StockMovementResponseDTO[],
    totalElements: 0,
    loading: false,
  }),

  actions: {
    // 🟢 Charger l'historique global
    async fetchHistory(page: number, size: number, reference?: string, designation?: string) {
      this.loading = true
      try {
        const data = await stockMovementService.getHistoryAll(page, size, reference, designation)
        this.movements = data.content
        this.totalElements = data.totalElements
      } finally {
        this.loading = false
      }
    },

    // 🟢 Charger l'historique d'un article spécifique
    // Modifié pour utiliser la 'reference' afin de matcher avec le @GetMapping du contrôleur Java
    async fetchArticleHistory(reference: number, page: number, size: number) {
      this.loading = true
      try {
        const data = await stockMovementService.getHistory(page, size, reference)
        this.movements = data.content
        this.totalElements = data.totalElements
      } finally {
        this.loading = false
      }
    },

    // 🟢 Traiter un nouveau mouvement (Depuis le modal de mouvement de stock)
    async processStockMovement(request: StockMovementRequestDTO) {
      this.loading = true
      try {
        // Appel au nom exact de la méthode définie dans le service Axios
        const newMovement = await stockMovementService.createMovement(request)

        const articleStore = useArticleStore()
        const articleIndex = articleStore.articles.findIndex((a) => a.id === request.articleId)

        if (articleIndex !== -1) {
          const article = articleStore.articles[articleIndex]
          if (article) {
            // 🔥 NOUVELLE RÈGLE MÉTIER APPLIQUÉE LOCALEMENT 🔥

            // 1. Le stock initial prend la valeur de l'ancien stock actuel
            article.stockInitial = article.stockActuel

            // 2. Le stock actuel prend la nouvelle valeur après opération
            article.stockActuel = newMovement.stockApresOperation

            // 3. Incrémentation de la version pour rester synchrone avec @Version d'Hibernate
            article.version = (article.version || 0) + 1
          }
        }

        // Optionnel : Recharger les alertes de stock après un mouvement si tu as une méthode dédiée
        // await articleStore.fetchAlerts();

        return newMovement
      } finally {
        this.loading = false
      }
    },
  },
})
