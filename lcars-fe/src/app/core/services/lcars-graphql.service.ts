import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { 
  LcarsEntry, 
  GraphQlResponse, 
  LcarsEntryPage, 
  LcarsFilterInput 
} from '../models/lcars-entry.model.js'; // Endung je nach Projekt

@Injectable({
  providedIn: 'root'
})
export class LcarsGraphqlService {
  
  private readonly apiUrl = window.location.port === '4200' 
    ? '/graphql' 
    : 'http://localhost:8080/graphql';
  private readonly http = inject(HttpClient);

  /**
   * 1. READ SINGLE: Holt einen LCARS-Eintrag anhand seiner UUID
   */
  getEntry(id: string): Observable<LcarsEntry | null> {
    const query = `
      query GetEntry($id: ID!) {
        getEntry(id: $id) {
          identity { id systemTag }
          lifecycle { created createdBy version }
          classification { collectionName format }
        }
      }
    `;

    return this.http.post<GraphQlResponse<{ getEntry: LcarsEntry }>>(
      this.apiUrl, 
      { query, variables: { id } }
    ).pipe(
      map(response => response.data && response.data.getEntry ? response.data.getEntry : null)
    );
  }

  /**
   * 2. READ PAGINATED: Dynamische Suche mit Filtern, Offset und Limit
   */
  searchEntries(
    filter: LcarsFilterInput | null = null, 
    offset: number = 0, 
    limit: number = 50
  ): Observable<LcarsEntryPage | null> {
    const query = `
      query SearchEntries($filter: LcarsFilterInput, $offset: Int, $limit: Int) {
        searchEntries(filter: $filter, offset: $offset, limit: $limit) {
          items {
            identity { id systemTag }
            lifecycle { created createdBy version }
            classification { collectionName format }
          }
          totalElements
          offset
          limit
          hasNext
        }
      }
    `;

    return this.http.post<GraphQlResponse<{ searchEntries: LcarsEntryPage }>>(
      this.apiUrl, 
      { query, variables: { filter, offset, limit } }
    ).pipe(
      map(response => response.data && response.data.searchEntries ? response.data.searchEntries : null)
    );
  }

  /**
   * 3. CREATE: Sendet einen neuen Eintrag an das Backend
   */
  createEntry(entryInput: any): Observable<LcarsEntry | null> {
    const mutation = `
      mutation CreateLcarsEntry($input: LcarsEntryInput!) {
        createEntry(input: $input) {
          identity { id systemTag }
          classification { collectionName format }
        }
      }
    `;

    return this.http.post<GraphQlResponse<{ createEntry: LcarsEntry }>>(
      this.apiUrl, 
      { query: mutation, variables: { input: entryInput } }
    ).pipe(
      map(response => response.data && response.data.createEntry ? response.data.createEntry : null)
    );
  }

  /**
   * 4. UPDATE: Aktualisiert einen bestehenden Eintrag
   */
  updateEntry(id: string, entryInput: any): Observable<LcarsEntry | null> {
    const mutation = `
      mutation UpdateLcarsEntry($id: ID!, $input: LcarsEntryInput!) {
        updateEntry(id: $id, input: $input) {
          identity { id systemTag }
          visual { color activeGlow }
          classification { collectionName format }
        }
      }
    `;

    return this.http.post<GraphQlResponse<{ updateEntry: LcarsEntry }>>(
      this.apiUrl, 
      { query: mutation, variables: { id, input: entryInput } }
    ).pipe(
      map(response => response.data && response.data.updateEntry ? response.data.updateEntry : null)
    );
  }

  /**
   * 5. DELETE: Löscht einen Eintrag hart aus der Datenbank
   */
  deleteEntry(id: string): Observable<boolean> {
    const mutation = `
      mutation DeleteLcarsEntry($id: ID!) {
        deleteEntry(id: $id)
      }
    `;

    return this.http.post<GraphQlResponse<{ deleteEntry: boolean }>>(
      this.apiUrl, 
      { query: mutation, variables: { id } }
    ).pipe(
      // Ternary Operator prüft explizit auf true
      map(response => response.data && response.data.deleteEntry === true ? true : false)
    );
  }
  
  // Ternary Hilfsmethode für das UI
  isSystemActive(entry: LcarsEntry): boolean {
    return entry.visual?.activeGlow ? true : false;
  }
}