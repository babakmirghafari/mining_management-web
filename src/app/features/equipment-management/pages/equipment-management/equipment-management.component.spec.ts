import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { EquipmentManagementComponent } from './equipment-management.component';
import { DataService } from '../../../../shared/services/data.service';
import { AuthService } from '../../../../core/services/auth.service';

describe('EquipmentManagementComponent', () => {
  let component: EquipmentManagementComponent;
  let fixture: ComponentFixture<EquipmentManagementComponent>;
  let authService: AuthService;

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [EquipmentManagementComponent, TranslateModule.forRoot(), FormsModule],
      providers: [DataService, AuthService],
    }).compileComponents();

    authService = TestBed.inject(AuthService);
    authService.login('admin', '123456');

    fixture = TestBed.createComponent(EquipmentManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load current user on init', () => {
    expect(component.currentUser?.role).toBe('admin');
  });

  it('should return all equipment for admin', () => {
    expect(component.filteredEquipment.length).toBe(component.equipment.length);
  });

  it('should calculate stats', () => {
    const stats = component.stats;
    expect(stats.total).toBe(component.filteredEquipment.length);
    expect(stats.active).toBeGreaterThanOrEqual(0);
    expect(stats.maintenance).toBeGreaterThanOrEqual(0);
    expect(stats.outOfService).toBeGreaterThanOrEqual(0);
  });

  it('should get type label', () => {
    expect(component.getTypeLabel('drilling')).toBe('حفاری');
    expect(component.getTypeLabel('excavator')).toBe('بیل مکانیکی');
  });

  it('should get status info', () => {
    const info = component.getStatusInfo('active');
    expect(info.label).toBe('فعال');
  });

  it('should open add dialog', () => {
    component.openAddDialog();
    expect(component.isDialogOpen).toBe(true);
    expect(component.selectedEquipment).toBeNull();
  });

  it('should open edit dialog with equipment data', () => {
    const eq = component.equipment[0];
    component.openEditDialog(eq);
    expect(component.isDialogOpen).toBe(true);
    expect(component.selectedEquipment).toBe(eq);
    expect(component.formData.name).toBe(eq.name);
  });

  it('should open transfer dialog', () => {
    const eq = component.equipment[0];
    component.openTransferDialog(eq);
    expect(component.isTransferDialogOpen).toBe(true);
    expect(component.transferEquipment).toBe(eq);
  });

  it('should close dialog and reset form', () => {
    component.openAddDialog();
    component.closeDialog();
    expect(component.isDialogOpen).toBe(false);
    expect(component.formData.name).toBe('');
  });

  it('should close transfer dialog', () => {
    const eq = component.equipment[0];
    component.openTransferDialog(eq);
    component.closeTransferDialog();
    expect(component.isTransferDialogOpen).toBe(false);
    expect(component.transferEquipment).toBeNull();
  });

  it('should handle status change', () => {
    const eqId = component.equipment[0].id;
    component.handleStatusChange(eqId, 'maintenance');
    const updated = component.equipment.find(e => e.id === eqId);
    expect(updated?.status).toBe('maintenance');
  });

  it('should delete equipment', () => {
    const initialCount = component.equipment.length;
    vi.spyOn(globalThis, 'confirm').mockReturnValue(true);
    component.deleteEquipment(component.equipment[0].id);
    expect(component.equipment.length).toBe(initialCount - 1);
  });
});
