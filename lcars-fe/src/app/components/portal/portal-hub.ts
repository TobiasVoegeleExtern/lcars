import { Component, CUSTOM_ELEMENTS_SCHEMA, input, output, signal, computed, viewChild, ElementRef, inject, OnInit, OnDestroy } from '@angular/core';
import { injectBeforeRender, NgtArgs } from 'angular-three';
import { NgtCanvas } from 'angular-three/dom'; 
import { Router } from '@angular/router';
import * as THREE from 'three';

/* =================================================================
   1. PORTAL CARD (Holographische Karussell-Logik)
================================================================= */
@Component({
  selector: 'app-portal-card',
  standalone: true,
  imports: [NgtArgs],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <ngt-group 
      [position]="basePosition()"
      [rotation]="baseRotation()">
      
      <ngt-group
        #interactiveGroup
        (pointerover)="onHover(true)" 
        (pointerout)="onHover(false)"
        (pointerdown)="onPress(true)"
        (pointerup)="onPress(false)"
        (click)="handleInteraction()">
        
        <!-- HITBOX -->
        <ngt-mesh [visible]="false">
          <ngt-box-geometry *args="[4.2, 1.8, 1.5]" />
        </ngt-mesh>

        <!-- LCARS BRACKETS -->
        <ngt-mesh [position]="[-1.6, 0, 0]">
          <ngt-box-geometry *args="[0.15, 1.2, 0.7]" />
          <ngt-mesh-standard-material #bracketMatL [color]="color()" [metalness]="0.6" [roughness]="0.3" [transparent]="true" />
        </ngt-mesh>
        <ngt-mesh [position]="[1.6, 0, 0]">
          <ngt-box-geometry *args="[0.15, 1.2, 0.7]" />
          <ngt-mesh-standard-material #bracketMatR [color]="color()" [metalness]="0.6" [roughness]="0.3" [transparent]="true" />
        </ngt-mesh>

        <!-- ENERGIE-KERN -->
        <ngt-mesh #energyCore [position]="[0, 0, -0.1]">
          <ngt-box-geometry *args="[2.8, 0.6, 0.3]" />
          <ngt-mesh-standard-material 
            #coreMat
            [color]="color()" 
            [emissive]="color()" 
            [transparent]="true"
          />
        </ngt-mesh>

        <!-- HOLO-GLAS -->
        <ngt-mesh [position]="[0, 0, 0]">
          <ngt-box-geometry *args="[3.1, 1.0, 0.6]" />
          <ngt-mesh-physical-material 
            #glassMat
            color="#001122" 
            [transparent]="true" 
            [roughness]="0.05" 
            [metalness]="0.9" 
            [clearcoat]="1.0"
          />
          
          <!-- Edges -->
          <ngt-line-segments>
            <ngt-edges-geometry *args="[glassGeo()]" />
            <ngt-line-basic-material #lineMat [color]="color()" [linewidth]="2" [transparent]="true" />
          </ngt-line-segments>
        </ngt-mesh>

        <!-- DATA TEXT -->
        <ngt-mesh [position]="[0, 0, 0.31]">
          <ngt-plane-geometry *args="[2.8, 0.8]" />
          <ngt-mesh-basic-material #textMat [map]="textTexture()" [transparent]="true" [depthWrite]="false" />
        </ngt-mesh>

      </ngt-group>
    </ngt-group>
  `
})
export class PortalCard {
  protected readonly THREE = THREE;

  basePosition = input<[number, number, number]>([0, 0, 0]);
  baseRotation = input<[number, number, number]>([0, 0, 0]);
  color = input<string>('#00e5ff');
  route = input<string>('');
  label = input<string>('UNKNOWN');
  
  // NEU: Steuert den Hologramm-Fade-Out
  isActive = input<boolean>(false);
  selectCard = output<void>();

  hovered = signal(false);
  pressed = signal(false);
  
  interactiveGroupRef = viewChild.required<ElementRef<THREE.Group>>('interactiveGroup');
  energyCoreRef = viewChild.required<ElementRef<THREE.Mesh>>('energyCore');
  
  // Material Referenzen für den Fade-Effekt
  coreMatRef = viewChild.required<ElementRef<THREE.MeshStandardMaterial>>('coreMat');
  glassMatRef = viewChild.required<ElementRef<THREE.MeshPhysicalMaterial>>('glassMat');
  textMatRef = viewChild.required<ElementRef<THREE.MeshBasicMaterial>>('textMat');
  lineMatRef = viewChild.required<ElementRef<THREE.LineBasicMaterial>>('lineMat');
  bracketMatLRef = viewChild.required<ElementRef<THREE.MeshStandardMaterial>>('bracketMatL');
  bracketMatRRef = viewChild.required<ElementRef<THREE.MeshStandardMaterial>>('bracketMatR');
  
  private router = inject(Router);
  private floatOffset = Math.random() * 5;

  glassGeo = computed(() => new THREE.BoxGeometry(3.1, 1.0, 0.6));

  textTexture = computed(() => {
    const c = document.createElement('canvas');
    c.width = 512; c.height = 128;
    const ctx = c.getContext('2d');
    
    return ctx ? (
      ctx.fillStyle = 'transparent',
      ctx.fillRect(0, 0, 512, 128),
      ctx.font = '800 48px "Orbitron", "Jura", sans-serif',
      ctx.fillStyle = '#ffffff',
      ctx.textAlign = 'center',
      ctx.textBaseline = 'middle',
      ctx.shadowColor = this.color(),
      ctx.shadowBlur = 15,
      ctx.fillText(this.label().toUpperCase(), 256, 64),
      new THREE.CanvasTexture(c)
    ) : new THREE.CanvasTexture(c);
  });

  constructor() {
    injectBeforeRender(({ clock }) => {
      const ig = this.interactiveGroupRef().nativeElement;
      const core = this.energyCoreRef().nativeElement;
      
      const cMat = this.coreMatRef().nativeElement;
      const gMat = this.glassMatRef().nativeElement;
      const tMat = this.textMatRef().nativeElement;
      const lMat = this.lineMatRef().nativeElement;
      const bMatL = this.bracketMatLRef().nativeElement;
      const bMatR = this.bracketMatRRef().nativeElement;

      const t = clock.elapsedTime + this.floatOffset;

      if (ig && core && cMat) {
        const isAct = this.isActive();
        const isHov = this.hovered();
        const isPress = this.pressed();
        
        // 1. Physischer Zustand (Skalierung & Push)
        const targetScale = isAct ? 1.0 : 0.6; // Inaktive Karten schrumpfen
        ig.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);

        const targetZ = isPress && isAct ? -0.4 : (isHov && isAct ? 0.1 : 0);
        const targetY = isAct ? Math.sin(t * 1.5) * 0.05 : 0; // Nur aktive Karte schwebt
        const targetRotX = isPress && isAct ? 0.05 : (isHov && isAct ? -0.05 : 0);
        
        ig.position.lerp(new THREE.Vector3(0, targetY, targetZ), 0.2);
        ig.rotation.x += (targetRotX - ig.rotation.x) * 0.1;

        // 2. Hologramm Fade-Effekt (Material-Transparenz)
        // Lerpt weich von "Unsichtbar/Deaktiviert" zu "Voll Aktiv"
        cMat.opacity += ((isAct ? (isHov ? 0.9 : 0.6) : 0.02) - cMat.opacity) * 0.1;
        cMat.emissiveIntensity = isAct && isHov ? 2.5 : 0.5;
        
        gMat.opacity += ((isAct ? 0.4 : 0.05) - gMat.opacity) * 0.1;
        tMat.opacity += ((isAct ? 1.0 : 0.05) - tMat.opacity) * 0.1;
        lMat.opacity += ((isAct ? (isHov ? 0.9 : 0.4) : 0.05) - lMat.opacity) * 0.1;
        
        bMatL.opacity += ((isAct ? 1.0 : 0.1) - bMatL.opacity) * 0.1;
        bMatR.opacity += ((isAct ? 1.0 : 0.1) - bMatR.opacity) * 0.1;

        const coreScaleY = isAct && isHov ? 1.0 + Math.sin(t * 8) * 0.05 : 1.0;
        core.scale.lerp(new THREE.Vector3(1, coreScaleY, isAct && isHov ? 1.2 : 1.0), 0.1);
      }
    });
  }

  onHover(state: boolean) {
    this.hovered.set(state);
    document.body.style.cursor = state ? 'pointer' : 'auto';
  }

  onPress(state: boolean) {
    this.pressed.set(state);
  }

  handleInteraction() {
    if (this.isActive()) {
      // Wenn es die aktuelle Karte ist, navigiere
      if (this.route()) {
        document.body.style.cursor = 'auto';
        setTimeout(() => this.router.navigate([this.route()]), 150);
      }
    } else {
      // Wenn es eine inaktive Karte ist, mach sie zur aktiven (Karussell dreht sich)
      this.selectCard.emit();
    }
  }
}

/* =================================================================
   2. HOLO GRID (Bleibt unangetastet)
================================================================= */
@Component({
  selector: 'app-holo-grid',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <ngt-group #group>
      <ngt-mesh #wire1><ngt-cylinder-geometry *args="[14, 14, 14, 40, 10, true, -Math.PI / 1.5, Math.PI * 1.33]" /><ngt-mesh-basic-material color="#0066cc" [wireframe]="true" [transparent]="true" [opacity]="0.12" [blending]="THREE.AdditiveBlending" [side]="THREE.DoubleSide" /></ngt-mesh>
      <ngt-mesh #wire2 [scale]="1.03"><ngt-cylinder-geometry *args="[14, 14, 14, 40, 10, true, -Math.PI / 1.5, Math.PI * 1.33]" /><ngt-mesh-basic-material color="#00aaff" [wireframe]="true" [transparent]="true" [opacity]="0.06" [blending]="THREE.AdditiveBlending" [side]="THREE.DoubleSide" /></ngt-mesh>
      <ngt-mesh [position]="[0, -6, 0]" [rotation]="[-Math.PI / 2, 0, 0]"><ngt-ring-geometry *args="[6.0, 6.2, 64]" /><ngt-mesh-basic-material color="#00f3ff" [transparent]="true" [opacity]="0.6" [blending]="THREE.AdditiveBlending" [side]="THREE.DoubleSide" /></ngt-mesh>
      <ngt-mesh [position]="[0, -6, 0]" [rotation]="[-Math.PI / 2, 0, 0]"><ngt-ring-geometry *args="[8.0, 8.2, 64]" /><ngt-mesh-basic-material color="#0066cc" [transparent]="true" [opacity]="0.3" [blending]="THREE.AdditiveBlending" [side]="THREE.DoubleSide" /></ngt-mesh>
      <ngt-mesh [position]="[0, 6, 0]" [rotation]="[Math.PI / 2, 0, 0]"><ngt-ring-geometry *args="[6.0, 6.2, 64]" /><ngt-mesh-basic-material color="#00f3ff" [transparent]="true" [opacity]="0.6" [blending]="THREE.AdditiveBlending" [side]="THREE.DoubleSide" /></ngt-mesh>
      <ngt-mesh [position]="[0, 6, 0]" [rotation]="[Math.PI / 2, 0, 0]"><ngt-ring-geometry *args="[8.0, 8.2, 64]" /><ngt-mesh-basic-material color="#0066cc" [transparent]="true" [opacity]="0.3" [blending]="THREE.AdditiveBlending" [side]="THREE.DoubleSide" /></ngt-mesh>
      <ngt-points #points [geometry]="geo"><ngt-points-material [map]="circleTex" [alphaTest]="0.01" color="#ccffff" [size]="0.25" [sizeAttenuation]="true" [transparent]="true" [opacity]="0.6" [depthWrite]="false" [blending]="THREE.AdditiveBlending" /></ngt-points>
    </ngt-group>
  `
})
export class HoloGrid {
  protected readonly THREE = THREE; protected readonly Math = Math;
  groupRef = viewChild.required<ElementRef<THREE.Group>>('group');
  wire1Ref = viewChild<ElementRef<THREE.Mesh>>('wire1');
  wire2Ref = viewChild<ElementRef<THREE.Mesh>>('wire2');
  pointsRef = viewChild.required<ElementRef<THREE.Points>>('points');
  geo = new THREE.BufferGeometry(); circleTex: THREE.CanvasTexture; count = 60;

  constructor() {
    const c = document.createElement('canvas'); c.width = 64; c.height = 64; const ctx = c.getContext('2d');
    ctx ? (ctx.beginPath(), ctx.arc(32, 32, 10, 0, Math.PI * 2), ctx.fillStyle = '#ffffff', ctx.shadowBlur = 24, ctx.shadowColor = '#00aaff', ctx.fill()) : null;
    this.circleTex = new THREE.CanvasTexture(c);
    const pos = new Float32Array(this.count * 3);
    for (let i = 0; i < this.count; i++) {
      const theta = Math.random() * Math.PI * 2; const r = 4.0 + Math.random() * 8.0;
      pos[i * 3] = Math.cos(theta) * r; pos[i * 3 + 1] = (Math.random() * 12) - 6; pos[i * 3 + 2] = Math.sin(theta) * r;
    }
    this.geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));

    injectBeforeRender(({ clock }) => {
      const t = clock.elapsedTime; const g = this.groupRef()?.nativeElement; const w1 = this.wire1Ref()?.nativeElement; const w2 = this.wire2Ref()?.nativeElement; const posAttr = this.geo.attributes['position'];
      if(posAttr) { for (let i = 0; i < this.count; i++) { let y = posAttr.getY(i) + 0.01 + (i % 3) * 0.02; posAttr.setY(i, y > 6 ? -6 : y); } posAttr.needsUpdate = true; }
      if(w1) w1.rotation.y = Math.sin(t * 0.1) * 0.03; if(w2) w2.rotation.y = Math.cos(t * 0.15) * -0.04; if(g) g.position.y = Math.sin(t * 0.4) * 0.1;
    });
  }
}

/* =================================================================
   3. SCENE (Das dynamische Karussell)
================================================================= */
@Component({
  selector: 'app-scene',
  standalone: true,
  imports: [HoloGrid, PortalCard],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <ngt-ambient-light [intensity]="0.4" color="#0055aa" />
    <ngt-point-light [position]="[2, 3, 4]" [intensity]="8" color="#00e5ff" [distance]="20" />
    <ngt-point-light [position]="[-2, -3, 2]" [intensity]="4" color="#c686ff" [distance]="10" />
    
    <app-holo-grid [position]="[0, -1, -4]" />

    <!-- Dynamische Generierung des Karussells -->
    @for (card of cards; track card.label; let i = $index) {
      <app-portal-card 
        [basePosition]="getPos(i)" 
        [baseRotation]="getRot(i)" 
        [isActive]="activeIndex() === i"
        [color]="card.color" 
        [label]="card.label"
        [route]="card.route" 
        (selectCard)="activeIndex.set(i)"
      />
    }
  `
})
export class SceneComponent implements OnInit, OnDestroy {
  // Starte mit der mittleren Karte (Index 1)
  activeIndex = signal(1);

  // Du kannst hier beliebig viele Karten hinzufügen, der Kreis berechnet sich automatisch
  cards = [
    { label: 'SYS_CFG', color: '#00e5ff', route: '/settings' },
    { label: 'DB_QUERY', color: '#00aaff', route: '/media' },
    { label: 'USR_DATA', color: '#c686ff', route: '/personal' },
    { label: 'NETWORK', color: '#ff9d00', route: '/network' },
    { label: 'SECURITY', color: '#ff3366', route: '/security' }
  ];

  ngOnInit() {
    // Mausrad-Steuerung für das Karussell
    window.addEventListener('wheel', this.handleWheel);
  }

  ngOnDestroy() {
    window.removeEventListener('wheel', this.handleWheel);
  }

  handleWheel = (event: WheelEvent) => {
    // Drosselt das Scrollen leicht für ein besseres UX
    if (Math.abs(event.deltaY) > 20) {
      if (event.deltaY > 0 && this.activeIndex() < this.cards.length - 1) {
        this.activeIndex.update(i => i + 1);
      } else if (event.deltaY < 0 && this.activeIndex() > 0) {
        this.activeIndex.update(i => i - 1);
      }
    }
  }

  // Berechnet die Zylinder-Position der Karte im 3D Raum
  getPos(index: number): [number, number, number] {
    const diff = index - this.activeIndex();
    const angle = diff * 0.6; // Abstand zwischen den Karten auf dem Kreis
    const radius = 7.5;       // Radius des Karussells
    
    const x = Math.sin(angle) * radius;
    // Z-Achse: Die aktive Karte (diff=0) rückt leicht nach vorne, alle anderen fallen stark nach hinten ab
    const z = Math.cos(angle) * radius - radius - (Math.abs(diff) * 0.5); 
    
    return [x, 0, z];
  }

  // Berechnet den korrekten Blickwinkel zum User
  getRot(index: number): [number, number, number] {
    const diff = index - this.activeIndex();
    const angle = diff * 0.6;
    return [0, -angle, 0]; // Karte dreht sich immer Richtung Zentrum
  }
}

/* =================================================================
   4. PORTAL HUB (Unverändert)
================================================================= */
@Component({
  selector: 'app-portal-hub',
  standalone: true,
  imports: [NgtCanvas, SceneComponent],
  template: `
    <div class="fui-block fui-block-a"><div class="fui-letter-square">A</div><p>A: SPARE TIME MANAGER WAS DEVELOPED BY THE KHALAI SAINTS...</p><div class="fui-user"><h3>USER</h3><div class="fui-user-id fui-cyan">GUES 7702</div></div></div>
    <div class="fui-block fui-block-c"><div class="fui-letter-square">C</div><p>C: SPARE TIME MANAGER...</p><div class="fui-security-level"><h3>SECURITY LEVEL</h3><div class="fui-button-group"><button class="fui-btn">01</button><button class="fui-btn active-btn">02</button><button class="fui-btn">03</button><button class="fui-btn">04</button></div></div></div>
    <div class="fui-block fui-block-d"><div class="fui-letter-square">D</div><p>D: MAPS ARE PROVIDED BY REDCHO...</p><div class="fui-description"><h3>DESCRIPTION</h3></div></div>
    <div class="fui-block fui-block-braindance"><div class="fui-header fui-cyan">BRAINDANCE</div><div class="fui-text-box"><p class="fui-text-note">ONLY CC3S CERTIFIED...</p><p>Ut enim ad minim veniam...</p></div><div class="fui-badge"><span class="icon">M</span></div></div>
    <div class="fui-block fui-block-b fui-bottom"><div class="fui-letter-square">B</div><p>B: MAPS ARE PROVIDED...</p><div class="fui-device-software"><h3>DEVICE SOFTWARE</h3></div></div>

    <ngt-canvas [camera]="{ position: [0, 0, 8.5] }">
      <app-scene *canvasContent />
    </ngt-canvas>
    
    <div class="labels-overlay fui-bottom-labels">
      <div class="label-box cyan"><span class="icon">((i))</span> MOUSE WHEEL = ROTATE</div>
      <div class="label-box blue"><span class="icon">O</span> CLICK = SELECT / EXECUTE</div>
    </div>
  `,
  styles: `
    :host { display: block; width: 100%; height: 100vh; position: relative; background: radial-gradient(circle at center, #001226 0%, #000205 100%); font-family: 'Orbitron', 'JetBrains Mono', monospace; color: #99ccff; overflow: hidden; }
    .fui-block { position: absolute; width: 320px; z-index: 10; pointer-events: none; }
    .fui-block-a { top: 30px; left: 30px; } .fui-block-c { top: 30px; left: 50%; transform: translateX(-50%); width: 400px; text-align: center; } .fui-block-d { top: 30px; right: 30px; text-align: right; } .fui-block-braindance { top: 50%; right: 30px; transform: translateY(-50%); width: 380px; } .fui-bottom { bottom: 30px; left: 50%; transform: translateX(-50%); text-align: center; width: 400px; }
    .fui-letter-square { display: inline-block; width: 25px; height: 25px; line-height: 25px; text-align: center; border: 1px solid #00aaff; color: #00aaff; font-weight: 800; margin-right: 10px; box-shadow: 0 0 5px rgba(0, 170, 255, 0.3); }
    p { margin: 5px 0 10px; font-size: 0.75rem; line-height: 1.4; opacity: 0.7; } h3 { margin: 15px 0 5px; font-size: 0.8rem; font-weight: 300; letter-spacing: 1px; color: #fff; }
    .fui-cyan { color: #00f3ff; text-shadow: 0 0 10px rgba(0, 243, 255, 0.6); }
    .fui-user { margin-top: 20px; text-align: left; } .fui-user-id { font-size: 1.2rem; font-weight: 800; }
    .fui-security-level { text-align: center; pointer-events: auto; } .fui-button-group { display: flex; gap: 10px; justify-content: center; } .fui-btn { background: transparent; border: 1px solid #0055aa; color: #00f3ff; padding: 5px 15px; font-weight: 800; cursor: pointer; transition: all 0.2s; } .active-btn { background: #00aaff; color: #000; border-color: #00aaff; box-shadow: 0 0 12px rgba(0, 170, 255, 0.6); }
    .fui-text-box { margin-top: 10px; border: 1px solid #0055aa; background: rgba(0, 10, 25, 0.6); padding: 10px; font-size: 0.7rem; backdrop-filter: blur(4px); pointer-events: auto; } .fui-text-note { color: #00f3ff; font-weight: 800; margin-bottom: 5px; opacity: 1; }
    .fui-badge { text-align: center; margin-top: 15px; color: #00aaff; } .icon { font-family: monospace; opacity: 0.9; }
    .labels-overlay { position: absolute; bottom: 30px; left: 0; right: 0; display: flex; justify-content: center; gap: 15%; pointer-events: none; z-index: 20; }
    .label-box { font-size: 0.9rem; font-weight: 800; letter-spacing: 2px; display: flex; align-items: center; gap: 8px; background: rgba(0, 10, 25, 0.8); padding: 5px 15px; border-radius: 4px; backdrop-filter: blur(4px); }
    .cyan { color: #00f3ff; text-shadow: 0 0 10px rgba(0, 243, 255, 0.5); border: 1px solid #00f3ff; } .blue { color: #3399ff; text-shadow: 0 0 10px rgba(51, 153, 255, 0.5); border: 1px solid #3399ff; }
    .labels-overlay.fui-bottom-labels { bottom: 60px; }
  `
})
export class PortalHubComponent {}