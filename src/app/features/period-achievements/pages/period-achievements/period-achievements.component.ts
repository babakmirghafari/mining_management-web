import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { DataService } from '../../../../shared/services/data.service';
import { AuthService, User } from '../../../../core/services/auth.service';
import { PeriodAchievement, DayAchievement, PeriodPlan } from '../../../../shared/models/data.models';

interface OverallStatusOption {
  value: PeriodAchievement['overallStatus'];
  label: string;
  color: string;
}

interface DayStatusOption {
  value: DayAchievement['status'];
  label: string;
}

@Component({
  selector: 'app-period-achievements',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './period-achievements.component.html',
  styleUrl: './period-achievements.component.scss'
})
export class PeriodAchievementsComponent implements OnInit {
  Math = Math;
  currentUser: User | null = null;
  activeTab: 'list' | 'details' = 'list';
  selectedAchievement: PeriodAchievement | null = null;

  delayReasonOptions: string[] = [
    'مشکلات فنی تجهیزات',
    'شرایط نامناسب آب و هوایی',
    'کمبود نیروی انسانی',
    'مشکلات تأمین سوخت',
    'مشکلات ایمنی',
    'تأخیر در تأمین قطعات',
    'مشکلات زیرساختی',
    'سایر موارد'
  ];

  dayStatuses: DayStatusOption[] = [
    { value: 'not_started', label: 'شروع نشده' },
    { value: 'in_progress', label: 'در حال انجام' },
    { value: 'completed', label: 'تکمیل شده' },
    { value: 'delayed', label: 'با تأخیر' }
  ];

  overallStatuses: OverallStatusOption[] = [
    { value: 'completed', label: 'تکمیل شده', color: 'status-green' },
    { value: 'on_track', label: 'در مسیر', color: 'status-blue' },
    { value: 'delayed', label: 'با تأخیر', color: 'status-yellow' },
    { value: 'at_risk', label: 'در خطر', color: 'status-red' }
  ];

  constructor(
    public dataService: DataService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
  }

  // === Computed getters ===

  get allAchievements(): PeriodAchievement[] {
    const achievements = this.dataService.periodAchievements;
    if (this.currentUser?.role === 'project_manager') {
      const assignedIds = this.currentUser.assignedProjects || [];
      return achievements.filter(a => assignedIds.includes(a.projectId));
    }
    return achievements;
  }

  get stats() {
    const achs = this.allAchievements;
    const total = achs.length;
    const completed = achs.filter(a => a.overallStatus === 'completed').length;
    const onTrack = achs.filter(a => a.overallStatus === 'on_track').length;
    const atRisk = achs.filter(a => a.overallStatus === 'at_risk').length;
    const avgAchievement = total > 0
      ? Math.round(achs.reduce((sum, a) => sum + a.overallAchievement, 0) / total)
      : 0;
    return { total, completed, onTrack, atRisk, avgAchievement };
  }

  // === Helpers ===

  getProjectName(projectId: string): string {
    return this.dataService.getProject(projectId)?.name || '-';
  }

  getPeriodPlan(periodPlanId: string): PeriodPlan | undefined {
    return this.dataService.periodPlans.find(p => p.id === periodPlanId);
  }

  getPeriodLabel(period: string): string {
    switch (period) {
      case 'weekly': return 'هفتگی';
      case 'monthly': return 'ماهانه';
      case 'yearly': return 'سالانه';
      default: return period;
    }
  }

  getOverallStatusInfo(status: string): OverallStatusOption {
    return this.overallStatuses.find(s => s.value === status) || this.overallStatuses[1];
  }

  getDayStatusLabel(status: string): string {
    return this.dayStatuses.find(s => s.value === status)?.label || status;
  }

  getAchievementClass(percentage: number): string {
    if (percentage >= 100) return 'achievement-high';
    if (percentage >= 80) return 'achievement-good';
    if (percentage >= 60) return 'achievement-mid';
    return 'achievement-low';
  }

  // === Tab / navigation ===

  selectAchievement(ach: PeriodAchievement): void {
    this.selectedAchievement = { ...ach, days: ach.days.map(d => ({ ...d, delayReasons: [...d.delayReasons] })) };
    this.activeTab = 'details';
  }

  goBackToList(): void {
    this.activeTab = 'list';
    this.selectedAchievement = null;
  }

  // === Detail view: day editing ===

  onAchievedAmountChange(dayIndex: number): void {
    if (!this.selectedAchievement) return;
    const day = this.selectedAchievement.days[dayIndex];
    if (day.plannedAmount > 0) {
      day.achievementPercentage = Math.round((day.achievedAmount / day.plannedAmount) * 100 * 10) / 10;
    } else {
      day.achievementPercentage = 0;
    }
    this.recalculateTotals();
  }

  recalculateTotals(): void {
    if (!this.selectedAchievement) return;
    const days = this.selectedAchievement.days;
    this.selectedAchievement.totalPlanned = days.reduce((sum, d) => sum + d.plannedAmount, 0);
    this.selectedAchievement.totalAchieved = days.reduce((sum, d) => sum + d.achievedAmount, 0);
    if (this.selectedAchievement.totalPlanned > 0) {
      this.selectedAchievement.overallAchievement =
        Math.round((this.selectedAchievement.totalAchieved / this.selectedAchievement.totalPlanned) * 100 * 10) / 10;
    } else {
      this.selectedAchievement.overallAchievement = 0;
    }
    // Update overall status
    const pct = this.selectedAchievement.overallAchievement;
    if (pct >= 100) {
      this.selectedAchievement.overallStatus = 'completed';
    } else if (pct < 60) {
      this.selectedAchievement.overallStatus = 'at_risk';
    } else if (pct < 80) {
      this.selectedAchievement.overallStatus = 'delayed';
    } else {
      this.selectedAchievement.overallStatus = 'on_track';
    }
  }

  isDelayReasonSelected(day: DayAchievement, reason: string): boolean {
    return day.delayReasons.includes(reason);
  }

  toggleDelayReason(day: DayAchievement, reason: string): void {
    const idx = day.delayReasons.indexOf(reason);
    if (idx >= 0) {
      day.delayReasons = day.delayReasons.filter(r => r !== reason);
    } else {
      day.delayReasons = [...day.delayReasons, reason];
    }
  }

  // === Save ===

  saveAchievement(): void {
    if (!this.selectedAchievement) return;
    this.dataService.updatePeriodAchievement(this.selectedAchievement.id, {
      days: this.selectedAchievement.days,
      totalPlanned: this.selectedAchievement.totalPlanned,
      totalAchieved: this.selectedAchievement.totalAchieved,
      overallAchievement: this.selectedAchievement.overallAchievement,
      overallStatus: this.selectedAchievement.overallStatus
    });
    this.goBackToList();
  }

  trackById(_index: number, item: { id: string }): string {
    return item.id;
  }

  trackByIndex(index: number): number {
    return index;
  }
}
