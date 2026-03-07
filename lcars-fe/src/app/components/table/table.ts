import { Component, Input, Output, EventEmitter, signal, computed, OnInit, WritableSignal, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppInput } from '../input/input'; 
import { ToggleSwitchComponent } from '../toggle/toggle-switch.component';
import { ConfirmDialogComponent } from '../confirmDialog/confirm.dialog';
import { TronSecurityChecker } from '../../utils/tron-security-checker'; 

// --- Interfaces ---
export interface TableHeader {
  key: string;
  label: string;
  sortable?: boolean;
  editable?: boolean;
}

export interface TableRow {
  [key: string]: any;
  __isEditing?: boolean;
  __originalData?: any;
  __isDerezzing?: boolean; 
  __justRezzed?: boolean;  
}

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, FormsModule, AppInput, ToggleSwitchComponent, ConfirmDialogComponent],
  providers: [DatePipe],
  templateUrl: './table.html',
  styleUrl: './table.scss'
})
export class Table implements OnInit {

  private security = inject(TronSecurityChecker);
  private dataSignal: WritableSignal<TableRow[]> = signal([]);
  
  @Input() showActions: boolean = true;
  @Input() showCopy: boolean = false;
  
  // NEU: Der Input für die benötigte Berechtigung (z.B. 'codymail:action')
  @Input() set requiredAction(action: string | null) {
    this._requiredAction.set(action);
  }
  private _requiredAction = signal<string | null>(null);

  // NEU: Computed Signal zur Prüfung der Rechte
  public canPerformActions = computed(() => {
    const action = this._requiredAction();
    return action ? this.security.hasPermission(action) : true;
  });
  
  @Input()
  set data(value: TableRow[]) {
    this.dataSignal.set(value);
  }
  get data(): TableRow[] {
    return this.dataSignal();
  }

  @Input() headers: TableHeader[] = [];

  @Output() rowUpdate = new EventEmitter<TableRow>();
  @Output() rowDelete = new EventEmitter<TableRow>();

  // Dialog-Steuerung
  showConfirm = signal(false);
  private pendingDeletionRow: TableRow | null = null;

  searchQuery = signal<string>('');
  sortKey = signal<string | null>(null);
  sortDirection = signal<'asc' | 'desc'>('asc');

  processedData = computed<TableRow[]>(() => {
    let currentData = [...this.dataSignal()];
    const query = this.searchQuery().toLowerCase();
    const key = this.sortKey();
    const direction = this.sortDirection();

    if (query) {
      currentData = currentData.filter(row =>
        Object.values(row).some(value =>
          String(value).toLowerCase().includes(query)
        )
      );
    }

    if (key) {
      currentData.sort((a, b) => {
        const aVal = a[key];
        const bVal = b[key];
        
        // Ternary Chain für die Sortierung
        const comparison = typeof aVal === 'string' 
          ? aVal.localeCompare(bVal)
          : (aVal > bVal ? 1 : (aVal < bVal ? -1 : 0));
          
        return direction === 'asc' ? comparison : comparison * -1;
      });
    }

    return currentData;
  });

  hasEditableColumns = computed(() => this.headers.some(h => h.editable));

  constructor(private datePipe: DatePipe) {}

  ngOnInit(): void {
    (this.headers.length > 0 && this.headers[0].sortable !== false) 
      ? this.sortKey.set(this.headers[0].key) 
      : null;
  }

  toggleSort(key: string): void {
    const header = this.headers.find(h => h.key === key);
    if (header?.sortable === false) return;

    this.sortKey() === key 
      ? this.sortDirection.update(dir => (dir === 'asc' ? 'desc' : 'asc'))
      : (this.sortKey.set(key), this.sortDirection.set('asc'));
  }

  startEdit(row: TableRow): void {
    !row.__isEditing 
      ? (row.__originalData = { ...row }, row.__isEditing = true) 
      : null;
  }

  cancelEdit(row: TableRow): void {
    row.__originalData ? (Object.assign(row, row.__originalData), delete row.__originalData) : null;
    row.__isEditing = false;
  }

  saveEdit(row: TableRow): void {
    row.__isEditing = false;
    delete row.__originalData;
    row.__justRezzed = true;
    setTimeout(() => row.__justRezzed = false, 1000);
    this.rowUpdate.emit(row);
  }

  requestDelete(row: TableRow): void {
    this.pendingDeletionRow = row;
    this.showConfirm.set(true); 
  }

  onConfirmDelete(): void {
    this.pendingDeletionRow ? (
      this.showConfirm.set(false),
      this.pendingDeletionRow.__isDerezzing = true,
      setTimeout(() => {
        this.rowDelete.emit(this.pendingDeletionRow!);
        this.pendingDeletionRow = null;
      }, 500)
    ) : null;
  }

  onCancelDelete(): void {
    this.showConfirm.set(false);
    this.pendingDeletionRow = null;
  }

  isEditable(key: string): boolean {
    return !!this.headers.find(h => h.key === key)?.editable;
  }

  public isToggleable(value: any): boolean {
    return value !== null && (typeof value === 'boolean' || value === 0 || value === 1);
  }

  public onToggleChange(row: TableRow, key: string, newValue: number): void {
    row[key] = newValue;
    row.__justRezzed = true;
    setTimeout(() => row.__justRezzed = false, 600);
  }

  copyRow(row: TableRow): void {
    const cleanData = Object.keys(row)
      .filter(key => !key.startsWith('__'))
      .reduce((obj, key) => {
        obj[key] = row[key];
        return obj;
      }, {} as any);
    navigator.clipboard.writeText(JSON.stringify(cleanData, null, 2)).then(() => {
      console.log('Programmdaten in Zwischenspeicher kopiert');
    });
  } 
}