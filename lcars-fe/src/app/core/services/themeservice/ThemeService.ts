import { Injectable, signal, effect, computed } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  theme = signal<Theme>('light');
  isDarkTheme = computed(() => this.theme() === 'dark');

  constructor() {
    this.initializeTheme();

    effect(() => {
      const isDark = this.isDarkTheme();
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
      document.body.classList.toggle('dark-theme', isDark);
    });
  }

  private initializeTheme(): void {
    const saved = localStorage.getItem('theme') as Theme;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
   
    this.theme.set(saved ? saved : (prefersDark ? 'dark' : 'light'));
  }

  toggleTheme(): void {
    this.theme.update(t => t === 'light' ? 'dark' : 'light');
  }
}

