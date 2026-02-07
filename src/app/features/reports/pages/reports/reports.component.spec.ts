import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { ReportsComponent } from './reports.component';
import { DataService } from '../../../../shared/services/data.service';

describe('ReportsComponent', () => {
  let component: ReportsComponent;
  let fixture: ComponentFixture<ReportsComponent>;

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [ReportsComponent, TranslateModule.forRoot(), FormsModule],
      providers: [DataService],
    }).compileComponents();

    fixture = TestBed.createComponent(ReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should default to performance tab', () => {
    expect(component.activeTab).toBe('performance');
  });

  it('should have 6 tabs', () => {
    expect(component.tabs.length).toBe(6);
  });

  it('should have daily efficiency data', () => {
    expect(component.dailyEfficiencyData.length).toBe(10);
  });

  it('should have monthly data', () => {
    expect(component.monthlyData.length).toBe(6);
  });

  it('should compute total planned', () => {
    const expected = component.monthlyData.reduce((s, m) => s + m.planned, 0);
    expect(component.totalPlanned).toBe(expected);
  });

  it('should compute total achieved', () => {
    const expected = component.monthlyData.reduce((s, m) => s + m.achieved, 0);
    expect(component.totalAchieved).toBe(expected);
  });

  it('should compute average efficiency', () => {
    expect(component.avgEfficiency).toBeGreaterThan(0);
    expect(component.avgEfficiency).toBeLessThanOrEqual(100);
  });

  it('should compute total records', () => {
    expect(component.totalRecords).toBe(
      component.dailyEfficiencyData.length + component.monthlyData.length
    );
  });

  it('should compute total delay value', () => {
    expect(component.totalDelayValue).toBe(100);
  });

  it('should get efficiency class', () => {
    expect(component.getEfficiencyClass(96)).toBe('eff-green');
    expect(component.getEfficiencyClass(92)).toBe('eff-blue');
    expect(component.getEfficiencyClass(85)).toBe('eff-yellow');
    expect(component.getEfficiencyClass(70)).toBe('eff-red');
  });

  it('should get status badge', () => {
    expect(component.getStatusBadge(100)).toBe('فراتر از برنامه');
    expect(component.getStatusBadge(96)).toBe('عالی');
    expect(component.getStatusBadge(92)).toBe('خوب');
    expect(component.getStatusBadge(85)).toBe('قابل قبول');
    expect(component.getStatusBadge(70)).toBe('نیاز به بهبود');
  });

  it('should get month trend', () => {
    const trend = component.getMonthTrend(0);
    expect(trend).toBe('—');
    const trend1 = component.getMonthTrend(1);
    expect(['↑', '↓']).toContain(trend1);
  });

  it('should get operator grade', () => {
    expect(component.getOperatorGrade(96)).toBe('A');
    expect(component.getOperatorGrade(92)).toBe('B');
    expect(component.getOperatorGrade(70)).toBe('C');
  });

  it('should get severity label', () => {
    expect(component.getSeverityLabel('critical')).toBe('بحرانی');
    expect(component.getSeverityLabel('warning')).toBe('هشدار');
    expect(component.getSeverityLabel('normal')).toBe('عادی');
  });

  it('should load projects', () => {
    expect(component.projects.length).toBeGreaterThan(0);
  });
});
