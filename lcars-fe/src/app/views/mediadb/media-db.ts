import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGrid } from '../../components/form-grid/form-grid';
import { AppInput } from '../../components/input/input';
import { LcarsGraphqlService } from '../../core/services/lcars-graphql.service';
import { LcarsEntry } from '../../core/models/lcars-entry.model'; 

interface MediaRecord {
  id: string;
  title: string;
  type: 'AUDIO' | 'VIDEO' | 'HOLO' | 'DATA';
  status: 'ONLINE' | 'ARCHIVED' | 'ENCRYPTED';
  color: string;
}

@Component({
  selector: 'app-media-db',
  standalone: true,
  imports: [CommonModule, FormGrid, AppInput], 
  templateUrl: './media-db.html',
  styleUrls: ['./media-db.scss']
})
export class MediaDbComponent implements OnInit {
  
  private readonly graphqlService = inject(LcarsGraphqlService);

  dbStore = signal<MediaRecord[]>([]);
  searchQuery = signal<string>('');
  
  // States für UI-Panels
  selectedRecord = signal<MediaRecord | null>(null);
  isCreating = signal<boolean>(false);
  draftRecord = signal<Partial<MediaRecord>>({});

  filteredRecords = computed(() => {
    const query = this.searchQuery().toLowerCase();
    return query === '' 
      ? this.dbStore() 
      : this.dbStore().filter(record => record.title.toLowerCase().includes(query));
  });

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.graphqlService.searchEntries(null, 0, 50).subscribe(page => {
      const entries = page !== null && page.items ? page.items : [];
      const mappedRecords: MediaRecord[] = entries.length > 0 ? entries.map(entry => ({
        id: entry.identity?.id ? entry.identity.id : 'SYS-ERROR',
        title: entry.identity?.systemTag ? entry.identity.systemTag : 'UNNAMED_RECORD',
        type: entry.classification?.collectionName 
            ? (entry.classification.collectionName as 'AUDIO' | 'VIDEO' | 'HOLO' | 'DATA') 
            : 'DATA',
        status: entry.visual?.activeGlow ? 'ONLINE' : 'ARCHIVED',
        color: entry.visual?.color ? entry.visual.color : '#444444'
      })) : [];
      
      this.dbStore.set(mappedRecords);
    });
  }

  updateSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value !== undefined ? this.searchQuery.set(input.value) : this.searchQuery.set('');
  }

  // --- NEUE METHODEN FÜR DAS CREATE-FORMULAR ---

  startCreate(): void {
    // Ternary Execution: Panel resetten und Erstellungs-Modus starten
    this.selectedRecord.set(null);
    this.isCreating.set(true);
    // Voreinstellung für eine neue CD
    this.draftRecord.set({ title: '', type: 'AUDIO', status: 'ONLINE', color: '#86abff' });
  }

  cancelCreate(): void {
    this.isCreating.set(false);
    this.draftRecord.set({});
  }

  updateDraft(field: keyof MediaRecord, event: Event): void {
    const input = event.target as HTMLInputElement;
    // Ternary-Sicherung für den Eingabewert
    const value = input.value !== undefined ? input.value : '';
    this.draftRecord.update(draft => ({ ...draft, [field]: value }));
  }

  insertNewRecord(): void {
  const draft = this.draftRecord();
  
  draft.title === '' || draft.title === undefined ? console.warn('TITLE_REQUIRED') : (() => {
    // Wir bauen das Objekt EXAKT so, wie es der LcarsEntryInput im Java-Backend erwartet
    const payload = {
      systemTag: draft.title,
      collectionName: draft.type || 'AUDIO',
      format: 'CD'
    };

    this.graphqlService.createEntry(payload).subscribe(result => {
      // Ternary: Erfolg ? UI Reset : Fehler-Log
      result !== null 
        ? (() => { this.loadData(); this.cancelCreate(); })() 
        : console.error('INSERT_FAILED_BY_BACKEND');
    });
  })();
}

  // (Deine bisherige selectRecord & saveRecord Logik bleibt für den Edit-Modus erhalten)
  selectRecord(record: MediaRecord): void {
    this.isCreating.set(false);
    this.selectedRecord()?.id === record.id 
      ? this.selectedRecord.set(null) 
      : this.selectedRecord.set(record);
  }
}