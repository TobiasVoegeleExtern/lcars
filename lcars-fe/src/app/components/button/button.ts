import { Component, Input, booleanAttribute, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TronSecurityChecker } from '../../utils/tron-security-checker'; 

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.html',
  styleUrl: './button.scss'
})
export class Button {
  private security = inject(TronSecurityChecker);

  @Input() variant: 'filled' | 'stroked' = 'filled';
  @Input({ transform: booleanAttribute }) disabled: boolean = false;

  /**
   * Wenn gesetzt, wird geprüft, ob der User diese Permission hat.
   * Falls nicht, wird der Button gar nicht erst gerendert (DOM-Ebene).
   */
  @Input() action: string | null = null;

  // Logik zur Sichtbarkeit
  public isVisible = computed(() => {
    if (!this.action) return true; 
    return this.security.hasPermission(this.action);
  });
}