import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortalHubComponent } from '../../components/portal/portal-hub';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, PortalHubComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent {}