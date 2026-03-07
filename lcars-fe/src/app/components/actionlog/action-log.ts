import { Component, signal, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppDatePicker } from '../datepicker/datepicker';
import { Button } from '../button/button';
import { Card } from '../card/card';
import { Textfield } from '../textfield/textfield';
import { SystemLog } from '../../services/logaction/models/system-log';

@Component({
  selector: 'app-action-log',
  standalone: true,
  imports: [CommonModule, FormsModule, AppDatePicker, Button, Card, Textfield],
  templateUrl: './action-log.html',
  styleUrl: './action-log.scss'
})
export class ActionLogComponent {
  public logs = input<SystemLog[]>([]);
  public filterDate = signal<Date | null>(null);

  public terminalOutput = computed(() => {
    const selectedDate = this.filterDate();
    const allLogs = this.logs() || [];

    const filtered = selectedDate 
      ? allLogs.filter(log => new Date(log.timestamp).toDateString() === selectedDate.toDateString())
      : allLogs;

    return filtered.length === 0 
      ? '> SYSTEM_STATUS: NO_LOGS_FOUND_IN_SECTOR_' 
      : filtered.map(log => {
          const dateObj = new Date(log.timestamp);
          const time = dateObj.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
          
          const type = log.actionType.padEnd(15);
          const ip = (log.ipAddress || 'unknown').padEnd(15);
          
        
          const user = (log.username ? log.username : 'SYSTEM').padEnd(12);
          
          return `[${time}] ${type} | USER: ${user} | IP: ${ip} | ${log.details}`;
        }).join('\n');
  });
}