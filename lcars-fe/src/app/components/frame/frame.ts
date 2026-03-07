import { Component, inject, computed } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeService } from '../../services/themeservice/ThemeService';
import { MicroserviceStateService } from '../../services/microserviceStateService/MicroserviceStateService';
import { Dropdown, DropdownItem } from '../../components/dropdown/dropdown';
import { AuthStore } from '../../store/auth.store';

@Component({
  selector: 'app-frame',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet, 
    RouterLink, 
    RouterLinkActive, 
    Dropdown 
  ],
  templateUrl: './frame.html',
  styleUrls: ['./frame.scss']
})
export class FrameComponent {

  public themeService = inject(ThemeService);
  public microserviceState = inject(MicroserviceStateService);
  public authStore = inject(AuthStore);

  isMenuOpen = false;

  /**
   * Computed Signal, um das aktuell ausgewählte Service-Objekt zu finden.
   */
  selectedService = computed<DropdownItem | null>(() => {
    const selectedId = this.microserviceState.selectedServiceId();
    
    // FIX: availableServices() mit Klammern aufrufen, da es jetzt ein Signal ist!
    const foundService = this.microserviceState.availableServices().find(s => s.id === selectedId);
    
    // Saubere Ternary-Rückgabe
    return foundService ? (foundService as unknown as DropdownItem) : null;
  });

  toggleMenu(): void {
    this.isMenuOpen = this.isMenuOpen ? false : true;
  }

  selectService(item: DropdownItem): void {
    item.id 
      ? (this.microserviceState.setSelectedService(String(item.id)), this.closeMenus())
      : null;
  }

  closeMenus(): void {
    this.isMenuOpen = false;
  }
}