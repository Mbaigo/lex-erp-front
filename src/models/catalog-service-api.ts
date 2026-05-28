export interface CategorieRequest {
  code?: string // min: 2, max: 50
  nom?: string // max: 100
  description?: string // max: 255
}

export interface CategorieResponse {
  id: number
  code?: string
  nom?: string
  description?: string
}

export interface ArticleRequest {
  reference: string // max: 50
  designation: string // max: 150
  stockInitial: number // Remplace "stockInitial" (min: 0)
  prixUnitaire: number // min: 0
  seuilAlerte: number // min: 0
  uniteMesure: string // ex: 'METRE', 'PIECE', 'LITRE'
  categorieId: number
  version?: number // Optionnel à la création, requis à la mise à jour pour le verrouillage optimiste
}

export interface ArticleResponse {
  id: number
  reference: string
  designation: string
  stockActuel: number // Remplace "stockInitial" (min: 0)
  prixUnitaire: number // min: 0
  seuilAlerte: number // min: 0
  uniteMesure: string // ex: 'METRE', 'PIECE', 'LITRE'
  enAlerte: boolean // Calculé par le backend
  version: number // Crucial pour l'US 3.3 (Optimistic Locking)

  // -- Côté relation Catégorie --
  // Si ton Backend (MapStruct) renvoie un objet imbriqué :
  categorie?: CategorieResponse

  // OU BIEN, si ton MapStruct renvoie des champs à plat (comme on l'avait configuré plus tôt) :
  categorieId?: number
  categorieNom?: string
}

export interface RestockItemRequest {
  articleId: number
  quantite: number
}

export interface LigneNomenclatureRequest {
  articleId: number
  quantiteNecessaire: number // min: 0
}

export interface LigneNomenclatureResponse {
  id: number
  article: ArticleResponse
  quantiteNecessaire: number
  coutLigne: number // Calculé : Quantité * Prix Achat
}

export interface ModeleRequest {
  reference: string
  nom: string
  description?: string
  coutMainOeuvre: number // min: 0
  lignes: LigneNomenclatureRequest[] // Au moins 1 ligne
  imageUrl: string // Au moins 1 image
}

export interface ModeleResponse {
  id: number
  reference: string
  nom: string
  description: string
  coutMainOeuvre: number
  coutDeBase: number // Calculé : Main d'oeuvre + Somme des coutLigne
  lignesNomenclature: LigneNomenclatureResponse[]
  imageUrl: string
}

export interface StockMovementRequest {
  quantite: number
  isDebit: boolean
  motif?: string // Optionnel si tu ne l'utilises pas encore systématiquement
}

export interface Page<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
  last: boolean
  first: boolean
}
