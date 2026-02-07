import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { provideRouter, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './login.component';
import { AuthService } from '../../../../core/services/auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;
  let router: Router;

  beforeEach(async () => {
    vi.useFakeTimers();
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [LoginComponent, TranslateModule.forRoot(), FormsModule],
      providers: [
        provideRouter([]),
        AuthService,
      ],
    }).compileComponents();

    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have empty username by default', () => {
    expect(component.username).toBe('');
  });

  it('should have empty password by default', () => {
    expect(component.password).toBe('');
  });

  it('should have loading false by default', () => {
    expect(component.loading).toBe(false);
  });

  it('should have empty errorMessage by default', () => {
    expect(component.errorMessage).toBe('');
  });

  it('should set loading to true on submit', () => {
    component.username = 'admin';
    component.password = '123456';
    component.onSubmit();
    expect(component.loading).toBe(true);
  });

  it('should login successfully with correct credentials', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');
    component.username = 'admin';
    component.password = '123456';
    component.onSubmit();
    vi.advanceTimersByTime(1000);
    expect(component.loading).toBe(false);
    expect(component.errorMessage).toBe('');
    expect(navigateSpy).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should show error message with wrong credentials', () => {
    component.username = 'admin';
    component.password = 'wrong';
    component.onSubmit();
    vi.advanceTimersByTime(1000);
    expect(component.loading).toBe(false);
    expect(component.errorMessage).toBeTruthy();
  });

  it('should redirect to dashboard if already authenticated', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');
    authService.login('admin', '123456');

    // Creating a new component instance triggers the constructor check
    const fixture2 = TestBed.createComponent(LoginComponent);
    fixture2.detectChanges();
    expect(navigateSpy).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should clear error message on new submit', () => {
    component.username = 'admin';
    component.password = 'wrong';
    component.onSubmit();
    vi.advanceTimersByTime(1000);
    expect(component.errorMessage).toBeTruthy();

    component.password = '123456';
    component.onSubmit();
    expect(component.errorMessage).toBe('');
  });
});
