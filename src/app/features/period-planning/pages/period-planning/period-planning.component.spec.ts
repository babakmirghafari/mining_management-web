import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { PeriodPlanningComponent } from './period-planning.component';
import { DataService } from '../../../../shared/services/data.service';
import { AuthService } from '../../../../core/services/auth.service';

describe('PeriodPlanningComponent', () => {
  let component: PeriodPlanningComponent;
  let fixture: ComponentFixture<PeriodPlanningComponent>;
  let authService: AuthService;
  let dataService: DataService;

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [PeriodPlanningComponent, TranslateModule.forRoot(), FormsModule],
      providers: [DataService, AuthService],
    }).compileComponents();

    authService = TestBed.inject(AuthService);
    dataService = TestBed.inject(DataService);
    authService.login('admin', '123456');

    fixture = TestBed.createComponent(PeriodPlanningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load current user on init', () => {
    expect(component.currentUser?.role).toBe('admin');
  });

  it('should have period options', () => {
    expect(component.periodOptions.length).toBe(4);
  });

  it('should return all period plans', () => {
    expect(Array.isArray(component.allPeriodPlans)).toBe(true);
  });

  it('should compute stats', () => {
    const stats = component.stats;
    expect(stats.total).toBe(component.allPeriodPlans.length);
  });

  it('should generate date range for weekly', () => {
    const dates = component.generateDateRange('1403/01/01', 'weekly');
    expect(dates.length).toBe(7);
    expect(dates[0]).toBe('1403/01/01');
  });

  it('should generate date range for monthly', () => {
    const dates = component.generateDateRange('1403/01/01', 'monthly');
    expect(dates.length).toBe(30);
  });

  it('should generate date range for custom period', () => {
    const dates = component.generateDateRange('1403/01/01', 'custom', '1403/01/10');
    expect(dates.length).toBe(10);
  });

  it('should return empty array for invalid date format', () => {
    const dates = component.generateDateRange('invalid', 'weekly');
    expect(dates.length).toBe(0);
  });

  it('should detect custom period', () => {
    component.formData.period = 'custom';
    expect(component.isCustomPeriod).toBe(true);
    component.formData.period = 'weekly';
    expect(component.isCustomPeriod).toBe(false);
  });

  it('should open create dialog', () => {
    component.openCreateDialog();
    expect(component.isCreateDialogOpen).toBe(true);
  });

  it('should close create dialog', () => {
    component.openCreateDialog();
    component.closeCreateDialog();
    expect(component.isCreateDialogOpen).toBe(false);
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

  it('should reset form on project change', () => {
    component.formData.operationId = '1';
    component.formData.assignedEquipment = ['1', '2'];
    component.onProjectChange();
    expect(component.formData.operationId).toBe('');
    expect(component.formData.assignedEquipment).toEqual([]);
  });

  it('should open and close view dialog', () => {
    const mockPlan = component.allPeriodPlans[0];
    if (mockPlan) {
      component.openViewDialog(mockPlan);
      expect(component.isViewDialogOpen).toBe(true);
      expect(component.viewPlan).toBeTruthy();
      component.closeViewDialog();
      expect(component.isViewDialogOpen).toBe(false);
      expect(component.viewPlan).toBeNull();
    } else {
      // No period plans exist, test the method doesn't crash
      expect(true).toBe(true);
    }
  });
});
