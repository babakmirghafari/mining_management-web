import { TestBed } from '@angular/core/testing';
import { AuthService, User } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should not be authenticated by default', () => {
    expect(service.isAuthenticated()).toBe(false);
    expect(service.getCurrentUser()).toBeNull();
  });

  it('should login with valid credentials (admin)', () => {
    const result = service.login('admin', '123456');
    expect(result.success).toBe(true);
    expect(result.user).toBeDefined();
    expect(result.user!.username).toBe('admin');
    expect(result.user!.role).toBe('admin');
    expect(service.isAuthenticated()).toBe(true);
  });

  it('should login with valid credentials (project_manager)', () => {
    const result = service.login('ali_pm', '123456');
    expect(result.success).toBe(true);
    expect(result.user!.role).toBe('project_manager');
    expect(result.user!.assignedProjects).toEqual(['1', '2']);
  });

  it('should login with valid credentials (operator)', () => {
    const result = service.login('operator1', '123456');
    expect(result.success).toBe(true);
    expect(result.user!.role).toBe('operator');
  });

  it('should fail login with wrong password', () => {
    const result = service.login('admin', 'wrongpass');
    expect(result.success).toBe(false);
    expect(result.error).toBeTruthy();
    expect(service.isAuthenticated()).toBe(false);
  });

  it('should fail login with unknown username', () => {
    const result = service.login('unknown', '123456');
    expect(result.success).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it('should persist user to localStorage on login', () => {
    service.login('admin', '123456');
    const saved = localStorage.getItem('currentUser');
    expect(saved).toBeTruthy();
    const parsed = JSON.parse(saved!);
    expect(parsed.username).toBe('admin');
  });

  it('should logout and clear user', () => {
    service.login('admin', '123456');
    expect(service.isAuthenticated()).toBe(true);
    service.logout();
    expect(service.isAuthenticated()).toBe(false);
    expect(service.getCurrentUser()).toBeNull();
    expect(localStorage.getItem('currentUser')).toBeNull();
  });

  it('should return mock users list', () => {
    const users = service.getMockUsers();
    expect(users.length).toBe(3);
    expect(users[0].username).toBe('admin');
  });

  it('should restore user from localStorage on construction', () => {
    const mockUser: User = { id: '1', name: 'Test', username: 'admin', role: 'admin' };
    localStorage.setItem('currentUser', JSON.stringify(mockUser));

    // Create a new instance
    const newService = new AuthService();
    expect(newService.isAuthenticated()).toBe(true);
    expect(newService.getCurrentUser()?.username).toBe('admin');
  });
});
