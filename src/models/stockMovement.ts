// On aligne l'Enum TypeScript avec celui du Backend
export type TypeMovementEnum = 'ENTREE' | 'SORTIE'

// ---------------------------------------------------------
// DTO POUR L'ENVOI (Création d'un mouvement depuis le modal)
// ---------------------------------------------------------
export interface StockMovementRequest {
  articleId: number
  quantite: number
  type: TypeMovementEnum
  prixUnitaire?: number // Optionnel (utile surtout pour les entrées/achats)
  motif?: string // Optionnel
  dateOperation?: string // Format YYYY-MM-DD. Si omis, le backend prendra la date du jour.
}

// ---------------------------------------------------------
// DTO POUR LA LECTURE (Affichage de l'historique dans un tableau)
// ---------------------------------------------------------
export interface StockMovementResponse {
  id: number

  // Données aplaties de l'article (gérées par MapStruct)
  articleId: number
  articleReference: string
  articleDesignation: string

  // Données du mouvement
  quantite: number
  type: TypeMovementEnum
  prixUnitaire: number | null
  priceTotal: number // Calculé par le @AfterMapping
  motif: string | null
  dateOperation: string // Format YYYY-MM-DD
  createdAt: string
  // Audit et Historique
  stockAvantOperation: number
  stockApresOperation: number // Format DateTime (ISO)
}

// ---------------------------------------------------------
// INTERFACE DE PAGINATION (Si tu utilises un composant standard)
// ---------------------------------------------------------
export interface PageStockMovement {
  content: StockMovementResponse[]
  totalElements: number
  totalPages: number
  size: number
  number: number
}
