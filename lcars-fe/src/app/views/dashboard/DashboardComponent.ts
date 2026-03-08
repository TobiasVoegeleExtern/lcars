import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortalHubComponent } from '../../components/portal/portal-hub';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, PortalHubComponent],
  template: `
    <div class="dashboard-container">
      <div class="dash-header">
        <div class="lcars-bar item-blue"></div>
        <h2 class="dash-title">MAIN SENSOR ARRAY // HOLOGRAPHIC_INTERFACE</h2>
        <div class="lcars-bar item-orange flex-1"></div>
      </div>

      <div class="holo-matrix-wrapper">
        <app-portal-hub></app-portal-hub>
        <div class="scanline-overlay"></div>
      </div>

      <div class="sys-stats">
        <div class="stat-box">
          <span class="label">CPU_CORE_M4</span>
          <span class="value cyan">OPTIMAL</span>
        </div>
        <div class="stat-box">
          <span class="label">NEURAL_NET</span>
          <span class="value orange">ACTIVE</span>
        </div>
        <div class="stat-box">
          <span class="label">ZONEL_SYNC</span>
          <span class="value cyan">TRUE</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container { display: flex; flex-direction: column; gap: 20px; height: 100%; }
    .dash-header { display: flex; align-items: center; gap: 15px; }
    .lcars-bar { height: 15px; border-radius: 10px; }
    .item-blue { width: 50px; background: var(--lcars-blue, #86abff); }
    .item-orange { background: var(--tron-orange, #ff9d00); }
    .flex-1 { flex: 1; }
    .dash-title { font-size: 1.2rem; letter-spacing: 3px; color: var(--tron-cyan); margin: 0; }
    
    .holo-matrix-wrapper {
      position: relative;
      /* HIER IST DIE MAGIE FÜR MEHR PLATZ: */
      min-height: 600px; 
      flex: 1;
      border-radius: 20px;
      overflow: hidden;
      border: 1px solid rgba(0, 243, 255, 0.2);
      box-shadow: inset 0 0 50px rgba(0, 0, 0, 0.8);
      
      .scanline-overlay {
        position: absolute; top: 0; left: 0; right: 0; bottom: 0;
        background: linear-gradient(to bottom, rgba(255,255,255,0) 50%, rgba(0,0,0,0.1) 50%);
        background-size: 100% 4px; pointer-events: none; z-index: 10;
      }
    }

    .sys-stats { display: flex; gap: 15px; }
    .stat-box {
      flex: 1; background: rgba(0, 243, 255, 0.05); border-left: 3px solid var(--tron-cyan);
      padding: 10px 15px; display: flex; justify-content: space-between; font-family: monospace;
    }
    .label { color: #888; }
    .cyan { color: var(--tron-cyan); }
    .orange { color: var(--tron-orange); }
  `]
})
export class DashboardComponent {}