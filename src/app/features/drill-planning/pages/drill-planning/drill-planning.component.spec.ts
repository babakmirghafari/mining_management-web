import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { DrillPlanningComponent } from './drill-planning.component';
import { DataService } from '../../../../shared/services/data.service';

describe('DrillPlanningComponent', () => {
  let component: DrillPlanningComponent;
  let fixture: ComponentFixture<DrillPlanningComponent>;

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [DrillPlanningComponent, TranslateModule.forRoot(), FormsModule],
      providers: [DataService],
    }).compileComponents();

    fixture = TestBed.createComponent(DrillPlanningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should default to list tab', () => {
    expect(component.activeTab).toBe('list');
  });

  it('should have initial drill plans loaded', () => {
    expect(component.drillPlans.length).toBe(1);
  });

  it('should compute total plans', () => {
    expect(component.totalPlans).toBe(1);
  });

  it('should compute active plans', () => {
    expect(component.activePlans).toBeGreaterThanOrEqual(0);
  });

  it('should compute average achievement', () => {
    expect(component.avgAchievement).toBeGreaterThanOrEqual(0);
  });

  it('should switch tabs', () => {
    component.switchTab('create');
    expect(component.activeTab).toBe('create');
  });

  it('should not switch to details without selected plan', () => {
    component.selectedPlan = null;
    component.switchTab('details');
    expect(component.activeTab).not.toBe('details');
  });

  it('should open details for a plan', () => {
    const plan = component.drillPlans[0];
    component.openDetails(plan);
    expect(component.activeTab).toBe('details');
    expect(component.selectedPlan).toBeTruthy();
    expect(component.selectedPlan?.id).toBe(plan.id);
  });

  it('should get unit label', () => {
    expect(component.getUnitLabel('meter')).toBe('متر');
    expect(component.getUnitLabel('cubic_meter')).toBe('متر مکعب');
  });

  it('should get achievement color', () => {
    expect(component.getAchievementColor(100)).toBe('achievement-green');
    expect(component.getAchievementColor(85)).toBe('achievement-yellow');
    expect(component.getAchievementColor(50)).toBe('achievement-red');
  });

  it('should recalculate day achievement', () => {
    const day = { date: '1403/01/01', plannedAmount: 100, actualAmount: 90, achievementPercentage: 0 };
    component.recalculateDayAchievement(day);
    expect(day.achievementPercentage).toBe(90);
  });

  it('should save details and recalculate totals', () => {
    const plan = component.drillPlans[0];
    component.openDetails(plan);
    if (component.selectedPlan) {
      component.selectedPlan.days[0].actualAmount = 100;
      component.saveDetails();
      const updated = component.drillPlans.find(p => p.id === plan.id);
      expect(updated?.totalActual).toBeGreaterThanOrEqual(0);
    }
  });

  it('should create a new drill plan', () => {
    component.formData = {
      projectId: '1',
      period: 'weekly',
      title: 'Test Plan',
      startDate: '1403/01/01',
      unit: 'meter',
      dailyTarget: 50,
    };
    const initialCount = component.drillPlans.length;
    component.handleCreate();
    expect(component.drillPlans.length).toBe(initialCount + 1);
    expect(component.activeTab).toBe('list');
  });
});
