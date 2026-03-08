import { Component, CUSTOM_ELEMENTS_SCHEMA, viewChild, ElementRef } from '@angular/core';
import { NgtCanvas } from 'angular-three/dom'; 
import { injectBeforeRender } from 'angular-three';
import * as THREE from 'three';

@Component({
  selector: 'app-holo-grid',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <ngt-group #group>
      <ngt-mesh #wire1>
        <ngt-cylinder-geometry *args="[14, 14, 14, 40, 10, true, -Math.PI / 1.5, Math.PI * 1.33]" />
        <ngt-mesh-basic-material 
          color="#0066cc" 
          [wireframe]="true" 
          [transparent]="true" 
          [opacity]="0.12" 
          [blending]="THREE.AdditiveBlending" 
          [side]="THREE.DoubleSide" 
        />
      </ngt-mesh>

      <ngt-mesh #wire2 [scale]="1.03">
        <ngt-cylinder-geometry *args="[14, 14, 14, 40, 10, true, -Math.PI / 1.5, Math.PI * 1.33]" />
        <ngt-mesh-basic-material 
          color="#00aaff" 
          [wireframe]="true" 
          [transparent]="true" 
          [opacity]="0.06" 
          [blending]="THREE.AdditiveBlending" 
          [side]="THREE.DoubleSide" 
        />
      </ngt-mesh>

      <ngt-mesh [position]="[0, -6, 0]" [rotation]="[-Math.PI / 2, 0, 0]">
        <ngt-ring-geometry *args="[6.0, 6.2, 64]" />
        <ngt-mesh-basic-material color="#00f3ff" [transparent]="true" [opacity]="0.6" [blending]="THREE.AdditiveBlending" [side]="THREE.DoubleSide" />
      </ngt-mesh>
      <ngt-mesh [position]="[0, -6, 0]" [rotation]="[-Math.PI / 2, 0, 0]">
        <ngt-ring-geometry *args="[8.0, 8.2, 64]" />
        <ngt-mesh-basic-material color="#0066cc" [transparent]="true" [opacity]="0.3" [blending]="THREE.AdditiveBlending" [side]="THREE.DoubleSide" />
      </ngt-mesh>

      <ngt-mesh [position]="[0, 6, 0]" [rotation]="[Math.PI / 2, 0, 0]">
        <ngt-ring-geometry *args="[6.0, 6.2, 64]" />
        <ngt-mesh-basic-material color="#00f3ff" [transparent]="true" [opacity]="0.6" [blending]="THREE.AdditiveBlending" [side]="THREE.DoubleSide" />
      </ngt-mesh>
      <ngt-mesh [position]="[0, 6, 0]" [rotation]="[Math.PI / 2, 0, 0]">
        <ngt-ring-geometry *args="[8.0, 8.2, 64]" />
        <ngt-mesh-basic-material color="#0066cc" [transparent]="true" [opacity]="0.3" [blending]="THREE.AdditiveBlending" [side]="THREE.DoubleSide" />
      </ngt-mesh>

      <ngt-points #points [geometry]="geo">
        <ngt-points-material 
          [map]="circleTex"
          [alphaTest]="0.01"
          color="#ccffff" 
          [size]="0.25" 
          [sizeAttenuation]="true" 
          [transparent]="true" 
          [opacity]="0.6" 
          [depthWrite]="false" 
          [blending]="THREE.AdditiveBlending" 
        />
      </ngt-points>
    </ngt-group>
  `
})
export class HoloGrid {
  protected readonly THREE = THREE;
  protected readonly Math = Math;
  
  groupRef = viewChild.required<ElementRef<THREE.Group>>('group');
  wire1Ref = viewChild<ElementRef<THREE.Mesh>>('wire1');
  wire2Ref = viewChild<ElementRef<THREE.Mesh>>('wire2');
  pointsRef = viewChild.required<ElementRef<THREE.Points>>('points');
  
  geo = new THREE.BufferGeometry();
  circleTex: THREE.CanvasTexture;
  count = 60; // Deutlich weniger Partikel

  constructor() {
    const c = document.createElement('canvas');
    c.width = 64; c.height = 64;
    const ctx = c.getContext('2d');
    
    ctx ? (
      ctx.beginPath(),
      ctx.arc(32, 32, 10, 0, Math.PI * 2), // Kleinerer, schärferer Kern
      ctx.fillStyle = '#ffffff',
      ctx.shadowBlur = 24,
      ctx.shadowColor = '#00aaff',
      ctx.fill()
    ) : null;
    
    this.circleTex = new THREE.CanvasTexture(c);

    const pos = new Float32Array(this.count * 3);
    const radiusMin = 4.0;
    const radiusMax = 12.0;

    for (let i = 0; i < this.count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const r = radiusMin + Math.random() * (radiusMax - radiusMin);
      
      pos[i * 3] = Math.cos(theta) * r;
      pos[i * 3 + 1] = (Math.random() * 12) - 6; 
      pos[i * 3 + 2] = Math.sin(theta) * r;
    }

    this.geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));

    injectBeforeRender(({ clock }) => {
      const t = clock.elapsedTime;
      const g = this.groupRef()?.nativeElement;
      const w1 = this.wire1Ref()?.nativeElement;
      const w2 = this.wire2Ref()?.nativeElement;
      const posAttr = this.geo.attributes['position'];

      // Partikel-Animation (Aufsteigen)
      posAttr ? (() => {
        for (let i = 0; i < this.count; i++) {
          let y = posAttr.getY(i);
          const speed = 0.01 + (i % 3) * 0.02; 
          
          y += speed;
          y = y > 6 ? -6 : y; // Ternary Zuweisung
          
          posAttr.setY(i, y);
        }
        posAttr.needsUpdate = true;
      })() : null;

      // Sanfte Gegenbewegung der Wireframes für den Moiré/Tiefen-Effekt
      w1 ? (w1.rotation.y = Math.sin(t * 0.1) * 0.03) : null;
      w2 ? (w2.rotation.y = Math.cos(t * 0.15) * -0.04) : null;
      
      // Leichtes Atmen der gesamten Grid-Gruppe
      g ? (g.position.y = Math.sin(t * 0.4) * 0.1) : null;
    });
  }
}

@Component({
  selector: 'app-scene',
  standalone: true,
  imports: [HoloGrid],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <ngt-ambient-light [intensity]="0.4" color="#0055aa" />
    <ngt-point-light [position]="[0, 0, 0]" [intensity]="5" color="#00aaff" [distance]="20" />
    
    <app-holo-grid [position]="[0, 0, -3]" />
  `
})
export class SceneComponent {}

@Component({
  selector: 'app-portal-hub',
  standalone: true,
  imports: [NgtCanvas, SceneComponent],
  template: `
    <div class="fui-block fui-block-a">
        <div class="fui-letter-square">A</div>
        <p>A: SPARE TIME MANAGER WAS DEVELOPED BY THE KHALAI SAINTS, SERVING NEURAL NESTE FROM 2076.</p>
        <div class="fui-user">
            <h3>USER</h3>
            <div class="fui-user-id fui-cyan">GUES 7702</div>
        </div>
    </div>

    <div class="fui-block fui-block-c">
        <div class="fui-letter-square">C</div>
        <p>C: SPARE TIME MANAGER WAS DEVELOPED BY THE KHALAI SAINTS, SERVING NEURAL NESTE FROM 2076.</p>
        <div class="fui-security-level">
            <h3>SECURITY LEVEL</h3>
            <div class="fui-button-group">
                <button class="fui-btn">01</button>
                <button class="fui-btn active-btn">02</button>
                <button class="fui-btn">03</button>
                <button class="fui-btn">04</button>
            </div>
        </div>
    </div>

    <div class="fui-block fui-block-d">
        <div class="fui-letter-square">D</div>
        <p>D: MAPS ARE PROVIDED BY REDCHO, SATELLITE SERVICES SINCE 2006.</p>
        <div class="fui-description">
            <h3>DESCRIPTION</h3>
        </div>
    </div>

    <div class="fui-block fui-block-braindance">
        <div class="fui-header fui-cyan">BRAINDANCE</div>
        <div class="fui-text-box">
            <p class="fui-text-note">ONLY CC3S CERTIFIED AND DHSP 6TH CLASS OFFICERS ARE ALLOWED TO MANIPULATE, ACCESS OR DISABLE THIS DEVICE.</p>
            <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        </div>
        <div class="fui-badge">
            <span class="icon">M</span>
        </div>
    </div>

    <div class="fui-block fui-block-b fui-bottom">
        <div class="fui-letter-square">B</div>
        <p>B: MAPS ARE PROVIDED BY REDCHO, SATELLITE SERVICES SINCE 2006.</p>
        <div class="fui-device-software">
            <h3>DEVICE SOFTWARE</h3>
        </div>
    </div>

    <ngt-canvas [camera]="{ position: [0, 0, 7.5] }">
      <app-scene *canvasContent />
    </ngt-canvas>
    
    <div class="labels-overlay fui-bottom-labels">
      <div class="label-box cyan"><span class="icon">((i))</span> SETTINGS</div>
      <div class="label-box blue"><span class="icon">O</span> MEDIA DB</div>
      <div class="label-box cyan"><span class="icon">[ ]</span> PERSONAL FILES</div>
    </div>
  `,
  styles: `
    :host { 
      display: block; width: 100%; height: 100%; position: relative;
      /* Tiefblaues Radial-Gradient passend zum Bildhintergrund */
      background: radial-gradient(circle at center, #001226 0%, #000205 100%);
      font-family: 'Orbitron', 'JetBrains Mono', monospace;
      color: #99ccff; 
    }
    
    .fui-block {
      position: absolute;
      width: 320px;
      z-index: 10;
    }
    
    .fui-block-a { top: 30px; left: 30px; }
    .fui-block-c { top: 30px; left: 50%; transform: translateX(-50%); width: 400px; text-align: center; }
    .fui-block-d { top: 30px; right: 30px; text-align: right; }
    .fui-block-braindance { top: 50%; right: 30px; transform: translateY(-50%); width: 380px; }
    .fui-bottom { bottom: 30px; left: 50%; transform: translateX(-50%); text-align: center; width: 400px; }

    .fui-letter-square {
      display: inline-block;
      width: 25px; height: 25px;
      line-height: 25px; text-align: center;
      border: 1px solid #00aaff;
      color: #00aaff;
      font-weight: 800;
      margin-right: 10px;
      box-shadow: 0 0 5px rgba(0, 170, 255, 0.3);
    }
    
    p { margin: 5px 0 10px; font-size: 0.75rem; line-height: 1.4; opacity: 0.7; }
    h3 { margin: 15px 0 5px; font-size: 0.8rem; font-weight: 300; letter-spacing: 1px; color: #fff; }

    .fui-cyan { color: #00f3ff; text-shadow: 0 0 10px rgba(0, 243, 255, 0.6); }
    
    .fui-user { margin-top: 20px; text-align: left; }
    .fui-user-id { font-size: 1.2rem; font-weight: 800; }
    
    .fui-security-level { text-align: center; }
    .fui-button-group { display: flex; gap: 10px; justify-content: center; }
    .fui-btn {
      background: transparent; border: 1px solid #0055aa;
      color: #00f3ff; padding: 5px 15px; font-weight: 800; cursor: pointer;
      transition: all 0.2s;
    }
    .active-btn { background: #00aaff; color: #000; border-color: #00aaff; box-shadow: 0 0 12px rgba(0, 170, 255, 0.6); }
    
    .fui-text-box { margin-top: 10px; border: 1px solid #0055aa; background: rgba(0, 10, 25, 0.6); padding: 10px; font-size: 0.7rem; backdrop-filter: blur(4px); }
    .fui-text-note { color: #00f3ff; font-weight: 800; margin-bottom: 5px; opacity: 1; }
    
    .fui-badge { text-align: center; margin-top: 15px; color: #00aaff; }
    .icon { font-family: monospace; opacity: 0.9; }

    .labels-overlay {
      position: absolute; bottom: 30px; left: 0; right: 0;
      display: flex; justify-content: center; gap: 15%; pointer-events: none;
      z-index: 20;
    }
    
    .label-box {
      font-size: 0.9rem; font-weight: 800; letter-spacing: 2px;
      display: flex; align-items: center; gap: 8px;
      background: rgba(0, 10, 25, 0.8); padding: 5px 15px; border-radius: 4px;
      backdrop-filter: blur(4px);
    }
    
    .cyan { color: #00f3ff; text-shadow: 0 0 10px rgba(0, 243, 255, 0.5); border: 1px solid #00f3ff; }
    .blue { color: #3399ff; text-shadow: 0 0 10px rgba(51, 153, 255, 0.5); border: 1px solid #3399ff; }
    
    .labels-overlay.fui-bottom-labels {
      bottom: 60px;
    }
  `
})
export class PortalHubComponent {}