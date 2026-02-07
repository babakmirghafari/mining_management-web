import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { PlanningComponent } from './planning.component';
import { DataService } from '../../../../shared/services/data.service';
import { AuthService } from '../../../../core/services/auth.service';

describe('PlanningComponent', () => {
  let component: PlanningComponent;
  let fixture: ComponentFixture<PlanningComponent>;
  let authService: AuthService;
  let dataService: DataService;

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [PlanningComponent, TranslateModule.forRoot(), FormsModule],
      providers: [DataService, AuthService],
    }).compileComponents();

    authService = TestBed.inject(AuthService);
    dataService = TestBed.inject(DataService);
    authService.login('admin', '123456');

    fixture = TestBed.createComponent(PlanningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should default to daily tab', () => {
    expect(component.activeTab).toBe('daily');
  });

  it('should switch tabs', () => {
    component.setActiveTab('weekly');
    expect(component.activeTab).toBe('weekly');
    component.setActiveTab('monthly');
    expect(component.activeTab).toBe('monthly');
  });

  it('should return all plans for admin', () => {
    expect(component.allPlans.length).toBe(dataService.plans.length);
  });

  it('should filter plans by active tab', () => {
    const daily = component.filteredPlans;
    daily.forEach(p => expect(p.type).toBe('daily'));
  });

  it('should compute stats', () => {
    const stats = component.stats;
    expect(stats.total).toBe(component.allPlans.length);
    expect(stats.active).toBeGreaterThanOrEqual(0);
  });

  it('should get project name', () => {
    const project = dataService.projects[0];
    expect(component.getProjectName(project.id)).toBe(project.name);
    expect(component.getProjectName('nonexistent')).toBe('-');
  });

  it('should get priority info', () => {
    const info = component.getPriorityInfo('high');
    expect(info.label).toBe('بالا');
  });

  it('should get status info', () => {
    const info = component.getStatusInfo('draft');
    expect(info.label).toBe('پیش‌نویس');
  });

  it('should get transition label', () => {
    expect(component.getTransitionLabel('draft')).toBe('تایید');
    expect(component.getTransitionLabel('approved')).toBe('فعال‌سازی');
    expect(component.getTransitionLabel('active')).toBe('تکمیل');
    expect(component.getTransitionLabel('completed')).toBeNull();
  });

  it('should get next status', () => {
    expect(component.getNextStatus('draft')).toBe('approved');
    expect(component.getNextStatus('approved')).toBe('active');
    expect(component.getNextStatus('active')).toBe('completed');
    expect(component.getNextStatus('completed')).toBeNull();
  });

  it('should open add dialog with active tab type', () => {
    component.setActiveTab('weekly');
    component.openAddDialog();
    expect(component.isDialogOpen).toBe(true);
    expect(component.formData.type).toBe('weekly');
  });

  it('should close dialog and reset form', () => {
    component.openAddDialog();
    component.closeDialog();
    expect(component.isDialogOpen).toBe(false);
    expect(component.selectedPlan).toBeNull();
  });

  it('should toggle equipment selection', () => {
    component.toggleEquipment('1');
    expect(component.isEquipmentSelected('1')).toBe(true);
    component.toggleEquipment('1');
    expect(component.isEquipmentSelected('1')).toBe(false);
  });

  it('should toggle operator selection', () => {
    component.toggleOperator('1');
    expect(component.isOperatorSelected('1')).toBe(true);
    component.toggleOperator('1');
    expect(component.isOperatorSelected('1')).toBe(false);
  });
});
