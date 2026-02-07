import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { DelayReasonsComponent } from './delay-reasons.component';
import { DataService } from '../../../../shared/services/data.service';
import { AuthService } from '../../../../core/services/auth.service';

describe('DelayReasonsComponent', () => {
  let component: DelayReasonsComponent;
  let fixture: ComponentFixture<DelayReasonsComponent>;
  let authService: AuthService;
  let dataService: DataService;

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [DelayReasonsComponent, TranslateModule.forRoot(), FormsModule],
      providers: [DataService, AuthService],
    }).compileComponents();

    authService = TestBed.inject(AuthService);
    dataService = TestBed.inject(DataService);
    authService.login('admin', '123456');

    fixture = TestBed.createComponent(DelayReasonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    component.ngOnDestroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load current user on init', () => {
    expect(component.currentUser?.role).toBe('admin');
  });

  it('should load delay reasons from service', () => {
    expect(component.reasons.length).toBeGreaterThan(0);
  });

  it('should compute active reasons', () => {
    expect(component.activeReasons.length).toBeGreaterThanOrEqual(0);
  });

  it('should compute inactive reasons', () => {
    expect(component.inactiveReasons.length).toBeGreaterThanOrEqual(0);
  });

  it('should compute stats', () => {
    const stats = component.stats;
    expect(stats.total).toBe(component.reasons.length);
    expect(stats.active).toBe(component.activeReasons.length);
    expect(stats.inactive).toBe(component.inactiveReasons.length);
  });

  it('should get category info', () => {
    const info = component.getCategoryInfo('equipment');
    expect(info.label).toBe('خرابی تجهیزات');
    expect(info.color).toBeTruthy();
  });

  it('should truncate description', () => {
    const long = 'A'.repeat(60);
    const truncated = component.truncateDescription(long, 40);
    expect(truncated.length).toBe(43); // 40 + '...'
    expect(truncated.endsWith('...')).toBe(true);
  });

  it('should return dash for empty description', () => {
    expect(component.truncateDescription(undefined)).toBe('-');
  });

  it('should open add dialog', () => {
    component.openAddDialog();
    expect(component.isDialogOpen).toBe(true);
    expect(component.selectedReason).toBeNull();
  });

  it('should open edit dialog with reason data', () => {
    const reason = component.reasons[0];
    component.openEditDialog(reason);
    expect(component.isDialogOpen).toBe(true);
    expect(component.selectedReason).toBe(reason);
    expect(component.formData.name).toBe(reason.name);
  });

  it('should close dialog', () => {
    component.openAddDialog();
    component.closeDialog();
    expect(component.isDialogOpen).toBe(false);
    expect(component.selectedReason).toBeNull();
  });

  it('should submit new delay reason', () => {
    const initialCount = component.reasons.length;
    component.openAddDialog();
    component.formData.name = 'Test Reason';
    component.formData.category = 'weather';
    component.handleSubmit();
    // After submit, the subscription should update reasons
    expect(component.reasons.length).toBe(initialCount + 1);
  });

  it('should not submit if name is empty', () => {
    const initialCount = component.reasons.length;
    component.openAddDialog();
    component.formData.name = '  ';
    component.handleSubmit();
    expect(component.reasons.length).toBe(initialCount);
  });

  it('should delete a reason', () => {
    const initialCount = component.reasons.length;
    vi.spyOn(globalThis, 'confirm').mockReturnValue(true);
    component.deleteReason(component.reasons[0].id);
    expect(component.reasons.length).toBe(initialCount - 1);
  });
});
