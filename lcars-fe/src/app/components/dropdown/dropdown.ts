import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common'; // Für *ngFor und *ngIf
import { FormsModule } from '@angular/forms'; // Optional: für erweiterte Formularbehandlung

// Sie können ein generisches Interface verwenden, um die Struktur zu definieren
export interface DropdownItem {
  id: string | number;
  name: string;
}

@Component({
  selector: 'app-dropdown',
  standalone: true, 
  imports: [
    CommonModule, 
    FormsModule  
  ],
  templateUrl: './dropdown.html',
  styleUrl: './dropdown.scss'
})
export class Dropdown {
  @Input() label: string = '';
  /** Das Array mit den Daten, z.B. von einer REST-Schnittstelle. */
  @Input() items: DropdownItem[] = [];
  
  /** Das aktuell ausgewählte Element. */
  @Input() selectedItem: DropdownItem | null = null;
  
  /** Event, das ausgelöst wird, wenn ein Element ausgewählt wurde. */
  @Output() itemSelect = new EventEmitter<DropdownItem>();

  isMenuOpen: boolean = false;

  /**
   * Schaltet den Dropdown-Zustand um.
   */
  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  /**
   * Wählt ein Element aus und schließt das Menü.
   * @param item Das ausgewählte Element.
   */
  selectItem(item: DropdownItem): void {
    this.selectedItem = item;
    this.itemSelect.emit(item);
    this.isMenuOpen = false;
  }
}