import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { provideRouter, Router } from '@angular/router';
import { AppShellComponent } from './app-shell.component';
import { AuthService } from '../../../services/auth.service';

describe('AppShellComponent', () => {
  let component: AppShellComponent;
  let fixture: ComponentFixture<AppShellComponent>;
  let authService: AuthService;
  let router: Router;

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [AppShellComponent, TranslateModule.forRoot()],
      providers: [
        provideRouter([]),
        AuthService,
      ],
    }).compileComponents();

    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    // Pre-login so currentUser is available
    authService.login('admin', '123456');

    fixture = TestBed.createComponent(AppShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have sidebarOpen default to true', () => {
    expect(component.sidebarOpen).toBe(true);
  });

  it('should toggle sidebar', () => {
    expect(component.sidebarOpen).toBe(true);
    component.toggleSidebar();
    expect(component.sidebarOpen).toBe(false);
    component.toggleSidebar();
    expect(component.sidebarOpen).toBe(true);
  });

  it('should have currentUser set after login', () => {
    expect(component.currentUser).toBeTruthy();
    expect(component.currentUser?.username).toBe('admin');
  });

  it('should return correct userRoleLabel for admin', () => {
    expect(component.userRoleLabel).toBe('common.role_admin');
  });

  it('should return correct menu items for admin', () => {
    const items = component.menuItems;
    expect(items.length).toBeGreaterThan(1);
    expect(items[0].id).toBe('dashboard');
    const ids = items.map(i => i.id);
    expect(ids).toContain('users');
    expect(ids).toContain('projects');
    expect(ids).toContain('equipment');
  });

  it('should navigate on onNavigate', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');
    component.onNavigate('dashboard');
    expect(navigateSpy).toHaveBeenCalledWith(['/', 'dashboard']);
  });

  it('should logout and navigate to login', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');
    component.logout();
    expect(authService.isAuthenticated()).toBe(false);
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  });

  it('should return empty string for userRoleLabel when no user', () => {
    authService.logout();
    component.currentUser = authService.getCurrentUser();
    expect(component.userRoleLabel).toBe('');
  });

  it('should return empty menu items when no user', () => {
    authService.logout();
    component.currentUser = null;
    expect(component.menuItems).toEqual([]);
  });
});
