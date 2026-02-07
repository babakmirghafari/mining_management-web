import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { DataService } from '../../../../shared/services/data.service';
import { AuthService, User } from '../../../../core/services/auth.service';
import { Achievement, Plan } from '../../../../shared/models/data.models';

interface DelayReasonOption {
  key: string;
  label: string;
}

interface UnitOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-achievements',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './achievements.component.html',
  styleUrl: './achievements.component.scss'
})
export class AchievementsComponent implements OnInit {
  Math = Math;
  currentUser: User | null = null;
  showForm = false;
  editingAchievement: Achievement | null = null;

  units: UnitOption[] = [
    { value: 'meter', label: 'متر' },
    { value: 'ton', label: 'تن' },
    { value: 'cubic_meter', label: 'متر مکعب' },
    { value: 'hour', label: 'ساعت' },
    { value: 'piece', label: 'عدد' }
  ];

  staticDelayReasons: DelayReasonOption[] = [
    { key: 'equipment_failure', label: 'خرابی تجهیزات' },
    { key: 'weather', label: 'آب و هوای نامساعد' },
    { key: 'material_shortage', label: 'کمبود مواد' },
    { key: 'power_outage', label: 'قطعی برق' },
    { key: 'operator_absence', label: 'غیبت اپراتور' },
    { key: 'safety_issues', label: 'مسائل ایمنی' },
    { key: 'maintenance', label: 'تعمیرات اضطراری' },
    { key: 'other', label: 'سایر موارد' }
  ];

  formData = {
    projectId: '',
    planId: '',
    date: '',
    plannedAmount: 0,
    achievedAmount: 0,
    delayReasons: [] as string[],
    delayDescription: '',
    operatorHours: [] as { operatorId: string; hours: number }[],
    equipmentHours: [] as { equipmentId: string; hours: number }[],
    notes: ''
  };

  constructor(
    public dataService: DataService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
  }

  // --- Computed data ---

  get allAchievements(): Achievement[] {
    const achievements = this.dataService.achievements;
    if (this.currentUser?.role === 'project_manager') {
      const assignedIds = this.currentUser.assignedProjects || [];
      return achievements.filter(a => assignedIds.includes(a.projectId));
    }
    return achievements;
  }

  get stats() {
    const achs = this.allAchievements;
    const total = achs.length;
    const completed = achs.filter(a => a.status === 'completed').length;
    const partial = achs.filter(a => a.status === 'partial').length;
    const failed = achs.filter(a => a.status === 'failed').length;
    const avgEfficiency = total > 0
      ? Math.round(achs.reduce((sum, a) => sum + a.efficiency, 0) / total)
      : 0;
    return { total, completed, partial, failed, avgEfficiency };
  }

  get filteredPlans(): Plan[] {
    if (!this.formData.projectId) return [];
    return this.dataService.plans.filter(p => p.projectId === this.formData.projectId);
  }

  get selectedPlan(): Plan | undefined {
    if (!this.formData.planId) return undefined;
    return this.dataService.plans.find(p => p.id === this.formData.planId);
  }

  get efficiencyPreview(): number {
    if (this.formData.plannedAmount <= 0) return 0;
    return Math.round((this.formData.achievedAmount / this.formData.plannedAmount) * 100);
  }

  get showDelayReasons(): boolean {
    return this.formData.achievedAmount < this.formData.plannedAmount;
  }

  // --- Helpers ---

  getProjectName(projectId: string): string {
    return this.dataService.projects.find(p => p.id === projectId)?.name || '-';
  }

  getPlanTitle(planId: string): string {
    return this.dataService.plans.find(p => p.id === planId)?.title || '-';
  }

  getUnitLabel(unit: string): string {
    return this.units.find(u => u.value === unit)?.label || unit;
  }

  getEfficiencyIcon(efficiency: number): string {
    if (efficiency >= 100) return '✓';
    if (efficiency >= 50) return '↗';
    return '✗';
  }

  getEfficiencyClass(efficiency: number): string {
    if (efficiency >= 100) return 'efficiency-high';
    if (efficiency >= 50) return 'efficiency-mid';
    return 'efficiency-low';
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'completed': return 'تکمیل شده';
      case 'partial': return 'تکمیل جزئی';
      case 'failed': return 'عدم تحقق';
      default: return status;
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'completed': return 'status-green';
      case 'partial': return 'status-yellow';
      case 'failed': return 'status-red';
      default: return 'status-gray';
    }
  }

  getDelayReasonLabels(reasons?: string[]): string {
    if (!reasons || reasons.length === 0) return '-';
    return reasons.map(key => {
      const found = this.staticDelayReasons.find(r => r.key === key);
      if (found) return found.label;
      const dbReason = this.dataService.delayReasons.find(r => r.id === key);
      return dbReason?.name || key;
    }).join('، ');
  }

  getOperatorName(operatorId: string): string {
    return this.dataService.operators.find(o => o.id === operatorId)?.name || '-';
  }

  getEquipmentName(equipmentId: string): string {
    return this.dataService.equipmentList.find(e => e.id === equipmentId)?.name || '-';
  }

  // --- Delay reason checkboxes ---

  isDelayReasonSelected(key: string): boolean {
    return this.formData.delayReasons.includes(key);
  }

  toggleDelayReason(key: string): void {
    const idx = this.formData.delayReasons.indexOf(key);
    if (idx >= 0) {
      this.formData.delayReasons = this.formData.delayReasons.filter(r => r !== key);
    } else {
      this.formData.delayReasons = [...this.formData.delayReasons, key];
    }
  }

  // --- Form navigation ---

  openAddForm(): void {
    this.resetForm();
    this.editingAchievement = null;
    this.showForm = true;
  }

  openEditForm(achievement: Achievement): void {
    this.editingAchievement = achievement;
    this.formData = {
      projectId: achievement.projectId,
      planId: achievement.planId,
      date: achievement.date,
      plannedAmount: achievement.plannedAmount,
      achievedAmount: achievement.achievedAmount,
      delayReasons: achievement.delayReasons ? [...achievement.delayReasons] : [],
      delayDescription: achievement.delayDescription || '',
      operatorHours: achievement.operatorHours
        ? achievement.operatorHours.map(oh => ({ ...oh }))
        : [],
      equipmentHours: achievement.equipmentHours
        ? achievement.equipmentHours.map(eh => ({ ...eh }))
        : [],
      notes: achievement.notes || ''
    };
    this.showForm = true;
  }

  goBack(): void {
    this.showForm = false;
    this.resetForm();
  }

  // --- Plan selection ---

  onPlanChange(): void {
    const plan = this.selectedPlan;
    if (plan) {
      this.formData.plannedAmount = plan.targetAmount;
    } else {
      this.formData.plannedAmount = 0;
    }
  }

  // --- Operator hours ---

  addOperatorHour(): void {
    this.formData.operatorHours = [
      ...this.formData.operatorHours,
      { operatorId: '', hours: 0 }
    ];
  }

  removeOperatorHour(index: number): void {
    this.formData.operatorHours = this.formData.operatorHours.filter((_, i) => i !== index);
  }

  // --- Equipment hours ---

  addEquipmentHour(): void {
    this.formData.equipmentHours = [
      ...this.formData.equipmentHours,
      { equipmentId: '', hours: 0 }
    ];
  }

  removeEquipmentHour(index: number): void {
    this.formData.equipmentHours = this.formData.equipmentHours.filter((_, i) => i !== index);
  }

  // --- Submit ---

  handleSubmit(): void {
    const efficiency = this.formData.plannedAmount > 0
      ? Math.round((this.formData.achievedAmount / this.formData.plannedAmount) * 100)
      : 0;

    let status: Achievement['status'];
    if (efficiency >= 95) {
      status = 'completed';
    } else if (efficiency >= 50) {
      status = 'partial';
    } else {
      status = 'failed';
    }

    const plan = this.selectedPlan;
    const unit = plan?.unit || 'meter';

    if (this.editingAchievement) {
      this.dataService.updateAchievement(this.editingAchievement.id, {
        projectId: this.formData.projectId,
        planId: this.formData.planId,
        operationId: plan?.operationId,
        date: this.formData.date,
        plannedAmount: this.formData.plannedAmount,
        achievedAmount: this.formData.achievedAmount,
        unit,
        efficiency,
        status,
        delayReasons: this.formData.delayReasons.length > 0 ? this.formData.delayReasons : undefined,
        delayDescription: this.formData.delayDescription || undefined,
        operatorHours: this.formData.operatorHours,
        equipmentHours: this.formData.equipmentHours,
        notes: this.formData.notes || undefined
      });
    } else {
      this.dataService.addAchievement({
        projectId: this.formData.projectId,
        planId: this.formData.planId,
        operationId: plan?.operationId,
        date: this.formData.date,
        plannedAmount: this.formData.plannedAmount,
        achievedAmount: this.formData.achievedAmount,
        unit,
        efficiency,
        status,
        delayReasons: this.formData.delayReasons.length > 0 ? this.formData.delayReasons : undefined,
        delayDescription: this.formData.delayDescription || undefined,
        operatorHours: this.formData.operatorHours,
        equipmentHours: this.formData.equipmentHours,
        notes: this.formData.notes || undefined,
        reportedBy: this.currentUser?.id || '1'
      });
    }

    this.showForm = false;
    this.resetForm();
  }

  deleteAchievement(id: string): void {
    if (confirm('آیا از حذف این رکورد عملکرد اطمینان دارید؟')) {
      this.dataService.deleteAchievement(id);
    }
  }

  resetForm(): void {
    this.editingAchievement = null;
    this.formData = {
      projectId: '',
      planId: '',
      date: '',
      plannedAmount: 0,
      achievedAmount: 0,
      delayReasons: [],
      delayDescription: '',
      operatorHours: [],
      equipmentHours: [],
      notes: ''
    };
  }

  trackByIndex(index: number): number {
    return index;
  }
}
