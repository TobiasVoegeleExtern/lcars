import { Routes } from '@angular/router';

// 1. Klassische Imports ganz oben
import { DashboardComponent } from './views/dashboard/DashboardComponent';
// import { MediaDbComponent } from './pages/media-db/media-db';
// import { ActionLogComponent } from './pages/action-log/action-log';

export const routes: Routes = [
  // 1. Standard-Route: Leitet auf das Dashboard um
  { 
    path: '', 
    redirectTo: 'dashboard', 
    pathMatch: 'full' 
  },
  
  // 2. Das Hologramm-Dashboard (direkt geladen)
  { 
    path: 'dashboard', 
    component: DashboardComponent 
  },
  
//   // 3. Media Datenbank
//   { 
//     path: 'media', 
//     component: MediaDbComponent 
//   },
  
//   // 4. Action Logs
//   { 
//     path: 'logs', 
//     component: ActionLogComponent 
//   },

  // 5. Fallback: Unbekannte URLs landen wieder hier
  { 
    path: '**', 
    redirectTo: 'dashboard' 
  }
];