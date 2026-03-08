import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-media-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './media-card.html',
  styleUrls: ['./media-card.scss']
})
export class MediaCardComponent {
  // Inputs
  title = input.required<string>();
  type = input.required<string>();
  status = input<string>('');
  color = input<string>('#00f3ff');
  isActive = input<boolean>(false);
  isAlert = input<boolean>(false);
  badgeText = input<string>(''); 

  // Events
  cardClick = output<void>();

  onCardClick() {
    this.cardClick.emit();
  }
}