import { WritableSignal, ChangeDetectorRef } from '@angular/core';
import { AlertType } from '../components/alert/AlertComponent'; 

/**
 * Zeigt eine temporäre Benachrichtigung an, indem Signale aktualisiert werden.
 *
 * @param alertMessageSignal Das Signal, das die Nachricht (string | null) enthält.
 * @param alertTypeSignal Das Signal, das den Typ (AlertType) enthält.
 * @param cdr Der ChangeDetectorRef der Komponente, um die Ansicht zu aktualisieren.
 * @param message 
 * @param type 
 * @param duration 
 */
export function triggerAlert(
  alertMessageSignal: WritableSignal<string | null>,
  alertTypeSignal: WritableSignal<AlertType>,
  cdr: ChangeDetectorRef,
  message: string,
  type: AlertType = 'info',
  duration: number = 5000
) {
  // Signale setzen
  alertMessageSignal.set(message);
  alertTypeSignal.set(type);
  cdr.markForCheck(); 


  setTimeout(() => {
   
    if (alertMessageSignal() === message) { 
      alertMessageSignal.set(null);
      cdr.markForCheck(); 
    }
  }, duration);
}
