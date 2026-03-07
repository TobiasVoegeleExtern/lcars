import { Component, ContentChildren, QueryList, AfterContentInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
// Wir importieren die (gleich zu erstellende) Item-Komponente
import { AccordionItemComponent } from './AccordionItemComponent'; 

@Component({
  selector: 'app-accordion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './accordion.component.html',
  styleUrl: './accordion.scss' // Verwendet dein bestehendes SCSS
})
export class AccordionComponent implements AfterContentInit {

  // Findet alle 'app-accordion-item'-Komponenten, 
  // die per ng-content projiziert wurden.
  @ContentChildren(AccordionItemComponent) items!: QueryList<AccordionItemComponent>;

  // Input, um zu steuern, ob mehrere Items 
  // gleichzeitig geöffnet sein dürfen.
  @Input() multiple: boolean = false;

  ngAfterContentInit() {
    // Sobald alle Items geladen sind, abonnieren wir deren Klick-Events.
    this.items.forEach(item => {
      item.headerClick.subscribe(() => {
        this.toggleItem(item);
      });
    });
  }

  /**
   * Diese Methode verwaltet das Öffnen und Schließen der Items.
   */
  toggleItem(itemToToggle: AccordionItemComponent) {
    if (!this.multiple) {
      // "Single"-Modus: Schließe alle anderen Items
      this.items.forEach(item => {
        if (item !== itemToToggle) {
          item.isOpen = false;
        }
      });
    }

    // Schalte das geklickte Item um (öffnen oder schließen)
    itemToToggle.isOpen = !itemToToggle.isOpen;
  }
}

