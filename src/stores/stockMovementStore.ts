import { defineStore } from 'pinia';
import { stockMovementService } from '@/services/catalog-api/StockMovementService';
import { useArticleStore } from '@/stores/articleStore'; // Pour rafraîchir les articles après un mouvement
import type { StockMovementRequest, StockMovementResponse } from '@/models/stockMovement';

export const useStockMovementStore = defineStore('stockMovements', {
  state: () => ({
    movements: [] as StockMovementResponse[],
    totalElements: 0,
    loading: false,
  }),

  actions: {
    // 🟢 Charger l'historique global
    async fetchHistory(page: number, size: number, reference?: string, designation?: string) {
      this.loading = true;
      try {
        const data = await stockMovementService.getHistory(page, size, reference, designation);
        this.movements = data.content;
        this.totalElements = data.totalElements;
      } finally {
        this.loading = false;
      }
    },

    // 🟢 Charger l'historique d'un article spécifique
    async fetchArticleHistory(articleId: number, page: number, size: number) {
      this.loading = true;
      try {
        const data = await stockMovementService.getHistoryByArticleId(articleId, page, size);
        this.movements = data.content;
        this.totalElements = data.totalElements;
      } finally {
        this.loading = false;
      }
    },

    // 🟢 Traiter un nouveau mouvement (Depuis le modal de mouvement de stock)
    async processStockMovement(request: StockMovementRequest) {
      this.loading = true;
      try {
        const newMovement = await stockMovementService.create(request);

        // 💡 L'astuce du Lead : Mettre à jour le store des articles pour que la liste principale
        // affiche le nouveau stock calculé par la BDD sans avoir à recharger toute la page !
        const articleStore = useArticleStore();
        const articleIndex = articleStore.articles.findIndex(a => a.id === request.articleId);

        if (articleIndex !== -1) {
          const article = articleStore.articles[articleIndex];
          if (article) {
            // On met à jour le stock de l'article localement avec le "stockApresOperation"
            // renvoyé par le backend. C'est instantané pour l'utilisateur.
            article.stockActuel = newMovement.stockApresOperation;
          }
        }

        // Optionnel : Recharger les alertes de stock après un mouvement
        await articleStore.fetchAlerts();

        return newMovement;
      } finally {
        this.loading = false;
      }
    }
  }
});
