import { Component, Input, inject, computed, signal } from '@angular/core';
import { TronSecurityChecker } from '../../utils/tron-security-checker'; 

@Component({
  selector: 'app-form-grid',
  standalone: true,
  templateUrl: './form-grid.html',
  styleUrl: './form-grid.scss'
})
export class FormGrid {
  private security = inject(TronSecurityChecker);


  @Input() layout: 'grid' | 'stacked' = 'grid'; 
  @Input() variant: 'default' | 'panel' = 'default';
  @Input() requiredAction: string | null = null;

  isHovered = signal<boolean>(false);
  
  public isDisabled = computed(() => 
    this.requiredAction ? !this.security.hasPermission(this.requiredAction) : false
  );
}