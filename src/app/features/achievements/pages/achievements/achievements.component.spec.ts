import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { AchievementsComponent } from './achievements.component';
import { DataService } from '../../../../shared/services/data.service';
import { AuthService } from '../../../../core/services/auth.service';

describe('AchievementsComponent', () => {
  let component: AchievementsComponent;
  let fixture: ComponentFixture<AchievementsComponent>;
  let authService: AuthService;
  let dataService: DataService;

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [AchievementsComponent, TranslateModule.forRoot(), FormsModule],
      providers: [DataService, AuthService],
    }).compileComponents();

    authService = TestBed.inject(AuthService);
    dataService = TestBed.inject(DataService);
    authService.login('admin', '123456');

    fixture = TestBed.createComponent(AchievementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have showForm false by default', () => {
    expect(component.showForm).toBe(false);
  });

  it('should load achievements', () => {
    expect(component.allAchievements.length).toBe(dataService.achievements.length);
  });

  it('should compute stats', () => {
    const stats = component.stats;
    expect(stats.total).toBe(component.allAchievements.length);
    expect(stats.avgEfficiency).toBeGreaterThanOrEqual(0);
  });

  it('should compute efficiency preview', () => {
    component.formData.plannedAmount = 100;
    component.formData.achievedAmount = 80;
    expect(component.efficiencyPreview).toBe(80);
  });

  it('should return 0 efficiency preview when planned is 0', () => {
    component.formData.plannedAmount = 0;
    component.formData.achievedAmount = 50;
    expect(component.efficiencyPreview).toBe(0);
  });

  it('should show delay reasons when achieved < planned', () => {
    component.formData.plannedAmount = 100;
    component.formData.achievedAmount = 80;
    expect(component.showDelayReasons).toBe(true);
  });

  it('should not show delay reasons when achieved >= planned', () => {
    component.formData.plannedAmount = 100;
    component.formData.achievedAmount = 100;
    expect(component.showDelayReasons).toBe(false);
  });

  it('should get efficiency icon', () => {
    expect(component.getEfficiencyIcon(100)).toBe('✓');
    expect(component.getEfficiencyIcon(75)).toBe('↗');
    expect(component.getEfficiencyIcon(30)).toBe('✗');
  });

  it('should get efficiency class', () => {
    expect(component.getEfficiencyClass(100)).toBe('efficiency-high');
    expect(component.getEfficiencyClass(75)).toBe('efficiency-mid');
    expect(component.getEfficiencyClass(30)).toBe('efficiency-low');
  });

  it('should get status label', () => {
    expect(component.getStatusLabel('completed')).toBe('تکمیل شده');
    expect(component.getStatusLabel('partial')).toBe('تکمیل جزئی');
    expect(component.getStatusLabel('failed')).toBe('عدم تحقق');
  });

  it('should toggle delay reason selection', () => {
    component.toggleDelayReason('equipment_failure');
    expect(component.isDelayReasonSelected('equipment_failure')).toBe(true);
    component.toggleDelayReason('equipment_failure');
    expect(component.isDelayReasonSelected('equipment_failure')).toBe(false);
  });

  it('should open add form', () => {
    component.openAddForm();
    expect(component.showForm).toBe(true);
    expect(component.editingAchievement).toBeNull();
  });

  it('should go back from form', () => {
    component.openAddForm();
    component.goBack();
    expect(component.showForm).toBe(false);
  });

  it('should add operator hours', () => {
    const initialCount = component.formData.operatorHours.length;
    component.addOperatorHour();
    expect(component.formData.operatorHours.length).toBe(initialCount + 1);
  });

  it('should remove operator hours', () => {
    component.addOperatorHour();
    component.addOperatorHour();
    component.removeOperatorHour(0);
    expect(component.formData.operatorHours.length).toBe(1);
  });

  it('should add equipment hours', () => {
    component.addEquipmentHour();
    expect(component.formData.equipmentHours.length).toBe(1);
  });

  it('should remove equipment hours', () => {
    component.addEquipmentHour();
    component.addEquipmentHour();
    component.removeEquipmentHour(0);
    expect(component.formData.equipmentHours.length).toBe(1);
  });
});
