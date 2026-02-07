import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { AdvancedReportsComponent } from './advanced-reports.component';
import { DataService } from '../../../../shared/services/data.service';

describe('AdvancedReportsComponent', () => {
  let component: AdvancedReportsComponent;
  let fixture: ComponentFixture<AdvancedReportsComponent>;

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [AdvancedReportsComponent, TranslateModule.forRoot(), FormsModule],
      providers: [DataService],
    }).compileComponents();

    fixture = TestBed.createComponent(AdvancedReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should default to daily time range', () => {
    expect(component.selectedTimeRange).toBe('daily');
  });

  it('should default to trend view type', () => {
    expect(component.selectedViewType).toBe('trend');
  });

  it('should default to chart-table tab', () => {
    expect(component.activeTab).toBe('chart-table');
  });

  it('should load projects', () => {
    expect(component.projects.length).toBeGreaterThan(0);
  });

  it('should have time range options', () => {
    expect(component.timeRangeOptions.length).toBe(3);
  });

  it('should have view type options', () => {
    expect(component.viewTypeOptions.length).toBe(2);
  });

  it('should process data on init', () => {
    // processedData may be empty if no period achievements exist
    expect(Array.isArray(component.processedData)).toBe(true);
    expect(Array.isArray(component.cumulativeData)).toBe(true);
  });

  it('should compute total planned', () => {
    expect(typeof component.totalPlanned).toBe('number');
  });

  it('should compute total achieved', () => {
    expect(typeof component.totalAchieved).toBe('number');
  });

  it('should compute average efficiency', () => {
    expect(typeof component.avgEfficiency).toBe('number');
  });

  it('should compute trend indicator', () => {
    const indicator = component.trendIndicator;
    expect(['↗', '↘', '↔']).toContain(indicator);
  });

  it('should get trend label', () => {
    const label = component.trendLabel;
    expect(['صعودی', 'نزولی', 'خنثی']).toContain(label);
  });

  it('should get trend class', () => {
    const cls = component.trendClass;
    expect(['trend-up', 'trend-down', 'trend-neutral']).toContain(cls);
  });

  it('should get efficiency class', () => {
    expect(component.getEfficiencyClass(96)).toBe('eff-green');
    expect(component.getEfficiencyClass(92)).toBe('eff-blue');
    expect(component.getEfficiencyClass(85)).toBe('eff-yellow');
    expect(component.getEfficiencyClass(70)).toBe('eff-red');
  });

  it('should get bar width capped at 100', () => {
    expect(component.getBarWidth(120)).toBe(100);
    expect(component.getBarWidth(80)).toBe(80);
  });

  it('should get time range label', () => {
    expect(component.getTimeRangeLabel()).toBe('روزانه');
    component.selectedTimeRange = 'monthly';
    expect(component.getTimeRangeLabel()).toBe('ماهانه');
  });

  it('should handle project change', () => {
    component.selectedProjectId = component.projects[0]?.id || '';
    component.onProjectChange();
    expect(component.selectedOperationId).toBe('');
  });

  it('should handle view type change', () => {
    component.selectedViewType = 'cumulative';
    component.onViewTypeChange();
    expect(Array.isArray(component.cumulativeData)).toBe(true);
  });

  it('should report hasData correctly', () => {
    expect(typeof component.hasData).toBe('boolean');
  });
});
