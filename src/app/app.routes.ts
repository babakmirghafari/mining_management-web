import { Routes } from '@angular/router';
import { AppShellComponent } from './core/components/layout/app-shell/app-shell.component';
import { AuthGuard } from './core/services/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadChildren: () =>
      import('./features/login/login.routes').then(m => m.LOGIN_ROUTES)
  },
  {
    path: '',
    component: AppShellComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./features/dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES)
      },
      {
        path: 'users',
        loadChildren: () =>
          import('./features/user-management/user-management.routes').then(m => m.USER_MANAGEMENT_ROUTES)
      },
      {
        path: 'projects',
        loadChildren: () =>
          import('./features/project-management/project-management.routes').then(m => m.PROJECT_MANAGEMENT_ROUTES)
      },
      {
        path: 'equipment',
        loadChildren: () =>
          import('./features/equipment-management/equipment-management.routes').then(m => m.EQUIPMENT_MANAGEMENT_ROUTES)
      },
      {
        path: 'planning',
        loadChildren: () =>
          import('./features/planning/planning.routes').then(m => m.PLANNING_ROUTES)
      },
      {
        path: 'period-planning',
        loadChildren: () =>
          import('./features/period-planning/period-planning.routes').then(m => m.PERIOD_PLANNING_ROUTES)
      },
      {
        path: 'drill-planning',
        loadChildren: () =>
          import('./features/drill-planning/drill-planning.routes').then(m => m.DRILL_PLANNING_ROUTES)
      },
      {
        path: 'achievements',
        loadChildren: () =>
          import('./features/achievements/achievements.routes').then(m => m.ACHIEVEMENTS_ROUTES)
      },
      {
        path: 'period-achievements',
        loadChildren: () =>
          import('./features/period-achievements/period-achievements.routes').then(m => m.PERIOD_ACHIEVEMENTS_ROUTES)
      },
      {
        path: 'reports',
        loadChildren: () =>
          import('./features/reports/reports.routes').then(m => m.REPORTS_ROUTES)
      },
      {
        path: 'advanced-reports',
        loadChildren: () =>
          import('./features/advanced-reports/advanced-reports.routes').then(m => m.ADVANCED_REPORTS_ROUTES)
      },
      {
        path: 'delay-reasons',
        loadChildren: () =>
          import('./features/delay-reasons/delay-reasons.routes').then(m => m.DELAY_REASONS_ROUTES)
      },
      {
        path: 'daily-planning',
        loadChildren: () =>
          import('./features/daily-planning/daily-planning.routes').then(m => m.DAILY_PLANNING_ROUTES)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    loadChildren: () =>
      import('./features/not-found/not-found.routes').then(m => m.NOT_FOUND_ROUTES)
  }
];
