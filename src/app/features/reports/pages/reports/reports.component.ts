import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { DataService } from '../../../../shared/services/data.service';
import { Project } from '../../../../shared/models/data.models';

interface DailyEfficiency {
  date: string;
  planned: number;
  achieved: number;
  efficiency: number;
}

interface MonthlyData {
  month: string;
  planned: number;
  achieved: number;
  efficiency: number;
}

interface DelayReason {
  name: string;
  value: number;
  color: string;
}

interface EquipmentPerf {
  name: string;
  hoursPlanned: number;
  hoursActual: number;
  efficiency: number;
}

interface OperatorPerf {
  name: string;
  hoursWorked: number;
  projects: number;
  efficiency: number;
}

interface VarianceRow {
  id: number;
  operation: string;
  planned: number;
  achieved: number;
  variance: number;
  variancePercent: number;
  severity: string;
}

interface PreventiveAction {
  title: string;
  description: string;
  icon: string;
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss'
})
export class ReportsComponent implements OnInit {
  Math = Math;

  // Filters
  selectedReportType = 'performance';
  selectedProjectId = '';
  dateFrom = '';
  dateTo = '';
  activeTab = 'performance';

  projects: Project[] = [];

  reportTypes = [
    { value: 'performance', label: 'گزارش عملکرد' },
    { value: 'equipment', label: 'گزارش تجهیزات' },
    { value: 'operators', label: 'گزارش اپراتورها' },
    { value: 'delays', label: 'گزارش تأخیرات' }
  ];

  tabs = [
    { key: 'performance', label: 'عملکرد', icon: '📊' },
    { key: 'data-table', label: 'جدول داده‌ها', icon: '📋' },
    { key: 'variance', label: 'انحرافات', icon: '📉' },
    { key: 'equipment', label: 'تجهیزات', icon: '🚛' },
    { key: 'operators', label: 'اپراتورها', icon: '👷' },
    { key: 'delays', label: 'تأخیرات', icon: '⏱️' }
  ];

  // --- HARDCODED MOCK DATA ---
  dailyEfficiencyData: DailyEfficiency[] = [
    { date: '\u06F1\u06F4\u06F0\u06F3/\u06F0\u06F1/\u06F0\u06F1', planned: 100, achieved: 95, efficiency: 95 },
    { date: '\u06F1\u06F4\u06F0\u06F3/\u06F0\u06F1/\u06F0\u06F2', planned: 120, achieved: 110, efficiency: 92 },
    { date: '\u06F1\u06F4\u06F0\u06F3/\u06F0\u06F1/\u06F0\u06F3', planned: 80, achieved: 85, efficiency: 106 },
    { date: '\u06F1\u06F4\u06F0\u06F3/\u06F0\u06F1/\u06F0\u06F4', planned: 150, achieved: 130, efficiency: 87 },
    { date: '\u06F1\u06F4\u06F0\u06F3/\u06F0\u06F1/\u06F0\u06F5', planned: 90, achieved: 88, efficiency: 98 },
    { date: '\u06F1\u06F4\u06F0\u06F3/\u06F0\u06F1/\u06F0\u06F6', planned: 110, achieved: 100, efficiency: 91 },
    { date: '\u06F1\u06F4\u06F0\u06F3/\u06F0\u06F1/\u06F0\u06F7', planned: 130, achieved: 125, efficiency: 96 },
    { date: '\u06F1\u06F4\u06F0\u06F3/\u06F0\u06F1/\u06F0\u06F8', planned: 95, achieved: 90, efficiency: 95 },
    { date: '\u06F1\u06F4\u06F0\u06F3/\u06F0\u06F1/\u06F0\u06F9', planned: 140, achieved: 135, efficiency: 96 },
    { date: '\u06F1\u06F4\u06F0\u06F3/\u06F0\u06F1/\u06F1\u06F0', planned: 105, achieved: 98, efficiency: 93 }
  ];

  monthlyData: MonthlyData[] = [
    { month: '\u0641\u0631\u0648\u0631\u062F\u06CC\u0646', planned: 3000, achieved: 2850, efficiency: 95 },
    { month: '\u0627\u0631\u062F\u06CC\u0628\u0647\u0634\u062A', planned: 3200, achieved: 3100, efficiency: 97 },
    { month: '\u062E\u0631\u062F\u0627\u062F', planned: 2800, achieved: 2600, efficiency: 93 },
    { month: '\u062A\u06CC\u0631', planned: 3500, achieved: 3200, efficiency: 91 },
    { month: '\u0645\u0631\u062F\u0627\u062F', planned: 3100, achieved: 2900, efficiency: 94 },
    { month: '\u0634\u0647\u0631\u06CC\u0648\u0631', planned: 2900, achieved: 2800, efficiency: 97 }
  ];

  delayReasons: DelayReason[] = [
    { name: '\u062E\u0631\u0627\u0628\u06CC \u062A\u062C\u0647\u06CC\u0632\u0627\u062A', value: 35, color: '#FF5733' },
    { name: '\u0634\u0631\u0627\u06CC\u0637 \u0622\u0628 \u0648 \u0647\u0648\u0627\u06CC\u06CC', value: 25, color: '#33C1FF' },
    { name: '\u06A9\u0645\u0628\u0648\u062F \u0646\u06CC\u0631\u0648\u06CC \u0627\u0646\u0633\u0627\u0646\u06CC', value: 20, color: '#FFB533' },
    { name: '\u0645\u0634\u06A9\u0644\u0627\u062A \u062A\u0623\u0645\u06CC\u0646 \u0633\u0648\u062E\u062A', value: 12, color: '#9D33FF' },
    { name: '\u0633\u0627\u06CC\u0631', value: 8, color: '#6C757D' }
  ];

  equipmentPerformance: EquipmentPerf[] = [
    { name: '\u0628\u06CC\u0644 \u0645\u06A9\u0627\u0646\u06CC\u06A9\u06CC CAT 390F', hoursPlanned: 200, hoursActual: 185, efficiency: 93 },
    { name: '\u062F\u0627\u0645\u067E\u062A\u0631\u0627\u06A9 \u06A9\u0648\u0645\u0627\u062A\u0633\u0648 HD785', hoursPlanned: 180, hoursActual: 170, efficiency: 94 },
    { name: '\u0644\u0648\u062F\u0631 \u0648\u0644\u0648\u0648 L220H', hoursPlanned: 160, hoursActual: 140, efficiency: 88 },
    { name: '\u062F\u0631\u06CC\u0644 \u0627\u0637\u0644\u0633 \u06A9\u0648\u067E\u06A9\u0648 D65', hoursPlanned: 120, hoursActual: 115, efficiency: 96 }
  ];

  operatorPerformance: OperatorPerf[] = [
    { name: '\u0639\u0644\u06CC \u0645\u062D\u0645\u062F\u06CC', hoursWorked: 176, projects: 3, efficiency: 95 },
    { name: '\u062D\u0633\u0646 \u0631\u0636\u0627\u06CC\u06CC', hoursWorked: 168, projects: 2, efficiency: 92 },
    { name: '\u0645\u062D\u0645\u062F \u0627\u062D\u0645\u062F\u06CC', hoursWorked: 180, projects: 4, efficiency: 88 },
    { name: '\u0631\u0636\u0627 \u06A9\u0631\u06CC\u0645\u06CC', hoursWorked: 160, projects: 2, efficiency: 97 }
  ];

  // Variance hardcoded data
  varianceData: VarianceRow[] = [
    { id: 1, operation: '\u062D\u0641\u0627\u0631\u06CC \u0627\u06A9\u062A\u0634\u0627\u0641\u06CC', planned: 500, achieved: 420, variance: -80, variancePercent: -16, severity: 'critical' },
    { id: 2, operation: '\u062D\u0645\u0644 \u0645\u0648\u0627\u062F \u0645\u0639\u062F\u0646\u06CC', planned: 2000, achieved: 1850, variance: -150, variancePercent: -7.5, severity: 'warning' },
    { id: 3, operation: '\u0641\u0631\u0622\u0648\u0631\u06CC \u0633\u0646\u06AF', planned: 1200, achieved: 1050, variance: -150, variancePercent: -12.5, severity: 'critical' }
  ];

  preventiveActions: PreventiveAction[] = [
    { title: '\u0628\u0627\u0632\u0628\u06CC\u0646\u06CC \u0628\u0631\u0646\u0627\u0645\u0647 \u062A\u0639\u0645\u06CC\u0631\u0627\u062A', description: '\u0627\u0641\u0632\u0627\u06CC\u0634 \u062F\u0648\u0631\u0647\u200C\u0647\u0627\u06CC \u0628\u0627\u0632\u0631\u0633\u06CC \u0648 \u0646\u06AF\u0647\u062F\u0627\u0631\u06CC \u067E\u06CC\u0634\u06AF\u06CC\u0631\u0627\u0646\u0647 \u062A\u062C\u0647\u06CC\u0632\u0627\u062A', icon: '🔧' },
    { title: '\u0622\u0645\u0648\u0632\u0634 \u0646\u06CC\u0631\u0648\u06CC \u0627\u0646\u0633\u0627\u0646\u06CC', description: '\u0628\u0631\u06AF\u0632\u0627\u0631\u06CC \u062F\u0648\u0631\u0647\u200C\u0647\u0627\u06CC \u0622\u0645\u0648\u0632\u0634 \u062A\u062E\u0635\u0635\u06CC \u0628\u0631\u0627\u06CC \u0627\u067E\u0631\u0627\u062A\u0648\u0631\u0647\u0627', icon: '📚' },
    { title: '\u0628\u0647\u06CC\u0646\u0647\u200C\u0633\u0627\u0632\u06CC \u0632\u0646\u062C\u06CC\u0631\u0647 \u062A\u0623\u0645\u06CC\u0646', description: '\u0627\u06CC\u062C\u0627\u062F \u0630\u062E\u0627\u06CC\u0631 \u0627\u062D\u062A\u06CC\u0627\u0637\u06CC \u0633\u0648\u062E\u062A \u0648 \u0642\u0637\u0639\u0627\u062A \u06CC\u062F\u06A9\u06CC', icon: '⛽' }
  ];

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.projects = this.dataService.projects;
  }

  // --- Performance tab computed ---
  get totalPlanned(): number {
    return this.monthlyData.reduce((sum, m) => sum + m.planned, 0);
  }

  get totalAchieved(): number {
    return this.monthlyData.reduce((sum, m) => sum + m.achieved, 0);
  }

  get avgEfficiency(): number {
    const total = this.monthlyData.reduce((sum, m) => sum + m.efficiency, 0);
    return Math.round(total / this.monthlyData.length);
  }

  get totalRecords(): number {
    return this.dailyEfficiencyData.length + this.monthlyData.length;
  }

  get totalDelayValue(): number {
    return this.delayReasons.reduce((sum, d) => sum + d.value, 0);
  }

  getMonthTrend(index: number): string {
    if (index === 0) return '—';
    return this.monthlyData[index].efficiency >= this.monthlyData[index - 1].efficiency ? '↑' : '↓';
  }

  getMonthTrendClass(index: number): string {
    if (index === 0) return 'trend-neutral';
    return this.monthlyData[index].efficiency >= this.monthlyData[index - 1].efficiency ? 'trend-up' : 'trend-down';
  }

  getEfficiencyClass(efficiency: number): string {
    if (efficiency >= 95) return 'eff-green';
    if (efficiency >= 90) return 'eff-blue';
    if (efficiency >= 80) return 'eff-yellow';
    return 'eff-red';
  }

  getStatusBadge(efficiency: number): string {
    if (efficiency >= 100) return 'فراتر از برنامه';
    if (efficiency >= 95) return 'عالی';
    if (efficiency >= 90) return 'خوب';
    if (efficiency >= 80) return 'قابل قبول';
    return 'نیاز به بهبود';
  }

  getStatusBadgeClass(efficiency: number): string {
    if (efficiency >= 100) return 'badge-success-outline';
    if (efficiency >= 95) return 'badge-success';
    if (efficiency >= 90) return 'badge-info';
    if (efficiency >= 80) return 'badge-warning';
    return 'badge-danger';
  }

  getOperatorGrade(efficiency: number): string {
    if (efficiency >= 95) return 'A';
    if (efficiency >= 90) return 'B';
    return 'C';
  }

  getOperatorGradeClass(efficiency: number): string {
    if (efficiency >= 95) return 'grade-a';
    if (efficiency >= 90) return 'grade-b';
    return 'grade-c';
  }

  getSeverityLabel(severity: string): string {
    if (severity === 'critical') return 'بحرانی';
    if (severity === 'warning') return 'هشدار';
    return 'عادی';
  }

  getSeverityClass(severity: string): string {
    if (severity === 'critical') return 'badge-danger';
    if (severity === 'warning') return 'badge-warning';
    return 'badge-info';
  }
}
