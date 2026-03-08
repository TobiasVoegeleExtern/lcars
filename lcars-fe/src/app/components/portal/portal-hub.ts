import { Component, CUSTOM_ELEMENTS_SCHEMA, viewChild, ElementRef } from '@angular/core';
import { NgtCanvas } from 'angular-three/dom'; 
import { injectBeforeRender } from 'angular-three';
import { PortalCard } from './portal-card';
import * as THREE from 'three';

@Component({
  selector: 'app-particle-ring',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <ngt-points #points [geometry]="geo">
      <ngt-points-material 
        [map]="circleTex"
        [alphaTest]="0.1"
        color="#00f3ff" 
        [size]="0.08" 
        [sizeAttenuation]="true" 
        [transparent]="true" 
        [opacity]="0.8" 
        [depthWrite]="false" 
        [blending]="2" 
      />
    </ngt-points>
  `
})
export class ParticleRing {
  pointsRef = viewChild.required<ElementRef<THREE.Points>>('points');
  geo = new THREE.BufferGeometry();
  circleTex: THREE.CanvasTexture;

  constructor() {
    // 1. Erstelle die runde Partikel-Textur im Speicher
    const c = document.createElement('canvas');
    c.width = 64; c.height = 64;
    const ctx = c.getContext('2d');
    ctx ? (
      ctx.beginPath(),
      ctx.arc(32, 32, 28, 0, Math.PI * 2),
      ctx.fillStyle = '#fff',
      ctx.fill()
    ) : null;
    this.circleTex = new THREE.CanvasTexture(c);

    // 2. Dichte erhöhen: 12.000 Fragmente
    const count = 12000;
    const pos = new Float32Array(count * 3);
    const radius = 7.5;

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const r = radius + (Math.random() > 0.5 ? Math.random() * 0.8 : -Math.random() * 0.8);
      
      pos[i * 3] = Math.cos(theta) * r;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 1.8; 
      pos[i * 3 + 2] = Math.sin(theta) * r;
    }

    this.geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));

    injectBeforeRender(() => {
      const p = this.pointsRef().nativeElement;
      p ? (p.rotation.y -= 0.001, p.rotation.x = 0.25) : null;
    });
  }
}

@Component({
  selector: 'app-scene',
  standalone: true,
  imports: [PortalCard, ParticleRing],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <ngt-ambient-light [intensity]="1" />
    <ngt-point-light [position]="[0, 5, 5]" [intensity]="4" />
    
    <app-particle-ring [position]="[0, -1.5, -3]" />
    
    <app-portal-card 
      [basePosition]="[-3.8, 0, -1]" 
      [baseRotation]="[0, 0.4, 0]" 
      color="#00f3ff" 
      label="SETTINGS"
      route="/settings" 
    />
    
    <app-portal-card 
      [basePosition]="[0, 0, 1]" 
      [baseRotation]="[0, 0, 0]" 
      color="#86abff" 
      label="MEDIA DB"
      route="/media" 
    />
    
    <app-portal-card 
      [basePosition]="[3.8, 0, -1]" 
      [baseRotation]="[0, -0.4, 0]" 
      color="#ff9d00" 
      label="PERSONAL FILES"
      route="/personal" 
    />
  `
})
export class SceneComponent {}

@Component({
  selector: 'app-portal-hub',
  standalone: true,
  imports: [NgtCanvas, SceneComponent],
  template: `
    <ngt-canvas [camera]="{ position: [0, 0, 7.5] }">
      <app-scene *canvasContent />
    </ngt-canvas>
    
    <div class="labels-overlay">
      <div class="label-box cyan"><span class="icon">((i))</span> SETTINGS</div>
      <div class="label-box blue"><span class="icon">O</span> MEDIA DB</div>
      <div class="label-box orange"><span class="icon">[ ]</span> PERSONAL FILES</div>
    </div>
  `,
  styles: `
    :host { 
      display: block; width: 100%; height: 100%; position: relative;
      background: radial-gradient(circle at center, #001a2d 0%, #000 80%);
    }
    .labels-overlay {
      position: absolute; bottom: 30px; left: 0; right: 0;
      display: flex; justify-content: center; gap: 15%; pointer-events: none;
    }
    .label-box {
      font-size: 0.9rem; font-weight: 800; letter-spacing: 2px;
      display: flex; align-items: center; gap: 8px;
      background: rgba(0,0,0,0.5); padding: 5px 15px; border-radius: 20px;
    }
    .icon { font-family: monospace; opacity: 0.7; }
    .cyan { color: var(--tron-cyan); text-shadow: 0 0 10px var(--tron-cyan-glow); border: 1px solid var(--tron-cyan); }
    .blue { color: var(--lcars-blue, #86abff); text-shadow: 0 0 10px #86abff; border: 1px solid var(--lcars-blue); }
    .orange { color: var(--tron-orange); text-shadow: 0 0 10px var(--tron-orange-glow); border: 1px solid var(--tron-orange); }
  `
})
export class PortalHubComponent {}