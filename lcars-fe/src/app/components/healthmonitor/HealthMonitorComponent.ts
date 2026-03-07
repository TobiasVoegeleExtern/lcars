import { Component, Input, computed, Signal } from '@angular/core';
import { CommonModule } from '@angular/common'; 

// Importiert die UI-Komponenten, die wir benötigen
// (Pfade ggf. anpassen, basierend auf Ihrer Projektstruktur)
import { StatusBadge, StatusBadgeType } from '../../components/badge/StatusBadge';
import { AccordionComponent } from '../../components/accordion/AccordionComponent';
import { AccordionItemComponent } from '../../components/accordion/AccordionItemComponent'; 

/**
 * Definiert die Datenstruktur für einen einzelnen Check (z.B. DB, Cache).
 */
export interface HealthCheckItem {
  title: string;
  status: 'UP' | 'DOWN' | 'WARNING';
  details?: string | null;
}

/**
 * Definiert die Datenstruktur für eine komplette Umgebung (z.B. Dev, Staging).
 */
export interface HealthEnvironment {
  title: string;
  checks: HealthCheckItem[];
}

@Component({
  selector: 'app-health-monitor', 
  standalone: true,   
  providers: [], 
  imports: [
    CommonModule, 
    StatusBadge,

    AccordionComponent,
    AccordionItemComponent,
  ],
  templateUrl: './health-monitor.component.html',
  
})
export class HealthMonitorComponent {
  
  /**
   * Die Komponente nimmt eine Liste von Umgebungen als Input entgegen.
   */
  @Input({ required: true }) environments: HealthEnvironment[] = [];

  /**
   * Hilfsfunktion: Berechnet den Gesamtstatus für ein Environment.
  
   * - UP (on): Nur wenn ALLE Checks 'UP' sind.
   * - DOWN (off): Nur wenn ALLE Checks 'DOWN' sind.
   * - WARNING (warning): In allen anderen Fällen (z.B. gemischte Status).
   */
  getOverallEnvStatus(env: HealthEnvironment): StatusBadgeType {
    const statuses = env.checks.map(c => c.status);

    if (statuses.length === 0) {
      return 'on'; // Leere Umgebung ist 'on'
    }

    // UP: Nur wenn alle 'UP' sind
    if (statuses.every(s => s === 'UP')) {
      return 'on';
    }

    // DOWN: Nur wenn alle 'DOWN' sind
    if (statuses.every(s => s === 'DOWN')) {
      return 'off';
    }

    // WARNING: Für alle gemischten Zustände (1 Down, 1 Warning, etc.)
    return 'warning';
  }

  /**
   *  Wandelt den Status-String W
   * in den Typ um, den <app-status-badge> erwartet.
   */
  getBadgeStatus(status: 'UP' | 'DOWN' | 'WARNING'): StatusBadgeType {
    switch (status) {
      case 'UP':
        return 'on';
      case 'DOWN':
        return 'off';
      case 'WARNING':
        return 'warning';
      default:
        return 'warning'; 
    }
  }

  /**
   * Hilfsfunktion: Sucht nach dem ersten Fehlerdetail in den Checks,
   * das im Titel angezeigt werden soll.
   */
  getEnvironmentError(env: HealthEnvironment): string | null {
    // Findet den ersten Check, der 'DOWN' ist und Details hat
    const downCheck = env.checks.find(c => c.status === 'DOWN' && c.details);
    if (downCheck) {
      return downCheck.details!;
    }

    // Findet den ersten Check, der 'WARNING' ist und Details hat
    const warningCheck = env.checks.find(c => c.status === 'WARNING' && c.details);
    if (warningCheck) {
      return warningCheck.details!;
    }
    
    return null; 
  }

  /**
   * GEÄNDERTE HILFSFUNKTION (basierend auf Ihrer Anforderung):
   * Prüft, ob ein Environment standardmäßig geöffnet sein soll.
   * REGEL: Geöffnet, wenn der (neue) Gesamtstatus 'DOWN' oder 'WARNING' ist.
   */
  isAccordionOpen(env: HealthEnvironment): boolean {
    // Ruft die neue Logik für den Gesamtstatus ab
    const overallStatus = this.getOverallEnvStatus(env);
    
    // true, wenn das Ergebnis 'off' (DOWN) oder 'warning' (WARNING) ist
    return overallStatus === 'off' || overallStatus === 'warning';
  }
}

