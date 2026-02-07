import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { DataService } from '../../../../shared/services/data.service';
import { AuthService, User } from '../../../../core/services/auth.service';

interface LocalUser {
  id: string;
  name: string;
  username: string;
  role: 'admin' | 'project_manager' | 'operator';
  assignedProjects?: string[];
  phone?: string;
  email?: string;
  createdAt?: string;
}

interface RoleOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss'
})
export class UserManagementComponent implements OnInit {
  currentUser: User | null = null;
  users: LocalUser[] = [
    { id: '1', name: 'مدیر سیستم', username: 'admin', role: 'admin', phone: '09123456789', email: 'admin@example.com', createdAt: '1402/01/15' },
    { id: '2', name: 'علی احمدی', username: 'ali_pm', role: 'project_manager', assignedProjects: ['1', '2'], phone: '09123456788', email: 'ali@example.com', createdAt: '1402/02/10' },
    { id: '3', name: 'محمد رضایی', username: 'operator1', role: 'operator', assignedProjects: ['1'], phone: '09123456787', createdAt: '1402/03/05' },
    { id: '4', name: 'حسن محمدی', username: 'operator2', role: 'operator', assignedProjects: ['2'], phone: '09123456786', createdAt: '1402/03/12' }
  ];

  selectedUser: LocalUser | null = null;
  isDialogOpen = false;
  formData = {
    name: '',
    username: '',
    role: 'operator' as LocalUser['role'],
    assignedProjects: [] as string[],
    phone: '',
    email: '',
    password: ''
  };

  constructor(
    public dataService: DataService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
  }

  get filteredUsers(): LocalUser[] {
    if (this.currentUser?.role === 'admin') return this.users;
    if (this.currentUser?.role === 'project_manager') {
      return this.users.filter(u =>
        u.role === 'operator' &&
        u.assignedProjects?.some(pid => this.currentUser?.assignedProjects?.includes(pid))
      );
    }
    return [];
  }

  getAvailableRoles(): RoleOption[] {
    if (this.currentUser?.role === 'admin') {
      return [
        { value: 'admin', label: 'مدیر سیستم' },
        { value: 'project_manager', label: 'مدیر پروژه' },
        { value: 'operator', label: 'اپراتور' }
      ];
    }
    return [{ value: 'operator', label: 'اپراتور' }];
  }

  canManageRole(role: string): boolean {
    if (this.currentUser?.role === 'admin') return true;
    if (this.currentUser?.role === 'project_manager' && role === 'operator') return true;
    return false;
  }

  getRoleLabel(role: string): string {
    switch (role) {
      case 'admin': return 'مدیر سیستم';
      case 'project_manager': return 'مدیر پروژه';
      case 'operator': return 'اپراتور';
      default: return role;
    }
  }

  getRoleBadgeClass(role: string): string {
    switch (role) {
      case 'admin': return 'badge-red';
      case 'project_manager': return 'badge-blue';
      default: return 'badge-gray';
    }
  }

  getProjectNames(projectIds?: string[]): string {
    if (!projectIds || projectIds.length === 0) return '-';
    return projectIds
      .map(id => this.dataService.projects.find(p => p.id === id)?.name)
      .filter(Boolean)
      .join('، ');
  }

  isProjectAssigned(projectId: string): boolean {
    return this.formData.assignedProjects.includes(projectId);
  }

  toggleProject(projectId: string): void {
    const idx = this.formData.assignedProjects.indexOf(projectId);
    if (idx >= 0) {
      this.formData.assignedProjects.splice(idx, 1);
    } else {
      this.formData.assignedProjects.push(projectId);
    }
  }

  openAddDialog(): void {
    this.resetForm();
    this.isDialogOpen = true;
  }

  openEditDialog(user: LocalUser): void {
    this.selectedUser = user;
    this.formData = {
      name: user.name,
      username: user.username,
      role: user.role,
      assignedProjects: [...(user.assignedProjects || [])],
      phone: user.phone || '',
      email: user.email || '',
      password: ''
    };
    this.isDialogOpen = true;
  }

  handleSubmit(): void {
    if (this.selectedUser) {
      const idx = this.users.findIndex(u => u.id === this.selectedUser!.id);
      if (idx >= 0) {
        this.users[idx] = { ...this.users[idx], ...this.formData };
        this.users = [...this.users];
      }
    } else {
      const newUser: LocalUser = {
        id: Date.now().toString(),
        ...this.formData,
        createdAt: new Date().toLocaleDateString('fa-IR')
      };
      this.users = [...this.users, newUser];
    }
    this.isDialogOpen = false;
    this.resetForm();
  }

  deleteUser(userId: string): void {
    if (confirm('آیا از حذف این کاربر اطمینان دارید؟')) {
      this.users = this.users.filter(u => u.id !== userId);
    }
  }

  resetForm(): void {
    this.selectedUser = null;
    this.formData = {
      name: '',
      username: '',
      role: 'operator',
      assignedProjects: [],
      phone: '',
      email: '',
      password: ''
    };
  }

  closeDialog(): void {
    this.isDialogOpen = false;
    this.resetForm();
  }
}
