import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { DataService } from '../../../../shared/services/data.service';
import { AuthService, User } from '../../../../core/services/auth.service';
import { PeriodPlan, DayPlan, Operation, Equipment, Operator } from '../../../../shared/models/data.models';

interface PeriodOption {
  value: PeriodPlan['period'];
  label: string;
  days: number;
}

interface UnitOption {
  value: string;
  label: string;
}

interface StatusOption {
  value: PeriodPlan['status'];
  label: string;
  color: string;
}

@Component({
  selector: 'app-period-planning',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './period-planning.component.html',
  styleUrl: './period-planning.component.scss'
})
export class PeriodPlanningComponent implements OnInit {
  currentUser: User | null = null;
  isCreateDialogOpen = false;
  isViewDialogOpen = false;
  viewPlan: PeriodPlan | null = null;

  periodOptions: PeriodOption[] = [
    { value: 'weekly', label: 'هفتگی', days: 7 },
    { value: 'monthly', label: 'ماهانه', days: 30 },
    { value: 'yearly', label: 'سالانه', days: 365 },
    { value: 'custom', label: 'سفارشی', days: 0 }
  ];

  units: UnitOption[] = [
    { value: 'meter', label: 'متر' },
    { value: 'ton', label: 'تن' },
    { value: 'cubic_meter', label: 'متر مکعب' },
    { value: 'hour', label: 'ساعت' },
    { value: 'piece', label: 'عدد' }
  ];

  statuses: StatusOption[] = [
    { value: 'draft', label: 'پیش‌نویس', color: 'status-gray' },
    { value: 'approved', label: 'تایید شده', color: 'status-blue' },
    { value: 'active', label: 'فعال', color: 'status-green' },
    { value: 'completed', label: 'تکمیل شده', color: 'status-completed' }
  ];

  formData = {
    projectId: '',
    operationId: '',
    title: '',
    description: '',
    period: 'weekly' as PeriodPlan['period'],
    startDate: '',
    customEndDate: '',
    unit: 'meter',
    defaultDailyTarget: 0,
    assignedEquipment: [] as string[],
    assignedOperators: [] as string[]
  };

  constructor(
    public dataService: DataService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
  }

  // === Computed getters ===

  get allPeriodPlans(): PeriodPlan[] {
    const plans = this.dataService.periodPlans;
    if (this.currentUser?.role === 'project_manager') {
      const assignedIds = this.currentUser.assignedProjects || [];
      return plans.filter(p => assignedIds.includes(p.projectId));
    }
    return plans;
  }

  get stats() {
    const plans = this.allPeriodPlans;
    return {
      total: plans.length,
      draft: plans.filter(p => p.status === 'draft').length,
      approved: plans.filter(p => p.status === 'approved').length,
      active: plans.filter(p => p.status === 'active').length,
      completed: plans.filter(p => p.status === 'completed').length
    };
  }

  get filteredOperations(): Operation[] {
    if (!this.formData.projectId) return [];
    return this.dataService.getOperationsByProject(this.formData.projectId);
  }

  get filteredEquipment(): Equipment[] {
    if (!this.formData.projectId) return [];
    return this.dataService.getEquipmentByProject(this.formData.projectId);
  }

  get filteredOperators(): Operator[] {
    if (!this.formData.projectId) return [];
    return this.dataService.getOperatorsByProject(this.formData.projectId);
  }

  get isCustomPeriod(): boolean {
    return this.formData.period === 'custom';
  }

  // === Helpers ===

  getProjectName(projectId: string): string {
    return this.dataService.projects.find(p => p.id === projectId)?.name || '-';
  }

  getOperationName(operationId: string): string {
    return this.dataService.operations.find(o => o.id === operationId)?.name || '-';
  }

  getPeriodLabel(period: string): string {
    return this.periodOptions.find(p => p.value === period)?.label || period;
  }

  getUnitLabel(unit: string): string {
    return this.units.find(u => u.value === unit)?.label || unit;
  }

  getStatusInfo(status: string): StatusOption {
    return this.statuses.find(s => s.value === status) || this.statuses[0];
  }

  getEquipmentName(id: string): string {
    return this.dataService.equipmentList.find(e => e.id === id)?.name || id;
  }

  getOperatorName(id: string): string {
    return this.dataService.operators.find(o => o.id === id)?.name || id;
  }

  getDayAmountColor(amount: number): string {
    if (amount === 0) return 'text-muted';
    if (amount >= 100) return 'text-green';
    if (amount >= 50) return 'text-blue';
    return 'text-default';
  }

  // === Date generation ===

  generateDateRange(startDate: string, period: string, customEndDate?: string): string[] {
    const dates: string[] = [];
    const parts = startDate.split('/');
    if (parts.length !== 3) return dates;

    let year = parseInt(parts[0], 10);
    let month = parseInt(parts[1], 10);
    let day = parseInt(parts[2], 10);

    let totalDays = 0;
    switch (period) {
      case 'weekly': totalDays = 7; break;
      case 'monthly': totalDays = 30; break;
      case 'yearly': totalDays = 365; break;
      case 'custom':
        if (customEndDate) {
          const endParts = customEndDate.split('/');
          if (endParts.length === 3) {
            const endYear = parseInt(endParts[0], 10);
            const endMonth = parseInt(endParts[1], 10);
            const endDay = parseInt(endParts[2], 10);
            totalDays = ((endYear - year) * 365) + ((endMonth - month) * 30) + (endDay - day) + 1;
            if (totalDays < 1) totalDays = 1;
          }
        }
        break;
    }

    for (let i = 0; i < totalDays; i++) {
      const yStr = year.toString();
      const mStr = month.toString().padStart(2, '0');
      const dStr = day.toString().padStart(2, '0');
      dates.push(`${yStr}/${mStr}/${dStr}`);

      day++;
      if (day > 30) {
        day = 1;
        month++;
        if (month > 12) {
          month = 1;
          year++;
        }
      }
    }

    return dates;
  }

  // === Checkbox toggles ===

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

  onProjectChange(): void {
    this.formData.operationId = '';
    this.formData.assignedEquipment = [];
    this.formData.assignedOperators = [];
  }

  // === Create dialog ===

  openCreateDialog(): void {
    this.resetForm();
    this.isCreateDialogOpen = true;
  }

  closeCreateDialog(): void {
    this.isCreateDialogOpen = false;
    this.resetForm();
  }

  handleCreate(): void {
    const dates = this.generateDateRange(
      this.formData.startDate,
      this.formData.period,
      this.formData.customEndDate
    );

    const days: DayPlan[] = dates.map(date => ({
      date,
      plannedAmount: this.formData.defaultDailyTarget,
      notes: '',
      isHoliday: false
    }));

    const endDate = dates.length > 0 ? dates[dates.length - 1] : this.formData.startDate;
    const totalPlanned = days.reduce((sum, d) => sum + d.plannedAmount, 0);
    const operation = this.dataService.operations.find(o => o.id === this.formData.operationId);

    this.dataService.addPeriodPlan({
      projectId: this.formData.projectId,
      operationId: this.formData.operationId,
      operationName: operation?.name || '',
      title: this.formData.title,
      description: this.formData.description,
      period: this.formData.period,
      startDate: this.formData.startDate,
      endDate,
      unit: this.formData.unit,
      days,
      totalPlanned,
      priority: 'medium',
      assignedEquipment: this.formData.assignedEquipment,
      assignedOperators: this.formData.assignedOperators,
      status: 'draft',
      createdBy: this.currentUser?.id || '1'
    });

    this.closeCreateDialog();
  }

  // === View dialog ===

  openViewDialog(plan: PeriodPlan): void {
    this.viewPlan = plan;
    this.isViewDialogOpen = true;
  }

  closeViewDialog(): void {
    this.isViewDialogOpen = false;
    this.viewPlan = null;
  }

  // === Delete ===

  deletePlan(planId: string): void {
    if (confirm('آیا از حذف این برنامه دوره‌ای اطمینان دارید؟')) {
      this.dataService.deletePeriodPlan(planId);
    }
  }

  // === Reset ===

  resetForm(): void {
    this.formData = {
      projectId: '',
      operationId: '',
      title: '',
      description: '',
      period: 'weekly',
      startDate: '',
      customEndDate: '',
      unit: 'meter',
      defaultDailyTarget: 0,
      assignedEquipment: [],
      assignedOperators: []
    };
  }
}
