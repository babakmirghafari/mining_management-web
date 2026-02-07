import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { DataService } from '../../../../shared/services/data.service';
import { PeriodPlan, DayPlan } from '../../../../shared/models/data.models';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-daily-planning',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './daily-planning.component.html',
  styleUrl: './daily-planning.component.scss'
})
export class DailyPlanningComponent implements OnInit, OnDestroy {
  periodPlans: PeriodPlan[] = [];
  selectedPlanId: string = '';
  expandedPlanIds: Set<string> = new Set();

  private subscription: Subscription | null = null;

  constructor(public dataService: DataService) {}

  ngOnInit(): void {
    this.subscription = this.dataService.periodPlans$.subscribe(plans => {
      this.periodPlans = plans.map(plan => ({
        ...plan,
        days: plan.days.map(day => ({ ...day }))
      }));
      // Auto-expand all if few plans
      if (this.periodPlans.length <= 3) {
        this.periodPlans.forEach(p => this.expandedPlanIds.add(p.id));
      }
      // Select first plan if none selected
      if (!this.selectedPlanId && this.periodPlans.length > 0) {
        this.selectedPlanId = this.periodPlans[0].id;
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  // === Plan selection ===

  get selectedPlan(): PeriodPlan | undefined {
    return this.periodPlans.find(p => p.id === this.selectedPlanId);
  }

  toggleExpand(planId: string): void {
    if (this.expandedPlanIds.has(planId)) {
      this.expandedPlanIds.delete(planId);
    } else {
      this.expandedPlanIds.add(planId);
    }
  }

  isExpanded(planId: string): boolean {
    return this.expandedPlanIds.has(planId);
  }

  // === Stats per plan ===

  getTotalPlanned(plan: PeriodPlan): number {
    return plan.days.reduce((sum, day) => sum + day.plannedAmount, 0);
  }

  getTotalDays(plan: PeriodPlan): number {
    return plan.days.length;
  }

  getWorkingDays(plan: PeriodPlan): number {
    return plan.days.filter(day => !day.isHoliday).length;
  }

  getHolidayDays(plan: PeriodPlan): number {
    return plan.days.filter(day => day.isHoliday).length;
  }

  getAverageDailyPlan(plan: PeriodPlan): number {
    const workingDays = this.getWorkingDays(plan);
    if (workingDays === 0) return 0;
    const totalPlanned = this.getTotalPlanned(plan);
    return Math.round((totalPlanned / workingDays) * 10) / 10;
  }

  // === Persian day of week ===

  getPersianDayOfWeek(dateStr: string): string {
    const persianDays = ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه', 'شنبه'];
    const [year, month, day] = dateStr.split('/').map(Number);
    const gregorianYear = year + 621;
    const gregorianMonth = month + 3;
    const tempDate = new Date(gregorianYear, gregorianMonth - 1, day);
    return persianDays[tempDate.getDay()];
  }

  // === Holiday toggle ===

  toggleHoliday(day: DayPlan): void {
    day.isHoliday = !day.isHoliday;
    if (day.isHoliday) {
      day.plannedAmount = 0;
      day.notes = 'روز تعطیل';
    } else {
      day.plannedAmount = 0;
      day.notes = '';
    }
  }

  // === Mark Fridays ===

  markFridaysAsHoliday(plan: PeriodPlan): void {
    plan.days.forEach(day => {
      const dayName = this.getPersianDayOfWeek(day.date);
      if (dayName === 'جمعه') {
        day.isHoliday = true;
        day.plannedAmount = 0;
        day.notes = 'روز تعطیل';
      }
    });
  }

  // === Helpers ===

  getProjectName(projectId: string): string {
    return this.dataService.projects.find(p => p.id === projectId)?.name || '-';
  }

  getOperationName(operationId: string): string {
    return this.dataService.operations.find(o => o.id === operationId)?.name || '-';
  }

  getEquipmentName(id: string): string {
    return this.dataService.equipmentList.find(e => e.id === id)?.name || id;
  }

  getOperatorName(id: string): string {
    return this.dataService.operators.find(o => o.id === id)?.name || id;
  }

  getUnitLabel(unit: string): string {
    const units: Record<string, string> = {
      meter: 'متر',
      ton: 'تن',
      cubic_meter: 'متر مکعب',
      hour: 'ساعت',
      piece: 'عدد'
    };
    return units[unit] || unit;
  }

  // === Save ===

  savePlan(plan: PeriodPlan): void {
    const totalPlanned = this.getTotalPlanned(plan);
    this.dataService.updatePeriodPlan(plan.id, {
      days: plan.days.map(d => ({ ...d })),
      totalPlanned
    });
    alert('ذخیره شد');
  }
}
