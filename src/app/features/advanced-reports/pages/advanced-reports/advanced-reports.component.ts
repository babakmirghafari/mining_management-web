import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { DataService } from '../../../../shared/services/data.service';
import { Project, Operation, PeriodAchievement, PeriodPlan } from '../../../../shared/models/data.models';

interface TimeEntry {
  label: string;
  planned: number;
  achieved: number;
  efficiency: number;
}

interface CumulativeEntry {
  label: string;
  planned: number;
  achieved: number;
  cumulativePlanned: number;
  cumulativeAchieved: number;
  cumulativeEfficiency: number;
}

@Component({
  selector: 'app-advanced-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './advanced-reports.component.html',
  styleUrl: './advanced-reports.component.scss'
})
export class AdvancedReportsComponent implements OnInit {
  Math = Math;

  // Filters
  selectedProjectId = '';
  selectedOperationId = '';
  selectedTimeRange: 'daily' | 'monthly' | 'yearly' = 'daily';
  selectedViewType: 'trend' | 'cumulative' = 'trend';

  // Tab
  activeTab: 'chart-table' | 'data-table' = 'chart-table';

  // Data
  projects: Project[] = [];
  filteredOperations: Operation[] = [];
  processedData: TimeEntry[] = [];
  cumulativeData: CumulativeEntry[] = [];

  // Time range options
  timeRangeOptions = [
    { value: 'daily', label: 'روزانه' },
    { value: 'monthly', label: 'ماهانه' },
    { value: 'yearly', label: 'سالانه' }
  ];

  // View type options
  viewTypeOptions = [
    { value: 'trend', label: 'روند' },
    { value: 'cumulative', label: 'تجمیعی' }
  ];

  // Tabs
  tabs = [
    { key: 'chart-table', label: 'نمودار → جدول', icon: '📊' },
    { key: 'data-table', label: 'جدول داده‌ها', icon: '📋' }
  ];

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.projects = this.dataService.projects;
    this.processData();
  }

  onProjectChange(): void {
    this.filteredOperations = this.selectedProjectId
      ? this.dataService.getOperationsByProject(this.selectedProjectId)
      : [];
    this.selectedOperationId = '';
    this.processData();
  }

  onOperationChange(): void {
    this.processData();
  }

  onTimeRangeChange(): void {
    this.processData();
  }

  onViewTypeChange(): void {
    // cumulativeData is recomputed from processedData
    this.buildCumulativeData();
  }

  // ---- Data Processing ----

  processData(): void {
    const achievements = this.getFilteredAchievements();

    // Build dailyData map from all non-holiday day achievements
    const dailyMap = new Map<string, { planned: number; achieved: number }>();

    for (const ach of achievements) {
      for (const day of ach.days) {
        if (day.isHoliday) continue;
        const key = day.date;
        const existing = dailyMap.get(key) || { planned: 0, achieved: 0 };
        existing.planned += day.plannedAmount;
        existing.achieved += day.achievedAmount;
        dailyMap.set(key, existing);
      }
    }

    if (this.selectedTimeRange === 'daily') {
      this.processedData = this.buildDailyEntries(dailyMap);
    } else if (this.selectedTimeRange === 'monthly') {
      this.processedData = this.buildMonthlyEntries(dailyMap);
    } else {
      this.processedData = this.buildYearlyEntries(dailyMap);
    }

    this.buildCumulativeData();
  }

  private getFilteredAchievements(): PeriodAchievement[] {
    let achievements = this.dataService.periodAchievements;

    if (this.selectedProjectId) {
      achievements = achievements.filter(a => a.projectId === this.selectedProjectId);
    }
    if (this.selectedOperationId) {
      achievements = achievements.filter(a => a.operationId === this.selectedOperationId);
    }

    return achievements;
  }

  private buildDailyEntries(dailyMap: Map<string, { planned: number; achieved: number }>): TimeEntry[] {
    const entries: TimeEntry[] = [];
    const sortedKeys = Array.from(dailyMap.keys()).sort();
    for (const key of sortedKeys) {
      const val = dailyMap.get(key)!;
      const efficiency = val.planned > 0
        ? Math.round((val.achieved / val.planned) * 100 * 10) / 10
        : 0;
      entries.push({ label: key, planned: val.planned, achieved: val.achieved, efficiency });
    }
    return entries;
  }

  private buildMonthlyEntries(dailyMap: Map<string, { planned: number; achieved: number }>): TimeEntry[] {
    const monthlyMap = new Map<string, { planned: number; achieved: number }>();
    for (const [date, val] of dailyMap) {
      // date format is like "1403/08/22" — extract "1403/08"
      const parts = date.split('/');
      const monthKey = parts.length >= 2 ? `${parts[0]}/${parts[1]}` : date;
      const existing = monthlyMap.get(monthKey) || { planned: 0, achieved: 0 };
      existing.planned += val.planned;
      existing.achieved += val.achieved;
      monthlyMap.set(monthKey, existing);
    }

    const entries: TimeEntry[] = [];
    const sortedKeys = Array.from(monthlyMap.keys()).sort();
    for (const key of sortedKeys) {
      const val = monthlyMap.get(key)!;
      const efficiency = val.planned > 0
        ? Math.round((val.achieved / val.planned) * 100 * 10) / 10
        : 0;
      entries.push({ label: key, planned: val.planned, achieved: val.achieved, efficiency });
    }
    return entries;
  }

  private buildYearlyEntries(dailyMap: Map<string, { planned: number; achieved: number }>): TimeEntry[] {
    const yearlyMap = new Map<string, { planned: number; achieved: number }>();
    for (const [date, val] of dailyMap) {
      const parts = date.split('/');
      const yearKey = parts[0] || date;
      const existing = yearlyMap.get(yearKey) || { planned: 0, achieved: 0 };
      existing.planned += val.planned;
      existing.achieved += val.achieved;
      yearlyMap.set(yearKey, existing);
    }

    const entries: TimeEntry[] = [];
    const sortedKeys = Array.from(yearlyMap.keys()).sort();
    for (const key of sortedKeys) {
      const val = yearlyMap.get(key)!;
      const efficiency = val.planned > 0
        ? Math.round((val.achieved / val.planned) * 100 * 10) / 10
        : 0;
      entries.push({ label: key, planned: val.planned, achieved: val.achieved, efficiency });
    }
    return entries;
  }

  private buildCumulativeData(): void {
    let cumPlanned = 0;
    let cumAchieved = 0;
    this.cumulativeData = this.processedData.map(entry => {
      cumPlanned += entry.planned;
      cumAchieved += entry.achieved;
      const cumEfficiency = cumPlanned > 0
        ? Math.round((cumAchieved / cumPlanned) * 100 * 10) / 10
        : 0;
      return {
        label: entry.label,
        planned: entry.planned,
        achieved: entry.achieved,
        cumulativePlanned: cumPlanned,
        cumulativeAchieved: cumAchieved,
        cumulativeEfficiency: cumEfficiency
      };
    });
  }

  // ---- Stats ----

  get totalPlanned(): number {
    return this.processedData.reduce((sum, e) => sum + e.planned, 0);
  }

  get totalAchieved(): number {
    return this.processedData.reduce((sum, e) => sum + e.achieved, 0);
  }

  get avgEfficiency(): number {
    if (this.processedData.length === 0) return 0;
    const total = this.processedData.reduce((sum, e) => sum + e.efficiency, 0);
    return Math.round((total / this.processedData.length) * 10) / 10;
  }

  get trendIndicator(): string {
    if (this.processedData.length < 2) return '↔';
    const half = Math.floor(this.processedData.length / 2);
    const firstHalf = this.processedData.slice(0, half);
    const secondHalf = this.processedData.slice(half);

    const avgFirst = firstHalf.reduce((s, e) => s + e.efficiency, 0) / firstHalf.length;
    const avgSecond = secondHalf.reduce((s, e) => s + e.efficiency, 0) / secondHalf.length;

    if (avgSecond > avgFirst + 0.5) return '↗';
    if (avgSecond < avgFirst - 0.5) return '↘';
    return '↔';
  }

  get trendLabel(): string {
    const indicator = this.trendIndicator;
    if (indicator === '↗') return 'صعودی';
    if (indicator === '↘') return 'نزولی';
    return 'خنثی';
  }

  get trendClass(): string {
    const indicator = this.trendIndicator;
    if (indicator === '↗') return 'trend-up';
    if (indicator === '↘') return 'trend-down';
    return 'trend-neutral';
  }

  // ---- Summary: Best / Worst period ----

  get bestPeriod(): { label: string; efficiency: number } | null {
    if (this.processedData.length === 0) return null;
    let best = this.processedData[0];
    for (const entry of this.processedData) {
      if (entry.efficiency > best.efficiency) {
        best = entry;
      }
    }
    return { label: best.label, efficiency: best.efficiency };
  }

  get worstPeriod(): { label: string; efficiency: number } | null {
    if (this.processedData.length === 0) return null;
    let worst = this.processedData[0];
    for (const entry of this.processedData) {
      if (entry.efficiency < worst.efficiency) {
        worst = entry;
      }
    }
    return { label: worst.label, efficiency: worst.efficiency };
  }

  // ---- Helpers ----

  get hasData(): boolean {
    return this.processedData.length > 0;
  }

  getEfficiencyClass(efficiency: number): string {
    if (efficiency >= 95) return 'eff-green';
    if (efficiency >= 90) return 'eff-blue';
    if (efficiency >= 80) return 'eff-yellow';
    return 'eff-red';
  }

  getBarWidth(efficiency: number): number {
    return Math.min(efficiency, 100);
  }

  getTimeRangeLabel(): string {
    const found = this.timeRangeOptions.find(o => o.value === this.selectedTimeRange);
    return found ? found.label : '';
  }
}
