export interface FicheMesureResponseDTO {
  id: number
  clientId: number
  nomProjet: string
  datePrise: string
  valeurs: Record<string, number>
}
export interface FicheMesureRequestDTO {
  clientId: number
  nomProjet: string
  datePrise: string
  valeurs: Record<string, number>
}
// Client DTOs

export interface ClientRequestDTO {
  nom: string
  prenom: string
  telephone: string
  email?: string
  genre?: Genre
  notesMorphologie?: string
  adresse?: string
}

export interface ClientResponseDTO extends ClientRequestDTO {
  id: number
  dateCreation: string
}

export enum Genre {
  HOMME = 'HOMME',
  FEMME = 'FEMME',
  ADO = 'ADO',
  ENFANT = 'ENFANT',
}

export interface Page<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
}
