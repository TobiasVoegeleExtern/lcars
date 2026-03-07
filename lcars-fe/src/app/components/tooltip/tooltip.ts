import { Component, Input, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common'; // Für *ngIf

@Component({
  selector: 'app-tooltip',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tooltip.html',
  styleUrl: './tooltip.scss'
})
export class Tooltip {

  /** Der Text, der im Tooltip angezeigt wird. */
  @Input({ required: true }) text: string = '';

  /** Die Position des Tooltips relativ zum Elternelement. */
  @Input() position: 'top' | 'bottom' | 'left' | 'right' = 'top';

  /** Der Zustand, ob der Tooltip angezeigt wird. */
  isVisible = signal(false);

  /**
   * Stellt den Tooltip auf sichtbar (z.B. bei mouseenter).
   */
  @HostListener('mouseenter')
  onMouseEnter() {
    this.isVisible.set(true);
  }

  /**
   * Stellt den Tooltip auf unsichtbar (z.B. bei mouseleave).
   */
  @HostListener('mouseleave')
  onMouseLeave() {
    this.isVisible.set(false);
  }
}