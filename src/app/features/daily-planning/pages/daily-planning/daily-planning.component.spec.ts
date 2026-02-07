import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { DailyPlanningComponent } from './daily-planning.component';
import { DataService } from '../../../../shared/services/data.service';
import { DayPlan } from '../../../../shared/models/data.models';

describe('DailyPlanningComponent', () => {
  let component: DailyPlanningComponent;
  let fixture: ComponentFixture<DailyPlanningComponent>;
  let dataService: DataService;

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [DailyPlanningComponent, TranslateModule.forRoot(), FormsModule],
      providers: [DataService],
    }).compileComponents();

    dataService = TestBed.inject(DataService);

    fixture = TestBed.createComponent(DailyPlanningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    component.ngOnDestroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should subscribe to periodPlans$ on init', () => {
    expect(Array.isArray(component.periodPlans)).toBe(true);
  });

  it('should get unit label', () => {
    expect(component.getUnitLabel('meter')).toBe('متر');
    expect(component.getUnitLabel('ton')).toBe('تن');
    expect(component.getUnitLabel('cubic_meter')).toBe('متر مکعب');
    expect(component.getUnitLabel('unknown')).toBe('unknown');
  });

  it('should toggle expand', () => {
    component.expandedPlanIds.add('test-id');
    expect(component.isExpanded('test-id')).toBe(true);
    component.toggleExpand('test-id');
    expect(component.isExpanded('test-id')).toBe(false);
    component.toggleExpand('test-id');
    expect(component.isExpanded('test-id')).toBe(true);
  });

  it('should toggle holiday', () => {
    const day: DayPlan = { date: '1403/01/01', plannedAmount: 100, notes: '' };
    component.toggleHoliday(day);
    expect(day.isHoliday).toBe(true);
    expect(day.plannedAmount).toBe(0);
    expect(day.notes).toBe('روز تعطیل');
    component.toggleHoliday(day);
    expect(day.isHoliday).toBe(false);
    expect(day.notes).toBe('');
  });

  it('should calculate total planned', () => {
    const mockPlan = {
      days: [
        { date: '1403/01/01', plannedAmount: 50, isHoliday: false },
        { date: '1403/01/02', plannedAmount: 75, isHoliday: false },
      ],
    } as any;
    expect(component.getTotalPlanned(mockPlan)).toBe(125);
  });

  it('should calculate total days', () => {
    const mockPlan = { days: [{ date: '1' }, { date: '2' }, { date: '3' }] } as any;
    expect(component.getTotalDays(mockPlan)).toBe(3);
  });

  it('should calculate working days', () => {
    const mockPlan = {
      days: [
        { date: '1', isHoliday: false, plannedAmount: 50 },
        { date: '2', isHoliday: true, plannedAmount: 0 },
        { date: '3', isHoliday: false, plannedAmount: 50 },
      ],
    } as any;
    expect(component.getWorkingDays(mockPlan)).toBe(2);
  });

  it('should calculate holiday days', () => {
    const mockPlan = {
      days: [
        { date: '1', isHoliday: false, plannedAmount: 50 },
        { date: '2', isHoliday: true, plannedAmount: 0 },
      ],
    } as any;
    expect(component.getHolidayDays(mockPlan)).toBe(1);
  });

  it('should calculate average daily plan', () => {
    const mockPlan = {
      days: [
        { date: '1', isHoliday: false, plannedAmount: 100 },
        { date: '2', isHoliday: true, plannedAmount: 0 },
      ],
    } as any;
    expect(component.getAverageDailyPlan(mockPlan)).toBe(100);
  });

  it('should get persian day of week', () => {
    const dayName = component.getPersianDayOfWeek('1403/01/01');
    expect(typeof dayName).toBe('string');
    expect(dayName.length).toBeGreaterThan(0);
  });
});
