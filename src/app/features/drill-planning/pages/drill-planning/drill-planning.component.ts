import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { DataService } from '../../../../shared/services/data.service';

interface DrillDayPlan {
  date: string;
  plannedAmount: number;
  actualAmount: number;
  achievementPercentage: number;
  notes?: string;
}

interface DrillPlan {
  id: string;
  projectId: string;
  title: string;
  period: 'weekly' | 'monthly';
  startDate: string;
  endDate: string;
  unit: string;
  days: DrillDayPlan[];
  totalPlanned: number;
  totalActual: number;
  overallAchievement: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

@Component({
  selector: 'app-drill-planning',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './drill-planning.component.html',
  styleUrl: './drill-planning.component.scss'
})
export class DrillPlanningComponent implements OnInit {
  Math = Math;

  activeTab: 'list' | 'create' | 'details' = 'list';
  selectedPlan: DrillPlan | null = null;

  drillPlans: DrillPlan[] = [];

  // Create form data
  formData = {
    projectId: '',
    period: 'weekly' as 'weekly' | 'monthly',
    title: '',
    startDate: '',
    unit: 'meter',
    dailyTarget: 0
  };

  unitOptions = [
    { value: 'meter', label: 'متر' },
    { value: 'cubic_meter', label: 'متر مکعب' }
  ];

  constructor(public dataService: DataService) {}

  ngOnInit(): void {
    const firstProject = this.dataService.projects[0];
    const projectId = firstProject ? firstProject.id : '1';

    this.drillPlans = [
      {
        id: '1',
        projectId,
        title: 'برنامه حفاری هفتگی - سکتور A',
        period: 'weekly',
        startDate: '1403/08/15',
        endDate: '1403/08/21',
        unit: 'meter',
        days: [
          { date: '1403/08/15', plannedAmount: 50, actualAmount: 48, achievementPercentage: 96 },
          { date: '1403/08/16', plannedAmount: 50, actualAmount: 52, achievementPercentage: 104 },
          { date: '1403/08/17', plannedAmount: 50, actualAmount: 45, achievementPercentage: 90 },
          { date: '1403/08/18', plannedAmount: 50, actualAmount: 55, achievementPercentage: 110 },
          { date: '1403/08/19', plannedAmount: 50, actualAmount: 50, achievementPercentage: 100 },
          { date: '1403/08/20', plannedAmount: 50, actualAmount: 0, achievementPercentage: 0, notes: 'روز تعطیل' },
          { date: '1403/08/21', plannedAmount: 50, actualAmount: 0, achievementPercentage: 0 }
        ],
        totalPlanned: 350,
        totalActual: 250,
        overallAchievement: 71.4,
        createdBy: 'مدیر سیستم',
        createdAt: '1403/08/14',
        updatedAt: '1403/08/19'
      }
    ];
  }

  // === Stats ===

  get totalPlans(): number {
    return this.drillPlans.length;
  }

  get activePlans(): number {
    return this.drillPlans.filter(plan =>
      plan.days.some(day => day.actualAmount > 0)
    ).length;
  }

  get avgAchievement(): number {
    if (this.drillPlans.length === 0) return 0;
    const sum = this.drillPlans.reduce((acc, plan) => acc + plan.overallAchievement, 0);
    return Math.round((sum / this.drillPlans.length) * 10) / 10;
  }

  // === Helpers ===

  getProjectName(projectId: string): string {
    return this.dataService.projects.find(p => p.id === projectId)?.name || '-';
  }

  getUnitLabel(unit: string): string {
    return this.unitOptions.find(u => u.value === unit)?.label || unit;
  }

  // === Tab switching ===

  switchTab(tab: 'list' | 'create' | 'details'): void {
    if (tab === 'details' && !this.selectedPlan) return;
    this.activeTab = tab;
  }

  // === Details ===

  openDetails(plan: DrillPlan): void {
    this.selectedPlan = { ...plan, days: plan.days.map(d => ({ ...d })) };
    this.activeTab = 'details';
  }

  recalculateDayAchievement(day: DrillDayPlan): void {
    day.achievementPercentage = day.plannedAmount > 0
      ? Math.round((day.actualAmount / day.plannedAmount) * 100 * 10) / 10
      : 0;
  }

  saveDetails(): void {
    if (!this.selectedPlan) return;

    this.selectedPlan.totalPlanned = this.selectedPlan.days.reduce((sum, d) => sum + d.plannedAmount, 0);
    this.selectedPlan.totalActual = this.selectedPlan.days.reduce((sum, d) => sum + d.actualAmount, 0);
    this.selectedPlan.overallAchievement = this.selectedPlan.totalPlanned > 0
      ? Math.round((this.selectedPlan.totalActual / this.selectedPlan.totalPlanned) * 100 * 10) / 10
      : 0;
    this.selectedPlan.updatedAt = new Date().toLocaleDateString('fa-IR');

    const idx = this.drillPlans.findIndex(p => p.id === this.selectedPlan!.id);
    if (idx >= 0) {
      this.drillPlans[idx] = { ...this.selectedPlan, days: this.selectedPlan.days.map(d => ({ ...d })) };
    }
  }

  getAchievementColor(percentage: number): string {
    if (percentage >= 100) return 'achievement-green';
    if (percentage >= 80) return 'achievement-yellow';
    return 'achievement-red';
  }

  // === Create ===

  handleCreate(): void {
    const numDays = this.formData.period === 'weekly' ? 7 : 30;
    const days: DrillDayPlan[] = [];

    const parts = this.formData.startDate.split('/');
    if (parts.length !== 3) return;

    let year = parseInt(parts[0], 10);
    let month = parseInt(parts[1], 10);
    let day = parseInt(parts[2], 10);

    for (let i = 0; i < numDays; i++) {
      const yStr = year.toString();
      const mStr = month.toString().padStart(2, '0');
      const dStr = day.toString().padStart(2, '0');

      days.push({
        date: `${yStr}/${mStr}/${dStr}`,
        plannedAmount: this.formData.dailyTarget,
        actualAmount: 0,
        achievementPercentage: 0
      });

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

    const endDate = days.length > 0 ? days[days.length - 1].date : this.formData.startDate;
    const totalPlanned = days.reduce((sum, d) => sum + d.plannedAmount, 0);

    const newPlan: DrillPlan = {
      id: Date.now().toString(),
      projectId: this.formData.projectId,
      title: this.formData.title,
      period: this.formData.period,
      startDate: this.formData.startDate,
      endDate,
      unit: this.formData.unit,
      days,
      totalPlanned,
      totalActual: 0,
      overallAchievement: 0,
      createdBy: 'مدیر سیستم',
      createdAt: new Date().toLocaleDateString('fa-IR'),
      updatedAt: new Date().toLocaleDateString('fa-IR')
    };

    this.drillPlans = [...this.drillPlans, newPlan];

    this.formData = {
      projectId: '',
      period: 'weekly',
      title: '',
      startDate: '',
      unit: 'meter',
      dailyTarget: 0
    };

    this.activeTab = 'list';
  }
}
