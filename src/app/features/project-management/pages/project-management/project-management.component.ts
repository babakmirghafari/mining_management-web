import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { DataService } from '../../../../shared/services/data.service';
import { AuthService, User } from '../../../../core/services/auth.service';
import { Project } from '../../../../shared/models/data.models';

interface ProjectStatus {
  value: string;
  label: string;
  color: string;
}

@Component({
  selector: 'app-project-management',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './project-management.component.html',
  styleUrl: './project-management.component.scss'
})
export class ProjectManagementComponent implements OnInit {
  currentUser: User | null = null;
  isDialogOpen = false;
  selectedProject: Project | null = null;

  formData = {
    name: '',
    description: '',
    location: '',
    startDate: '',
    endDate: '',
    status: 'planning' as Project['status'],
    budget: 0
  };

  projectStatuses: ProjectStatus[] = [
    { value: 'planning', label: 'برنامه‌ریزی', color: 'status-planning' },
    { value: 'active', label: 'فعال', color: 'status-active' },
    { value: 'completed', label: 'تکمیل شده', color: 'status-completed' },
    { value: 'suspended', label: 'تعلیق', color: 'status-suspended' },
  ];

  constructor(
    public dataService: DataService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
  }

  get filteredProjects(): Project[] {
    const projects = this.dataService.projects;
    if (this.currentUser?.role === 'admin') return projects;
    if (this.currentUser?.role === 'project_manager') {
      return projects.filter(p => this.currentUser?.assignedProjects?.includes(p.id));
    }
    return [];
  }

  get totalProjects(): number { return this.filteredProjects.length; }
  get activeCount(): number { return this.filteredProjects.filter(p => p.status === 'active').length; }
  get completedCount(): number { return this.filteredProjects.filter(p => p.status === 'completed').length; }
  get avgProgress(): number {
    const projects = this.filteredProjects;
    if (projects.length === 0) return 0;
    return Math.round(projects.reduce((acc, p) => acc + p.progress, 0) / projects.length);
  }

  getStatusInfo(status: string): ProjectStatus {
    return this.projectStatuses.find(s => s.value === status) || this.projectStatuses[0];
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('fa-IR').format(amount) + ' ریال';
  }

  openAddDialog(): void {
    this.resetForm();
    this.isDialogOpen = true;
  }

  openEditDialog(project: Project): void {
    this.selectedProject = project;
    this.formData = {
      name: project.name,
      description: project.description,
      location: project.location,
      startDate: project.startDate,
      endDate: project.endDate,
      status: project.status,
      budget: project.budget || 0
    };
    this.isDialogOpen = true;
  }

  handleSubmit(): void {
    if (this.selectedProject) {
      this.dataService.updateProject(this.selectedProject.id, this.formData);
    } else {
      this.dataService.addProject({
        ...this.formData,
        progress: 0,
        managerId: this.currentUser?.role === 'project_manager' ? this.currentUser.id : undefined,
      } as Omit<Project, 'id' | 'createdAt'>);
    }
    this.isDialogOpen = false;
    this.resetForm();
  }

  deleteProject(projectId: string): void {
    if (confirm('آیا از حذف این پروژه اطمینان دارید؟')) {
      this.dataService.deleteProject(projectId);
    }
  }

  resetForm(): void {
    this.selectedProject = null;
    this.formData = {
      name: '',
      description: '',
      location: '',
      startDate: '',
      endDate: '',
      status: 'planning',
      budget: 0
    };
  }

  closeDialog(): void {
    this.isDialogOpen = false;
    this.resetForm();
  }
}
