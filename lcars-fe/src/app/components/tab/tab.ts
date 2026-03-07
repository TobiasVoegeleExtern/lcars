import { Component, Input, signal, OnInit } from '@angular/core'; // OnInit importieren
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';

export interface TabItem {
  key: string;      
  label: string;   
}

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tabs.html',
  styleUrl: './tabs.scss'
})
// OnInit implementieren
export class Tabs implements OnInit {

  @Input({ required: true }) tabs: TabItem[] = [];
  activeKey = signal<string | null>(null);

  // Der constructor mit afterNextRender wird nicht mehr benötigt.

  /**
   * KORREKTUR: ngOnInit wird verwendet, um den initialen Zustand zu setzen.
   * Das ist der Standardweg in Angular und robuster.
   */
  ngOnInit(): void {
    // Wenn es Tabs gibt und noch keiner aktiv ist, setze den ersten als aktiv.
    if (this.tabs.length > 0 && !this.activeKey()) {
      this.activeKey.set(this.tabs[0].key);
    }
  }

  /**
   * Wird aufgerufen, um den aktiven Tab zu wechseln.
   */
  setActive(key: string): void {
    this.activeKey.set(key);
  }
}
