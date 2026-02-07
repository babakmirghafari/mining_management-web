import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { provideRouter } from '@angular/router';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authService: AuthService;
  let router: Router;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        AuthGuard,
        AuthService,
      ],
    });
    guard = TestBed.inject(AuthGuard);
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should return false when user is not authenticated', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');
    const result = guard.canActivate();
    expect(result).toBe(false);
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  });

  it('should return true when user is authenticated', () => {
    authService.login('admin', '123456');
    const result = guard.canActivate();
    expect(result).toBe(true);
  });

  it('should navigate to login when not authenticated', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');
    guard.canActivate();
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  });

  it('should not navigate when authenticated', () => {
    authService.login('admin', '123456');
    const navigateSpy = vi.spyOn(router, 'navigate');
    guard.canActivate();
    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('should deny access after logout', () => {
    authService.login('admin', '123456');
    expect(guard.canActivate()).toBe(true);
    authService.logout();
    expect(guard.canActivate()).toBe(false);
  });
});
