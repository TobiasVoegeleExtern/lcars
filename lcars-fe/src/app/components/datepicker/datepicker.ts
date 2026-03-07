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
  
  // Nutze model() für einfaches Two-Way-Binding (Angular 17.2+)
  // Falls älter: nutze value = signal<Date | null>(null)
  value = model<Date | null>(null);

  isMenuOpen = signal(false);
  viewDate = signal(new Date()); 

  // Jetzt reagiert formattedDate, da value() ein Signal ist
  formattedDate = computed(() => 
    this.value() 
      ? `${this.value()?.getDate().toString().padStart(2, '0')}.${(this.value()!.getMonth() + 1).toString().padStart(2, '0')}.${this.value()?.getFullYear()}`
      : ''
  );

  daysInMonth = computed(() => {
    const d = this.viewDate();
    const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    return Array.from({ length: lastDay }, (_, i) => new Date(d.getFullYear(), d.getMonth(), i + 1));
  });

  toggleMenu = (): void => this.isMenuOpen.update(v => !v);

  selectDate(d: Date): void {
    // .set() triggert die computed-Updates
    this.value.set(d);
    this.isMenuOpen.set(false);
  }

  changeMonth(delta: number): void {
    const current = this.viewDate();
    this.viewDate.set(new Date(current.getFullYear(), current.getMonth() + delta, 1));
  }

  // Hilfsmethode für das Template-Highlighting
  isSelected(day: Date): boolean {
    const current = this.value();
    return current ? current.getTime() === day.getTime() : false;
  }
}