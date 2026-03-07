import { Component, CUSTOM_ELEMENTS_SCHEMA, input, signal, computed, viewChild, ElementRef, inject } from '@angular/core';
import { injectBeforeRender, NgtArgs } from 'angular-three';
import { Router } from '@angular/router';
import * as THREE from 'three';

@Component({
  selector: 'app-portal-card',
  standalone: true,
  imports: [NgtArgs],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <ngt-group 
      #group
      [position]="basePosition()"
      [rotation]="baseRotation()"
      (pointerover)="onHover(true)" 
      (pointerout)="onHover(false)"
      (click)="navigate()">
      
      <ngt-mesh>
        <ngt-box-geometry *args="[2.7, 4.1, 0.05]" />
        <ngt-mesh-basic-material [color]="color()" [wireframe]="true" [transparent]="true" [opacity]="hovered() ? 1 : 0.3" />
      </ngt-mesh>

      <ngt-mesh>
        <ngt-box-geometry *args="[2.6, 4.0, 0.02]" />
        <ngt-mesh-physical-material [color]="color()" [transparent]="true" [opacity]="hovered() ? 0.3 : 0.1" [roughness]="0.1" [metalness]="0.8" />
      </ngt-mesh>

      <ngt-mesh [position]="[0, 1.6, 0.03]">
        <ngt-box-geometry *args="[2.4, 0.5, 0.04]" />
        <ngt-mesh-standard-material [color]="color()" [emissive]="color()" [emissiveIntensity]="hovered() ? 1.5 : 0.5" [transparent]="true" [opacity]="0.8" />
      </ngt-mesh>

      <ngt-mesh [position]="[0, 1.6, 0.06]">
        <ngt-plane-geometry *args="[2.4, 0.6]" />
        <ngt-mesh-basic-material [map]="textTexture()" [transparent]="true" [depthWrite]="false" />
      </ngt-mesh>

      <ngt-mesh [position]="[0, 0.8, 0.03]"><ngt-box-geometry *args="[2.4, 0.03, 0.04]" /><ngt-mesh-standard-material [color]="color()" [emissive]="color()" [emissiveIntensity]="hovered() ? 1.5 : 0.2" /></ngt-mesh>
      <ngt-mesh [position]="[0, 0.3, 0.03]"><ngt-box-geometry *args="[2.4, 0.03, 0.04]" /><ngt-mesh-standard-material [color]="color()" [emissive]="color()" [emissiveIntensity]="hovered() ? 1.5 : 0.2" /></ngt-mesh>
      <ngt-mesh [position]="[0, -0.2, 0.03]"><ngt-box-geometry *args="[2.4, 0.03, 0.04]" /><ngt-mesh-standard-material [color]="color()" [emissive]="color()" [emissiveIntensity]="hovered() ? 1.5 : 0.2" /></ngt-mesh>
      <ngt-mesh [position]="[0, -0.7, 0.03]"><ngt-box-geometry *args="[2.4, 0.03, 0.04]" /><ngt-mesh-standard-material [color]="color()" [emissive]="color()" [emissiveIntensity]="hovered() ? 1.5 : 0.2" /></ngt-mesh>
      
    </ngt-group>
  `
})
export class PortalCard {
  basePosition = input<[number, number, number]>([0, 0, 0]);
  baseRotation = input<[number, number, number]>([0, 0, 0]);
  color = input<string>('#00f3ff');
  route = input<string>('');
  label = input<string>('UNKNOWN'); // Der neue Label-Input

  hovered = signal(false);
  groupRef = viewChild.required<ElementRef<THREE.Group>>('group');
  
  private router = inject(Router);
  private floatOffset = Math.random() * 5;

  // Signal: Generiert den scharfen Text on the fly in den RAM
  textTexture = computed(() => {
    const c = document.createElement('canvas');
    c.width = 512; c.height = 128;
    const ctx = c.getContext('2d');
    
    ctx ? (
      ctx.fillStyle = 'transparent',
      ctx.fillRect(0, 0, 512, 128),
      ctx.font = 'bold 50px "JetBrains Mono", monospace, sans-serif',
      ctx.fillStyle = '#ffffff', // Weiße Schrift für Kontrast
      ctx.textAlign = 'center',
      ctx.textBaseline = 'middle',
      ctx.fillText(this.label(), 256, 64)
    ) : null;
    
    return new THREE.CanvasTexture(c);
  });

  constructor() {
    injectBeforeRender(({ clock }) => {
      const group = this.groupRef().nativeElement;
      group ? (() => {
        const isHov = this.hovered();
        const time = clock.elapsedTime + this.floatOffset;
        
        const targetZ = isHov ? this.basePosition()[2] + 1.2 : this.basePosition()[2];
        const targetY = this.basePosition()[1] + Math.sin(time * 2) * 0.1;
        const targetRotY = isHov ? 0 : this.baseRotation()[1];
        
        group.position.lerp(new THREE.Vector3(this.basePosition()[0], targetY, targetZ), 0.1);
        group.rotation.y += (targetRotY - group.rotation.y) * 0.1;
        
        const targetScale = isHov ? 1.05 : 1.0;
        group.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.15);
      })() : null;
    });
  }

  onHover(state: boolean) {
    this.hovered.set(state);
    document.body.style.cursor = state ? 'pointer' : 'auto';
  }

  navigate() {
    this.route() ? (document.body.style.cursor = 'auto', this.router.navigate([this.route()])) : null;
  }
}