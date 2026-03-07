import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeService } from '../../services/themeservice/ThemeService';

@Component({
  selector: 'app-frame',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet, 
    RouterLink, 
    RouterLinkActive 
  ],
  templateUrl: './frame.html',
  styleUrls: ['./frame.scss']
})
export class FrameComponent {
  public themeService = inject(ThemeService);

  isMenuOpen = false;

  toggleMenu(): void {
    // Ternary-Einsatz für den Toggle
    this.isMenuOpen = this.isMenuOpen ? false : true;
  }

  closeMenus(): void {
    this.isMenuOpen = false;
  }
}