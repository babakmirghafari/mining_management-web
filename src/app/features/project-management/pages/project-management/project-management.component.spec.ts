import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { ProjectManagementComponent } from './project-management.component';
import { DataService } from '../../../../shared/services/data.service';
import { AuthService } from '../../../../core/services/auth.service';

describe('ProjectManagementComponent', () => {
  let component: ProjectManagementComponent;
  let fixture: ComponentFixture<ProjectManagementComponent>;
  let authService: AuthService;
  let dataService: DataService;

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [ProjectManagementComponent, TranslateModule.forRoot(), FormsModule],
      providers: [DataService, AuthService],
    }).compileComponents();

    authService = TestBed.inject(AuthService);
    dataService = TestBed.inject(DataService);
    authService.login('admin', '123456');

    fixture = TestBed.createComponent(ProjectManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load current user on init', () => {
    expect(component.currentUser).toBeTruthy();
    expect(component.currentUser?.role).toBe('admin');
  });

  it('should return all projects for admin', () => {
    expect(component.filteredProjects.length).toBe(dataService.projects.length);
  });

  it('should calculate total projects', () => {
    expect(component.totalProjects).toBe(component.filteredProjects.length);
  });

  it('should calculate active count', () => {
    expect(component.activeCount).toBeGreaterThanOrEqual(0);
  });

  it('should calculate average progress', () => {
    expect(component.avgProgress).toBeGreaterThanOrEqual(0);
    expect(component.avgProgress).toBeLessThanOrEqual(100);
  });

  it('should open add dialog', () => {
    component.openAddDialog();
    expect(component.isDialogOpen).toBe(true);
    expect(component.selectedProject).toBeNull();
  });

  it('should open edit dialog with project data', () => {
    const project = dataService.projects[0];
    component.openEditDialog(project);
    expect(component.isDialogOpen).toBe(true);
    expect(component.selectedProject).toBe(project);
    expect(component.formData.name).toBe(project.name);
  });

  it('should close dialog and reset form', () => {
    component.openAddDialog();
    component.closeDialog();
    expect(component.isDialogOpen).toBe(false);
    expect(component.selectedProject).toBeNull();
    expect(component.formData.name).toBe('');
  });

  it('should get status info', () => {
    const info = component.getStatusInfo('active');
    expect(info.label).toBeTruthy();
    expect(info.color).toBeTruthy();
  });

  it('should format currency', () => {
    const formatted = component.formatCurrency(1000000);
    expect(formatted).toContain('ریال');
  });

  it('should add a new project on submit', () => {
    const initialCount = dataService.projects.length;
    component.openAddDialog();
    component.formData = {
      name: 'New Project',
      description: 'Desc',
      location: 'Loc',
      startDate: '1403/01/01',
      endDate: '1403/12/29',
      status: 'planning',
      budget: 0,
    };
    component.handleSubmit();
    expect(dataService.projects.length).toBe(initialCount + 1);
    expect(component.isDialogOpen).toBe(false);
  });

  it('should delete a project', () => {
    const initialCount = dataService.projects.length;
    vi.spyOn(globalThis, 'confirm').mockReturnValue(true);
    const projectId = dataService.projects[0].id;
    component.deleteProject(projectId);
    expect(dataService.projects.length).toBe(initialCount - 1);
  });
});
