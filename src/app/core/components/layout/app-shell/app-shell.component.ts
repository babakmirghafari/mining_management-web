import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { filter } from 'rxjs/operators';
import { MenuComponent, MenuItem } from '../../menu/menu.component';
import { AuthService, User } from '../../../services/auth.service';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet, TranslateModule, MenuComponent],
  templateUrl: './app-shell.component.html',
  styleUrl: './app-shell.component.scss'
})
export class AppShellComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  sidebarOpen = true;
  activeRoute = '';
  currentUser: User | null = null;

  constructor() {
    this.currentUser = this.authService.getCurrentUser();
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(event => {
        const urlSegments = event.urlAfterRedirects.split('/').filter(Boolean);
        this.activeRoute = urlSegments[0] || 'dashboard';
      });
  }

  get menuItems(): MenuItem[] {
    if (!this.currentUser) return [];

    const base: MenuItem[] = [
      { id: 'dashboard', route: 'dashboard', label: 'menu.dashboard', icon: '📊' }
    ];

    if (this.currentUser.role === 'admin') {
      return [
        ...base,
        { id: 'users', route: 'users', label: 'menu.users', icon: '👥' },
        { id: 'projects', route: 'projects', label: 'menu.projects', icon: '🏗️' },
        { id: 'equipment', route: 'equipment', label: 'menu.equipment', icon: '🚛' },
        { id: 'delay-reasons', route: 'delay-reasons', label: 'menu.delay_reasons', icon: '⚠️' },
        { id: 'period-planning', route: 'period-planning', label: 'menu.period_planning', icon: '📊' },
        { id: 'period-achievements', route: 'period-achievements', label: 'menu.period_achievements', icon: '📈' },
        { id: 'reports', route: 'reports', label: 'menu.reports', icon: '📋' },
        { id: 'advanced-reports', route: 'advanced-reports', label: 'menu.advanced_reports', icon: '📊' }
      ];
    }

    if (this.currentUser.role === 'project_manager') {
      return [
        ...base,
        { id: 'users', route: 'users', label: 'menu.operators', icon: '👤' },
        { id: 'projects', route: 'projects', label: 'menu.my_projects', icon: '🏗️' },
        { id: 'equipment', route: 'equipment', label: 'menu.project_equipment', icon: '🚛' },
        { id: 'delay-reasons', route: 'delay-reasons', label: 'menu.delay_reasons', icon: '⚠️' },
        { id: 'period-planning', route: 'period-planning', label: 'menu.period_planning', icon: '📊' },
        { id: 'period-achievements', route: 'period-achievements', label: 'menu.period_achievements', icon: '📈' },
        { id: 'reports', route: 'reports', label: 'menu.project_reports', icon: '📋' },
        { id: 'advanced-reports', route: 'advanced-reports', label: 'menu.advanced_reports', icon: '📊' }
      ];
    }

    return base;
  }

  get userRoleLabel(): string {
    if (!this.currentUser) return '';
    switch (this.currentUser.role) {
      case 'admin': return 'common.role_admin';
      case 'project_manager': return 'common.role_project_manager';
      case 'operator': return 'common.role_operator';
      default: return '';
    }
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  onNavigate(route: string): void {
    this.router.navigate(['/', route]);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
