import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TronSecurityChecker {
  private userPermissions = signal<string[]>([]);
  private router = inject(Router);

  constructor() {
    this.loadPermissions();
  }

  public loadPermissions(): void {
    const token = localStorage.getItem('tron_token');
    
    token 
      ? this.#decodeToken(token) 
      : (
          console.warn('Kein Token im LocalStorage gefunden! DEREZZING...'), 
          this.userPermissions.set([]),
          this.router.navigate(['/access-denied'])
        );
  }

  #decodeToken(token: string): void {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      
      const permissions = payload.groups 
        ? payload.groups 
        : (payload.permissions ? payload.permissions : []); 
      
      this.userPermissions.set(permissions);
      
    } catch (e) {
      console.error('Fehler beim Decodieren des Tron-Tokens. DEREZZING...', e);
      this.userPermissions.set([]);
      this.router.navigate(['/access-denied']);
    }
  }

  public hasPermission(permission: string): boolean {
    const current = this.userPermissions();
    return current.includes('ROOT') ? true : current.includes(permission);
  }

  public updatePermissions(newPermissions: string[]): void {
    this.userPermissions.set(newPermissions);
  }

  public clearPermissions(): void {
    localStorage.removeItem('tron_token');
    this.userPermissions.set([]);
    console.log('TRON SECURITY CHECKER | Speicher gelöscht. User derezzed.');
  }

  public hasNoPermissions(): boolean {
    const current = this.userPermissions();
    const realPermissions = current.filter(role => role.includes(':') || role === 'ROOT');
    return realPermissions.length === 0 ? true : false;
  }
}