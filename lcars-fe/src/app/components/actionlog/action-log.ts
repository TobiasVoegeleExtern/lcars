import { Component, signal, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppDatePicker } from '../datepicker/datepicker';
import { Button } from '../button/button';
import { Card } from '../card/card';
import { Textfield } from '../textfield/textfield';


@Component({
  selector: 'app-action-log',
  standalone: true,
  imports: [CommonModule, FormsModule, AppDatePicker, Button, Card, Textfield],
  templateUrl: './action-log.html',
  styleUrl: './action-log.scss'
})
export class ActionLogComponent {
  // Input für die eigentlichen Daten (z.B. vom Go-Backend via WebSocket)
  public rawLogs = input<any[]>([]); 
  
  public filterDate = signal<Date | null>(null);

  // Der berechnete State für dein LCARS-Display
  public terminalOutput = computed(() => {
    const logs = this.rawLogs();
    const selected = this.filterDate();

    // Ternary: Entweder gefiltert oder die gesamte Liste
    const filtered = selected 
      ? logs.filter(log => new Date(log.timestamp).toDateString() === selected.toDateString())
      : logs;

    // Wir geben eine sortierte Liste zurück (neueste oben für das Terminal)
    return filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  });

  // Helper für das LCARS-Feeling
  public getStatusColor = (type: string) => 
    type === 'error' ? 'var(--tron-red)' : 'var(--tron-cyan)';
}