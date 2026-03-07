import { Component, inject, computed } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeService } from '../../services/themeservice/ThemeService';

import { Dropdown, DropdownItem } from '../../components/dropdown/dropdown';


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


  isMenuOpen = false;

  
  toggleMenu(): void {
    this.isMenuOpen = this.isMenuOpen ? false : true;
  }

 

  closeMenus(): void {
    this.isMenuOpen = false;
  }
}