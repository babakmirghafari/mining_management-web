import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { DataService } from '../../../../shared/services/data.service';
import { AuthService, User } from '../../../../core/services/auth.service';
import { Plan } from '../../../../shared/models/data.models';

interface PlanTypeOption {
  value: Plan['type'];
  label: string;
}

interface PriorityOption {
  value: Plan['priority'];
  label: string;
  color: string;
}

interface StatusOption {
  value: Plan['status'];
  label: string;
  color: string;
}

interface UnitOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-planning',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './planning.component.html',
  styleUrl: './planning.component.scss'
})
export class PlanningComponent implements OnInit {
  currentUser: User | null = null;
  activeTab: Plan['type'] = 'daily';
  isDialogOpen = false;
  selectedPlan: Plan | null = null;

  planTypes: PlanTypeOption[] = [
    { value: 'daily', label: 'روزانه' },
    { value: 'weekly', label: 'هفتگی' },
    { value: 'monthly', label: 'ماهانه' }
  ];

  priorities: PriorityOption[] = [
    { value: 'low', label: 'کم', color: 'priority-low' },
    { value: 'medium', label: 'متوسط', color: 'priority-medium' },
    { value: 'high', label: 'بالا', color: 'priority-high' }
  ];

  statuses: StatusOption[] = [
    { value: 'draft', label: 'پیش‌نویس', color: 'status-gray' },
    { value: 'approved', label: 'تایید شده', color: 'status-blue' },
    { value: 'active', label: 'فعال', color: 'status-green' },
    { value: 'completed', label: 'تکمیل شده', color: 'status-gray' }
  ];

  units: UnitOption[] = [
    { value: 'meter', label: 'متر' },
    { value: 'ton', label: 'تن' },
    { value: 'cubic_meter', label: 'متر مکعب' },
    { value: 'hour', label: 'ساعت' },
    { value: 'piece', label: 'عدد' }
  ];

  formData = {
    projectId: '',
    type: 'daily' as Plan['type'],
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    targetAmount: 0,
    unit: 'meter',
    priority: 'medium' as Plan['priority'],
    assignedEquipment: [] as string[],
    assignedOperators: [] as string[],
    status: 'draft' as Plan['status']
  };

  constructor(
    public dataService: DataService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
  }

  get allPlans(): Plan[] {
    const plans = this.dataService.plans;
    if (this.currentUser?.role === 'project_manager') {
      const assignedIds = this.currentUser.assignedProjects || [];
      return plans.filter(p => assignedIds.includes(p.projectId));
    }
    return plans;
  }

  get filteredPlans(): Plan[] {
    return this.allPlans.filter(p => p.type === this.activeTab);
  }

  get stats() {
    const plans = this.allPlans;
    return {
      total: plans.length,
      active: plans.filter(p => p.status === 'active').length,
      approved: plans.filter(p => p.status === 'approved').length,
      completed: plans.filter(p => p.status === 'completed').length
    };
  }

  getProjectName(projectId: string): string {
    return this.dataService.projects.find(p => p.id === projectId)?.name || '-';
  }

  getPriorityInfo(priority: string): PriorityOption {
    return this.priorities.find(p => p.value === priority) || this.priorities[1];
  }

  getStatusInfo(status: string): StatusOption {
    return this.statuses.find(s => s.value === status) || this.statuses[0];
  }

  getUnitLabel(unit: string): string {
    return this.units.find(u => u.value === unit)?.label || unit;
  }

  getTypeLabel(type: string): string {
    return this.planTypes.find(t => t.value === type)?.label || type;
  }

  getEquipmentNames(ids?: string[]): string {
    if (!ids || ids.length === 0) return '-';
    return ids
      .map(id => this.dataService.equipmentList.find(e => e.id === id)?.name || id)
      .join('، ');
  }

  getOperatorNames(ids?: string[]): string {
    if (!ids || ids.length === 0) return '-';
    return ids
      .map(id => this.dataService.operators.find(o => o.id === id)?.name || id)
      .join('، ');
  }

  getTransitionLabel(status: Plan['status']): string | null {
    switch (status) {
      case 'draft': return 'تایید';
      case 'approved': return 'فعال‌سازی';
      case 'active': return 'تکمیل';
      default: return null;
    }
  }

  getNextStatus(status: Plan['status']): Plan['status'] | null {
    switch (status) {
      case 'draft': return 'approved';
      case 'approved': return 'active';
      case 'active': return 'completed';
      default: return null;
    }
  }

  transitionStatus(plan: Plan): void {
    const next = this.getNextStatus(plan.status);
    if (next) {
      this.dataService.updatePlan(plan.id, { status: next });
    }
  }

  isEquipmentSelected(id: string): boolean {
    return this.formData.assignedEquipment.includes(id);
  }

  toggleEquipment(id: string): void {
    const idx = this.formData.assignedEquipment.indexOf(id);
    if (idx >= 0) {
      this.formData.assignedEquipment = this.formData.assignedEquipment.filter(e => e !== id);
    } else {
      this.formData.assignedEquipment = [...this.formData.assignedEquipment, id];
    }
  }

  isOperatorSelected(id: string): boolean {
    return this.formData.assignedOperators.includes(id);
  }

  toggleOperator(id: string): void {
    const idx = this.formData.assignedOperators.indexOf(id);
    if (idx >= 0) {
      this.formData.assignedOperators = this.formData.assignedOperators.filter(o => o !== id);
    } else {
      this.formData.assignedOperators = [...this.formData.assignedOperators, id];
    }
  }

  openAddDialog(): void {
    this.resetForm();
    this.formData.type = this.activeTab;
    this.isDialogOpen = true;
  }

  openEditDialog(plan: Plan): void {
    this.selectedPlan = plan;
    this.formData = {
      projectId: plan.projectId,
      type: plan.type,
      title: plan.title,
      description: plan.description || '',
      startDate: plan.startDate,
      endDate: plan.endDate,
      targetAmount: plan.targetAmount,
      unit: plan.unit,
      priority: plan.priority,
      assignedEquipment: plan.assignedEquipment ? [...plan.assignedEquipment] : [],
      assignedOperators: plan.assignedOperators ? [...plan.assignedOperators] : [],
      status: plan.status
    };
    this.isDialogOpen = true;
  }

  handleSubmit(): void {
    if (this.selectedPlan) {
      this.dataService.updatePlan(this.selectedPlan.id, {
        projectId: this.formData.projectId,
        type: this.formData.type,
        title: this.formData.title,
        description: this.formData.description,
        startDate: this.formData.startDate,
        endDate: this.formData.endDate,
        targetAmount: this.formData.targetAmount,
        unit: this.formData.unit,
        priority: this.formData.priority,
        assignedEquipment: this.formData.assignedEquipment,
        assignedOperators: this.formData.assignedOperators,
        status: this.formData.status
      });
    } else {
      this.dataService.addPlan({
        projectId: this.formData.projectId,
        type: this.formData.type,
        title: this.formData.title,
        description: this.formData.description,
        startDate: this.formData.startDate,
        endDate: this.formData.endDate,
        targetAmount: this.formData.targetAmount,
        unit: this.formData.unit,
        priority: this.formData.priority,
        assignedEquipment: this.formData.assignedEquipment,
        assignedOperators: this.formData.assignedOperators,
        status: this.formData.status,
        createdBy: this.currentUser?.id || '1'
      });
    }
    this.closeDialog();
  }

  deletePlan(planId: string): void {
    if (confirm('آیا از حذف این برنامه اطمینان دارید؟')) {
      this.dataService.deletePlan(planId);
    }
  }

  closeDialog(): void {
    this.isDialogOpen = false;
    this.resetForm();
  }

  resetForm(): void {
    this.selectedPlan = null;
    this.formData = {
      projectId: '',
      type: 'daily',
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      targetAmount: 0,
      unit: 'meter',
      priority: 'medium',
      assignedEquipment: [],
      assignedOperators: [],
      status: 'draft'
    };
  }

  setActiveTab(tab: Plan['type']): void {
    this.activeTab = tab;
  }
}
