import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { DashboardComponent } from './dashboard.component';
import { DataService } from '../../../../shared/services/data.service';
import { AuthService } from '../../../../core/services/auth.service';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let authService: AuthService;
  let dataService: DataService;

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [DashboardComponent, TranslateModule.forRoot()],
      providers: [DataService, AuthService],
    }).compileComponents();

    authService = TestBed.inject(AuthService);
    dataService = TestBed.inject(DataService);
    authService.login('admin', '123456');

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load current user on init', () => {
    expect(component.currentUser).toBeTruthy();
    expect(component.currentUser?.role).toBe('admin');
  });

  it('should load available projects', () => {
    expect(component.availableProjects.length).toBeGreaterThan(0);
  });

  it('should calculate active projects count', () => {
    expect(component.activeProjects).toBeGreaterThanOrEqual(0);
  });

  it('should calculate equipment stats', () => {
    expect(component.totalEquipment).toBeGreaterThan(0);
    expect(component.activeEquipment).toBeGreaterThanOrEqual(0);
  });

  it('should have last7Days data', () => {
    expect(component.last7Days.length).toBe(7);
    expect(component.last7Days[0].date).toBeTruthy();
  });

  it('should calculate project progress', () => {
    const project = component.availableProjects[0];
    if (project) {
      const progress = component.getProjectProgress(project);
      expect(progress).toBeGreaterThanOrEqual(0);
      expect(progress).toBeLessThanOrEqual(200); // Can exceed 100% in some cases
    }
  });

  it('should return correct progress ring class', () => {
    expect(component.getProgressRingClass(95)).toBe('ring-green');
    expect(component.getProgressRingClass(80)).toBe('ring-blue');
    expect(component.getProgressRingClass(60)).toBe('ring-yellow');
    expect(component.getProgressRingClass(30)).toBe('ring-red');
  });

  it('should calculate stroke dasharray', () => {
    const dasharray = component.getStrokeDasharray();
    expect(dasharray).toBeCloseTo(2 * Math.PI * 28);
  });

  it('should calculate stroke dash offset', () => {
    const offset = component.getStrokeDashoffset(50);
    expect(offset).toBeCloseTo(2 * Math.PI * 28 * 0.5);
  });

  it('should get day efficiency', () => {
    const day = component.last7Days[0];
    const eff = component.getDayEfficiency(day);
    expect(eff).toBeGreaterThan(0);
  });

  it('should return correct efficiency class', () => {
    expect(component.getEfficiencyClass(95)).toBe('eff-green');
    expect(component.getEfficiencyClass(80)).toBe('eff-blue');
    expect(component.getEfficiencyClass(60)).toBe('eff-yellow');
    expect(component.getEfficiencyClass(30)).toBe('eff-red');
  });

  it('should reset data', () => {
    const resetSpy = vi.spyOn(dataService, 'resetAllData');
    component.resetData();
    expect(resetSpy).toHaveBeenCalled();
  });
});
