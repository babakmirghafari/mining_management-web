import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { PeriodAchievementsComponent } from './period-achievements.component';
import { DataService } from '../../../../shared/services/data.service';
import { AuthService } from '../../../../core/services/auth.service';

describe('PeriodAchievementsComponent', () => {
  let component: PeriodAchievementsComponent;
  let fixture: ComponentFixture<PeriodAchievementsComponent>;
  let authService: AuthService;
  let dataService: DataService;

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [PeriodAchievementsComponent, TranslateModule.forRoot(), FormsModule],
      providers: [DataService, AuthService],
    }).compileComponents();

    authService = TestBed.inject(AuthService);
    dataService = TestBed.inject(DataService);
    authService.login('admin', '123456');

    fixture = TestBed.createComponent(PeriodAchievementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should default to list tab', () => {
    expect(component.activeTab).toBe('list');
  });

  it('should load current user', () => {
    expect(component.currentUser?.role).toBe('admin');
  });

  it('should return all period achievements', () => {
    expect(Array.isArray(component.allAchievements)).toBe(true);
  });

  it('should compute stats', () => {
    const stats = component.stats;
    expect(stats.total).toBe(component.allAchievements.length);
    expect(stats.avgAchievement).toBeGreaterThanOrEqual(0);
  });

  it('should get period label', () => {
    expect(component.getPeriodLabel('weekly')).toBe('هفتگی');
    expect(component.getPeriodLabel('monthly')).toBe('ماهانه');
    expect(component.getPeriodLabel('yearly')).toBe('سالانه');
  });

  it('should get overall status info', () => {
    const info = component.getOverallStatusInfo('on_track');
    expect(info.label).toBe('در مسیر');
    expect(info.color).toBe('status-blue');
  });

  it('should get day status label', () => {
    expect(component.getDayStatusLabel('not_started')).toBe('شروع نشده');
    expect(component.getDayStatusLabel('completed')).toBe('تکمیل شده');
  });

  it('should get achievement class', () => {
    expect(component.getAchievementClass(100)).toBe('achievement-high');
    expect(component.getAchievementClass(85)).toBe('achievement-good');
    expect(component.getAchievementClass(65)).toBe('achievement-mid');
    expect(component.getAchievementClass(40)).toBe('achievement-low');
  });

  it('should go back to list', () => {
    component.activeTab = 'details';
    component.goBackToList();
    expect(component.activeTab).toBe('list');
    expect(component.selectedAchievement).toBeNull();
  });

  it('should recalculate totals', () => {
    // Test with a mock selectedAchievement
    component.selectedAchievement = {
      id: '1',
      periodPlanId: '1',
      planTitle: 'Test',
      projectId: '1',
      projectName: 'Test',
      operationId: '1',
      operationName: 'Test',
      period: 'weekly',
      startDate: '1403/01/01',
      endDate: '1403/01/07',
      unit: 'meter',
      days: [
        { date: '1403/01/01', plannedAmount: 100, achievedAmount: 80, achievementPercentage: 80, status: 'in_progress', delayReasons: [], delayDescription: '', notes: '', operatorHours: [], equipmentHours: [], reportedBy: '', reportedAt: '' },
        { date: '1403/01/02', plannedAmount: 100, achievedAmount: 90, achievementPercentage: 90, status: 'in_progress', delayReasons: [], delayDescription: '', notes: '', operatorHours: [], equipmentHours: [], reportedBy: '', reportedAt: '' },
      ],
      totalPlanned: 200,
      totalAchieved: 170,
      overallAchievement: 85,
      overallStatus: 'on_track',
      createdBy: '1',
      createdAt: '',
      updatedAt: '',
    };

    component.recalculateTotals();
    expect(component.selectedAchievement.totalPlanned).toBe(200);
    expect(component.selectedAchievement.totalAchieved).toBe(170);
    expect(component.selectedAchievement.overallAchievement).toBe(85);
  });

  it('should update achievement percentage on amount change', () => {
    component.selectedAchievement = {
      id: '1', periodPlanId: '1', planTitle: 'T', projectId: '1', projectName: 'T',
      operationId: '1', operationName: 'T', period: 'weekly',
      startDate: '', endDate: '', unit: 'meter',
      days: [
        { date: '1403/01/01', plannedAmount: 100, achievedAmount: 50, achievementPercentage: 0, status: 'in_progress', delayReasons: [], delayDescription: '', notes: '', operatorHours: [], equipmentHours: [], reportedBy: '', reportedAt: '' },
      ],
      totalPlanned: 100, totalAchieved: 50, overallAchievement: 50, overallStatus: 'delayed',
      createdBy: '1', createdAt: '', updatedAt: '',
    };

    component.onAchievedAmountChange(0);
    expect(component.selectedAchievement.days[0].achievementPercentage).toBe(50);
  });
});
