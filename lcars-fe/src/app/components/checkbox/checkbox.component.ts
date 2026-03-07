import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-checkbox',
  standalone: true,
  imports: [CommonModule],
  template: `
    <label class="checkbox-wrapper" [class.disabled]="disabled">
      <input type="checkbox"
             class="native-checkbox"
             [checked]="checked"
             [disabled]="disabled"
             (change)="onChange($event)">
      
      <div class="custom-checkbox">
        @if (checked) {
          <svg viewBox="0 0 24 24" class="checkmark">
            <path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        }
      </div>
      
      <div class="label-content">
        <ng-content></ng-content>
      </div>
    </label>
  `,
  styles: [`
    :host {
      display: inline-block;
    }

    .checkbox-wrapper {
      display: flex;
      align-items: center;
      gap: 12px;
      cursor: pointer;
      user-select: none;
      position: relative;
    }

    .checkbox-wrapper.disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }

    .native-checkbox {
      position: absolute;
      opacity: 0;
      width: 0;
      height: 0;
    }

    /* Das leere Kästchen */
    .custom-checkbox {
      width: 20px;
      height: 20px;
      border: 1px solid var(--border-color, #1e293b);
      border-radius: 4px;
      background-color: var(--surface-color, #0f172a);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease-in-out;
    }

    /* Hover-Effekt (Neon Glow Rahmen) */
    .checkbox-wrapper:not(.disabled):hover .custom-checkbox {
      border-color: var(--primary-color, #06b6d4);
      box-shadow: 0 0 5px var(--tron-cyan-glow, rgba(6, 182, 212, 0.4));
    }

    /* Angekreuzt-Effekt (Gefüllt + Neon Glow) */
    .native-checkbox:checked ~ .custom-checkbox {
      background-color: var(--primary-color, #06b6d4);
      border-color: var(--primary-color, #06b6d4);
      box-shadow: 0 0 8px var(--tron-cyan-glow, rgba(6, 182, 212, 0.6));
    }

    /* Das Häkchen-Icon */
    .checkmark {
      width: 14px;
      height: 14px;
      color: var(--surface-color, #0f172a); /* Dunkles Icon auf hellem Cyan-Grund */
    }

    /* Der Text daneben */
    .label-content {
      font-size: 0.95rem;
      color: var(--text-color, #f8fafc);
    }
  `]
})
export class AppCheckbox {
  @Input() checked: boolean = false;
  @Input() disabled: boolean = false;
  
  // Wir feuern das Event, sobald sich der Zustand ändert
  @Output() checkedChange = new EventEmitter<boolean>();

  onChange(event: Event) {
    if (this.disabled) return;
    const target = event.target as HTMLInputElement;
    this.checked = target.checked;
    this.checkedChange.emit(this.checked);
  }
}