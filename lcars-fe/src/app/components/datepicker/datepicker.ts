import { Component, Input, Output, EventEmitter, signal, computed, model } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';

registerLocaleData(localeDe);

@Component({
  selector: 'app-date-picker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './datepicker.html',
  styleUrl: './datepicker.scss'
})
export class AppDatePicker {
  @Input() label?: string;
  value = model<Date | null>(null);
  isMenuOpen = signal(false);
  viewDate = signal(new Date()); 

  // Dein geliebter Ternary für eine saubere Anzeige
  formattedDate = computed(() => {
    const d = this.value();
    return d ? d.toLocaleDateString('de-DE') : '';
  });

  // Wichtig für das LCARS-Grid: Korrekte Positionierung der Tage
  daysInMonth = computed(() => {
    const d = this.viewDate();
    const year = d.getFullYear();
    const month = d.getMonth();
    
    const firstDayIndex = new Date(year, month, 1).getDay();
    // Umwandlung US-Woche (So=0) zu EU-Woche (Mo=0):
    const offset = firstDayIndex === 0 ? 6 : firstDayIndex - 1;
    
    const lastDay = new Date(year, month + 1, 0).getDate();
    
    // Wir geben ein Array zurück, das vorne mit nulls aufgefüllt ist
    const days: (Date | null)[] = Array(offset).fill(null);
    for (let i = 1; i <= lastDay; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  });

  // Ternary Helper für Template
  isSelected = (day: Date | null): boolean => 
    day && this.value() ? day.getTime() === this.value()?.getTime() : false;

  toggleMenu = (): void => this.isMenuOpen.update(v => !v);

  selectDate(d: Date | null): void {
    if (!d) return;
    this.value.set(d);
    this.isMenuOpen.set(false);
  }

  changeMonth = (delta: number): void => 
    this.viewDate.update(d => new Date(d.getFullYear(), d.getMonth() + delta, 1));
}