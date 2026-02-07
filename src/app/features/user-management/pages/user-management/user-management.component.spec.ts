import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { UserManagementComponent } from './user-management.component';
import { DataService } from '../../../../shared/services/data.service';
import { AuthService } from '../../../../core/services/auth.service';

describe('UserManagementComponent', () => {
  let component: UserManagementComponent;
  let fixture: ComponentFixture<UserManagementComponent>;
  let authService: AuthService;

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [UserManagementComponent, TranslateModule.forRoot(), FormsModule],
      providers: [DataService, AuthService],
    }).compileComponents();

    authService = TestBed.inject(AuthService);
    authService.login('admin', '123456');

    fixture = TestBed.createComponent(UserManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load current user on init', () => {
    expect(component.currentUser?.role).toBe('admin');
  });

  it('should return all users for admin', () => {
    expect(component.filteredUsers.length).toBe(component.users.length);
  });

  it('should return available roles for admin', () => {
    const roles = component.getAvailableRoles();
    expect(roles.length).toBe(3);
  });

  it('should get role label', () => {
    expect(component.getRoleLabel('admin')).toBe('مدیر سیستم');
    expect(component.getRoleLabel('project_manager')).toBe('مدیر پروژه');
    expect(component.getRoleLabel('operator')).toBe('اپراتور');
  });

  it('should get role badge class', () => {
    expect(component.getRoleBadgeClass('admin')).toBe('badge-red');
    expect(component.getRoleBadgeClass('project_manager')).toBe('badge-blue');
    expect(component.getRoleBadgeClass('operator')).toBe('badge-gray');
  });

  it('should open add dialog', () => {
    component.openAddDialog();
    expect(component.isDialogOpen).toBe(true);
    expect(component.selectedUser).toBeNull();
  });

  it('should open edit dialog with user data', () => {
    const user = component.users[0];
    component.openEditDialog(user);
    expect(component.isDialogOpen).toBe(true);
    expect(component.selectedUser).toBe(user);
    expect(component.formData.name).toBe(user.name);
  });

  it('should close dialog and reset form', () => {
    component.openAddDialog();
    component.closeDialog();
    expect(component.isDialogOpen).toBe(false);
    expect(component.formData.name).toBe('');
  });

  it('should toggle project assignment', () => {
    component.toggleProject('1');
    expect(component.isProjectAssigned('1')).toBe(true);
    component.toggleProject('1');
    expect(component.isProjectAssigned('1')).toBe(false);
  });

  it('should add a new user on submit', () => {
    const initialCount = component.users.length;
    component.openAddDialog();
    component.formData.name = 'New User';
    component.formData.username = 'newuser';
    component.handleSubmit();
    expect(component.users.length).toBe(initialCount + 1);
    expect(component.isDialogOpen).toBe(false);
  });

  it('should delete a user', () => {
    const initialCount = component.users.length;
    vi.spyOn(globalThis, 'confirm').mockReturnValue(true);
    component.deleteUser(component.users[0].id);
    expect(component.users.length).toBe(initialCount - 1);
  });

  it('should check canManageRole correctly', () => {
    expect(component.canManageRole('admin')).toBe(true);
    expect(component.canManageRole('operator')).toBe(true);
  });
});
