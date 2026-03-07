import { Component, ChangeDetectionStrategy, model, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

let uniqueIdCounter = 0;

@Component({
  selector: 'app-toggle-switch',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toggle-switch.component.html',
  styleUrls: ['./toggle-switch.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToggleSwitchComponent {
  /**
   * Das Model-Signal (Zwei-Wege-Binding). 
   * Wir initialisieren es mit 0.
   */
  public checked = model<number>(0);

  /**
   * Reaktiv berechneter Status für das Template.
   * Da checked() nun ein Signal ist, funktioniert dieser computed() Block wieder.
   */
  protected internalChecked = computed<boolean>(() => this.checked() === 1);

  public label = input<string>('');
  public disabled = input<boolean>(false);

  public readonly uniqueId = `toggle-switch-${uniqueIdCounter++}`;

  /**
   * Interner Change-Handler vom HTML-Input.
   * Hier nutzen wir nun korrekt .set() auf dem Model-Signal.
   */
  protected onInternalChange(newBooleanValue: boolean): void {
    if (!this.disabled()) {
      this.checked.set(newBooleanValue ? 1 : 0);
    }
  }
}