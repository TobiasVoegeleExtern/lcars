import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

// Definiert die erlaubten Typen für den Status
export type StatusBadgeType = 'on' | 'off' | 'warning';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './status.badge.html',
  styleUrl: './status.badge.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusBadge {
  /**
   * Der Status, der angezeigt werden soll.
   * Akzeptiert: 'on' (grün), 'off' (rot), 'warning' (gelb).
   * Standard: 'off'.
   */
  @Input() status: StatusBadgeType = 'off';
}
