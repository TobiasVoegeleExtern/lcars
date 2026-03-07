import { Injectable, signal, effect, computed } from '@angular/core';

// Definiert die möglichen Theme-Namen
export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root' // Stellt den Service global zur Verfügung
})
export class ThemeService {
  // Ein Signal, das den aktuellen Theme-Zustand hält
  theme = signal<Theme>('light');

  // Ein berechnetes Signal, das immer das Gegenteil des aktuellen Themes anzeigt
  isDarkTheme = computed(() => this.theme() === 'dark');

  constructor() {
    this.initializeTheme();

    // Ein Effekt, der automatisch ausgeführt wird, wenn sich this.theme() ändert
    effect(() => {
      const currentTheme = this.theme();
      // Speichert die Auswahl im Local Storage
      localStorage.setItem('theme', currentTheme);
      // Wendet die CSS-Klasse auf den Body an oder entfernt sie
      if (currentTheme === 'dark') {
        document.body.classList.add('dark-theme');
      } else {
        document.body.classList.remove('dark-theme');
      }
    });
  }

  /**
   * Initialisiert das Theme basierend auf Local Storage oder Systemeinstellungen.
   */
  private initializeTheme(): void {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedTheme) {
      this.theme.set(savedTheme);
    } else {
      // Wenn nichts gespeichert ist, die Systemeinstellung prüfen
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.theme.set(prefersDark ? 'dark' : 'light');
    }
  }

  /**
   * Schaltet zwischen Light- und Dark-Mode um.
   */
  toggleTheme(): void {
    this.theme.update(currentTheme => (currentTheme === 'light' ? 'dark' : 'light'));
  }
}

