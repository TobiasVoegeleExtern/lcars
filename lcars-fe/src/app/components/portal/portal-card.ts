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
      
      <ngt-mesh #layer3>
        <ngt-box-geometry *args="[3.2, 0.9, 0.02]" />
        <ngt-mesh-basic-material [color]="color()" [transparent]="true" [opacity]="0.1" [depthWrite]="false" />
      </ngt-mesh>

      <ngt-mesh #layer2>
        <ngt-box-geometry *args="[3.2, 0.9, 0.02]" />
        <ngt-mesh-basic-material [color]="color()" [transparent]="true" [opacity]="0.25" [depthWrite]="false" />
      </ngt-mesh>

      <ngt-mesh #layer1>
        <ngt-box-geometry *args="[3.2, 0.9, 0.02]" />
        <ngt-mesh-basic-material [color]="color()" [transparent]="true" [opacity]="0.6" [depthWrite]="false" />
        
        <ngt-line-segments>
          <ngt-edges-geometry *args="[boxGeo()]" />
          <ngt-line-basic-material [color]="color()" [linewidth]="2" [transparent]="true" [opacity]="hovered() ? 1 : 0.4" />
        </ngt-line-segments>

        <ngt-mesh [position]="[0, 0, 0.02]">
          <ngt-plane-geometry *args="[3.0, 0.8]" />
          <ngt-mesh-basic-material [map]="textTexture()" [transparent]="true" [depthWrite]="false" />
        </ngt-mesh>
      </ngt-mesh>
      
    </ngt-group>
  `
})
export class PortalCard {
  protected readonly THREE = THREE;

  basePosition = input<[number, number, number]>([0, 0, 0]);
  baseRotation = input<[number, number, number]>([0, 0, 0]);
  color = input<string>('#00e5ff'); // Cyberpunk Cyan
  route = input<string>('');
  label = input<string>('VEHICLES');

  hovered = signal(false);
  
  groupRef = viewChild.required<ElementRef<THREE.Group>>('group');
  layer1Ref = viewChild.required<ElementRef<THREE.Mesh>>('layer1');
  layer2Ref = viewChild.required<ElementRef<THREE.Mesh>>('layer2');
  layer3Ref = viewChild.required<ElementRef<THREE.Mesh>>('layer3');
  
  private router = inject(Router);
  private floatOffset = Math.random() * 5;

  // Gemeinsame Geometrie für das Mesh und die Wireframe-Kanten
  boxGeo = computed(() => new THREE.BoxGeometry(3.2, 0.9, 0.02));

  // Generiert das cleane UI-Label
  textTexture = computed(() => {
    const c = document.createElement('canvas');
    c.width = 512; c.height = 128;
    const ctx = c.getContext('2d');
    
    return ctx ? (
      ctx.fillStyle = 'transparent',
      ctx.fillRect(0, 0, 512, 128),
      ctx.font = '300 42px "Jura", "Orbitron", "Share Tech Mono", sans-serif',
      ctx.fillStyle = '#ffffff',
      ctx.textAlign = 'left',
      ctx.textBaseline = 'middle',
      ctx.fillText(this.label().toUpperCase(), 40, 64),
      new THREE.CanvasTexture(c)
    ) : new THREE.CanvasTexture(c);
  });

  constructor() {
    injectBeforeRender(({ clock }) => {
      const group = this.groupRef().nativeElement;
      const l2 = this.layer2Ref().nativeElement;
      const l3 = this.layer3Ref().nativeElement;
      const t = clock.elapsedTime + this.floatOffset;

      return (group && l2 && l3) ? (() => {
        const isHov = this.hovered();
        
        // Sanftes Schweben
        const targetY = this.basePosition()[1] + Math.sin(t * 1.5) * 0.05;
        group.position.lerp(new THREE.Vector3(this.basePosition()[0], targetY, this.basePosition()[2]), 0.1);
        
        // Kernmechanik: Die Ebenen fächern sich beim Hovern nach hinten links oben auf
        const spread = isHov ? 0.35 : 0.12;
        
        l2.position.lerp(new THREE.Vector3(-spread, spread * 0.4, -spread), 0.12);
        l3.position.lerp(new THREE.Vector3(-spread * 2, spread * 0.8, -spread * 2), 0.12);

        // Leichtes Eindrehen zum User, wenn gehovert wird
        const targetRotY = isHov ? 0.05 : 0;
        group.rotation.y += (targetRotY - group.rotation.y) * 0.1;
      })() : null;
    });
  }

  onHover(state: boolean) {
    return state ? 
      (this.hovered.set(true), document.body.style.cursor = 'pointer') : 
      (this.hovered.set(false), document.body.style.cursor = 'auto');
  }

  navigate() {
    return this.route() ? 
      (document.body.style.cursor = 'auto', this.router.navigate([this.route()])) : 
      null;
  }
}