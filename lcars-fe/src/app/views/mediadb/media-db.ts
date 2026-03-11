import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LcarsGraphqlService } from '../../core/services/lcars-graphql.service';
import { MediaCardComponent } from '../../components/mediacard/mediacard';
import { MediaDbFormComponent } from '../../components/media-form/media-db-form.component';

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
  imports: [
    CommonModule, 
    MediaCardComponent, 
    MediaDbFormComponent
  ],
  templateUrl: './media-db.html',
  styleUrls: ['./media-db.scss']
})
export class MediaDbComponent implements OnInit {
  private readonly graphqlService = inject(LcarsGraphqlService);

  // --- STATE SIGNALS ---
  dbStore = signal<MediaRecord[]>([]);
  searchQuery = signal<string>('');
  
  selectedCategory = signal<string | null>(null);
  selectedRecord = signal<MediaRecord | null>(null);
  isCreating = signal<boolean>(false);
  draftRecord = signal<Partial<MediaRecord>>({});

  // --- COMPUTED DATA ---

  /**
   * Erstellt die Directory-Übersicht basierend auf den vorhandenen Datentypen
   */
  categories = computed(() => {
    const records = this.dbStore();
    const groupMap = new Map<string, { name: string, count: number, color: string }>();
    
    records.forEach(r => {
      if (!groupMap.has(r.type)) {
        groupMap.set(r.type, { 
          name: r.type, 
          count: 0, 
          color: this.getCategoryColor(r.type) 
        });
      }
      groupMap.get(r.type)!.count++;
    });
    return Array.from(groupMap.values());
  });

  /**
   * Filtert die Datensätze nach gewählter Kategorie oder Suchanfrage
   */
  filteredRecords = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const category = this.selectedCategory();
    let list = this.dbStore();

    if (category && query === '') {
      list = list.filter(r => r.type === category);
    } else if (query !== '') {
      list = list.filter(r => r.title.toLowerCase().includes(query));
    }
    return list;
  });

  // --- LIFECYCLE ---
  ngOnInit(): void { 
    this.loadData(); 
  }

  // --- DATA LOADING ---
  loadData(): void {
    this.graphqlService.searchEntries(null, 0, 50).subscribe(page => {
      const entries = page?.items || [];
      const mapped: MediaRecord[] = entries.map(entry => ({
        id: entry.identity?.id || 'SYS-ERR',
        title: entry.identity?.systemTag || 'UNNAMED',
        type: (entry.classification?.collectionName as any) || 'DATA',
        status: entry.visual?.activeGlow ? 'ONLINE' : 'ARCHIVED',
        color: entry.visual?.color || '#444444'
      }));
      this.dbStore.set(mapped);
    });
  }

  // --- NAVIGATION & SEARCH ---
  setCategory(cat: string | null) {
    this.selectedCategory.set(cat);
    this.selectedRecord.set(null);
    this.isCreating.set(false);
  }

  updateSearch(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.searchQuery.set(val || '');
  }

  selectRecord(record: MediaRecord) {
    if (this.selectedRecord()?.id === record.id) {
      this.selectedRecord.set(null);
    } else {
      this.isCreating.set(false);
      this.selectedRecord.set(record);
    }
  }

  // --- FORM HANDLERS (EMITTED FROM SUB-COMPONENTS) ---

  /**
   * Verarbeitet Änderungen im "Neu Erstellen" Formular
   */
  handleUpdateDraft(event: { field: string, value: string }) {
    this.draftRecord.update(d => ({ 
      ...d, 
      [event.field]: event.value 
    }));
  }

  /**
   * Verarbeitet Änderungen im "Edit" Formular
   */
  handleUpdateRecord(event: { field: string, value: string }) {
    const cur = this.selectedRecord();
    if (cur) {
      this.selectedRecord.set({ 
        ...cur, 
        [event.field]: event.value 
      });
    }
  }

  // --- CRUD ACTIONS ---
  startCreate() {
    this.selectedRecord.set(null);
    this.isCreating.set(true);
    this.draftRecord.set({ 
      title: '', 
      type: (this.selectedCategory() as any) || 'DATA', 
      status: 'ONLINE',
      color: '#86abff'
    });
  }

  cancelCreate() { 
    this.isCreating.set(false); 
    this.draftRecord.set({});
  }

  insertNewRecord() {
    const draft = this.draftRecord();
    if (!draft.title) return;
    
    this.graphqlService.createEntry({ 
      systemTag: draft.title, 
      collectionName: draft.type 
    }).subscribe(() => {
      this.loadData();
      this.cancelCreate();
    });
  }

  saveRecord() { 
    const record = this.selectedRecord();
    if (record) {
      console.log('UPDATING_RECORD_IN_BACKEND:', record);
      // Hier käme dein GraphQL Update Call hin
      this.selectedRecord.set(null); 
    }
  }

  // --- HELPERS ---
  private getCategoryColor(type: string): string {
    const colors: Record<string, string> = { 
      'AUDIO': '#ff9d00', 
      'VIDEO': '#00f3ff', 
      'HOLO': '#ff003c', 
      'DATA': '#c886ff' 
    };
    return colors[type] || '#86abff';
  }
}