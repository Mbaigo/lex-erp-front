import { defineStore } from 'pinia';
import { articleService } from '@/services/catalog-api/ArticleService';
import type { ArticleResponse, RestockItemRequest } from '@/models/catalog-service-api'

export const useArticleStore = defineStore('articles', {
  state: () => ({
    articles: [] as ArticleResponse[],
    alertes: [] as ArticleResponse[],
    totalElements: 0,
    loading: false
  }),

  actions: {
    async fetchArticles(page: number, size: number) {
      this.loading = true;
      try {
        const data = await articleService.getAll(page, size);
        this.articles = data.content;
        this.totalElements = data.totalElements;
      } finally {
        this.loading = false;
      }
    },

    async fetchAlerts() {
      this.alertes = await articleService.getAlerts();
    },

    // --- AJOUTE CETTE MÉTHODE QUI MANQUAIT ---
    async processStockMovement(ref: string, qty: number, isDebit: boolean) {
      this.loading = true;
      try {
        const movement = { quantite: qty, isDebit: isDebit, motif: '' };
        const updated = await articleService.updateStock(ref, movement);

        // Mise à jour réactive de la liste locale
        const index = this.articles.findIndex((a) => a.reference === ref);
        if (index !== -1) {
          this.articles[index] = updated;
        }
        await this.fetchAlerts();
      } finally {
        this.loading = false;
      }
    },

    async restoreStockAfterCancellation(items: RestockItemRequest[]) {
      this.loading = true;
      try {
        await articleService.restockBatch(items);
        await this.fetchAlerts();
        // Optionnel: recharger la page courante pour voir les chiffres bouger
      } finally {
        this.loading = false;
      }
    }
  }
});
