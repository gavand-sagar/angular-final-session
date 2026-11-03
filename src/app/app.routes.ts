import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'templates' },
  { path: 'templates', title: 'Templates', loadComponent: () => import('./templates/templates.page') },
  { path: 'rxjs', title: 'RxJS', loadComponent: () => import('./rxjs/rxjs.page') },
  { path: 'performance', title: 'Performance', loadComponent: () => import('./performance/performance.page') },
];
