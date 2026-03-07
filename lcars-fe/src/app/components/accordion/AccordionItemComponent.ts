import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-accordion-item',
  standalone: true,
  imports: [CommonModule], 
  templateUrl: './accordion-item.component.html',
  styleUrl: './accordion-item.component.scss'

})
export class AccordionItemComponent {
 
  /**
   * Wird vom Parent (app-accordion) gesteuert.
   */
  @Input() isOpen: boolean = false;

  /** * Event, das dem Parent (app-accordion) mitteilt: "Ich wurde geklickt!"
   */
  @Output() headerClick = new EventEmitter<void>();

  /**
   * Leitet den Klick an den Parent weiter.
   */
  onHeaderClick(): void {
    this.headerClick.emit();
  }
}
