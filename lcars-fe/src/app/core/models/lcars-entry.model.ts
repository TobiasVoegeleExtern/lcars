export interface IdentityTrait {
  id: string;
  systemTag?: string;
}

export interface VisualTrait {
  color?: string;
  icon?: string;
  activeGlow?: boolean;
}

export interface LifecycleTrait {
  created?: string;
  createdBy?: string;
  version?: number;
}

// Das Aggregat
export interface LcarsEntry {
  identity: IdentityTrait;
  visual: VisualTrait;
  lifecycle: LifecycleTrait;
}

// Typ für die Standard-GraphQL-Antwort
export interface GraphQlResponse<T> {
  data?: T;
  errors?: any[];
}

// Neuer Trait
export interface ClassificationTrait {
  collectionName?: string;
  format?: string;
}

// LcarsEntry erweitern
export interface LcarsEntry {
  identity: IdentityTrait;
  visual: VisualTrait;
  lifecycle: LifecycleTrait;
  classification?: ClassificationTrait; // <-- NEU
}

// Pagination & Filter Input
export interface LcarsEntryPage {
  items: LcarsEntry[];
  totalElements: number;
  offset: number;
  limit: number;
  hasNext: boolean;
}

export interface LcarsFilterInput {
  systemTag?: string;
  collectionName?: string;
  format?: string;
  activeGlow?: boolean;
  createdAfter?: string;
}