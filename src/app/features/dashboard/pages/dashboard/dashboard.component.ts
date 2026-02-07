import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { DataService } from '../../../../shared/services/data.service';
import { AuthService, User } from '../../../../core/services/auth.service';
import { Project } from '../../../../shared/models/data.models';

interface Last7DayEntry {
  date: string;
  dayName: string;
  projectName: string;
  operationName: string;
  planned: number;
  achieved: number;
  unit: string;
  variance: number;
  variancePercent: number;
  isFavorable: boolean;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  Math = Math;
  currentUser: User | null = null;
  availableProjects: Project[] = [];
  activeProjects = 0;
  activeEquipment = 0;
  totalEquipment = 0;
  displayEfficiency = '93.8';

  last7Days: Last7DayEntry[] = [
    { date: '1403/09/13', dayName: 'شنبه', projectName: 'میشدوان', operationName: 'حفاری', planned: 850, achieved: 920, unit: 'متر', variance: 70, variancePercent: 8.2, isFavorable: true },
    { date: '1403/09/14', dayName: 'یکشنبه', projectName: 'ناریگان', operationName: 'حمل مواد', planned: 2400, achieved: 2350, unit: 'تن', variance: -50, variancePercent: -2.1, isFavorable: false },
    { date: '1403/09/15', dayName: 'دوشنبه', projectName: 'تنهک', operationName: 'فراوری', planned: 1800, achieved: 1950, unit: 'تن', variance: 150, variancePercent: 8.3, isFavorable: true },
    { date: '1403/09/16', dayName: 'سه‌شنبه', projectName: 'میشدوان', operationName: 'حفاری', planned: 900, achieved: 875, unit: 'متر', variance: -25, variancePercent: -2.8, isFavorable: false },
    { date: '1403/09/17', dayName: 'چهارشنبه', projectName: 'گلیران', operationName: 'حفاری', planned: 750, achieved: 820, unit: 'متر', variance: 70, variancePercent: 9.3, isFavorable: true },
    { date: '1403/09/18', dayName: 'پنج‌شنبه', projectName: 'ناریگان', operationName: 'حمل مواد', planned: 2600, achieved: 2750, unit: 'تن', variance: 150, variancePercent: 5.8, isFavorable: true },
    { date: '1403/09/19', dayName: 'جمعه', projectName: 'تنهک', operationName: 'پیش فراوری', planned: 1500, achieved: 1620, unit: 'تن', variance: 120, variancePercent: 8.0, isFavorable: true }
  ];

  constructor(
    private dataService: DataService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadData();
  }

  loadData(): void {
    const projects = this.dataService.projects;
    const equipment = this.dataService.equipmentList;

    this.availableProjects = this.currentUser?.role === 'admin'
      ? projects
      : projects.filter(p => this.currentUser?.assignedProjects?.includes(p.id));

    this.activeProjects = this.availableProjects.filter(p => p.status === 'active').length;
    this.activeEquipment = equipment.filter(e => e.status === 'in_use' || e.status === 'available').length;
    this.totalEquipment = equipment.length;
  }

  getProjectProgress(project: Project): number {
    let totalPlanned = project.totalPlanned || 0;
    let achieved = project.totalAchieved || 0;

    if (project.id === '4') {
      totalPlanned = 700;
      achieved = 595;
    } else if (project.id === '2') {
      totalPlanned = 800;
      achieved = 850;
    }

    return totalPlanned > 0 ? Math.round((achieved / totalPlanned) * 100) : 0;
  }

  getProjectTotalPlanned(project: Project): number {
    if (project.id === '4') return 700;
    if (project.id === '2') return 800;
    return project.totalPlanned || 0;
  }

  getProjectAchieved(project: Project): number {
    if (project.id === '4') return 595;
    if (project.id === '2') return 850;
    return project.totalAchieved || 0;
  }

  getPlannedToDate(project: Project): number {
    const totalPlanned = this.getProjectTotalPlanned(project);
    try {
      const startParts = project.startDate.split('/');
      const endParts = project.endDate.split('/');
      const startYear = parseInt(startParts[0]) === 1403 ? 2024 : 2023;
      const endYear = parseInt(endParts[0]) === 1403 ? 2024 : 2023;
      const startDate = new Date(startYear, parseInt(startParts[1]) - 1, parseInt(startParts[2]) || 1);
      const endDate = new Date(endYear, parseInt(endParts[1]) - 1, parseInt(endParts[2]) || 30);
      const today = new Date();
      const totalDuration = endDate.getTime() - startDate.getTime();
      const elapsedDuration = today.getTime() - startDate.getTime();
      const timeProgress = Math.min(Math.max(elapsedDuration / totalDuration, 0), 1);
      return Math.min(Math.round(totalPlanned * timeProgress), totalPlanned);
    } catch {
      const calculated = Math.round(totalPlanned * ((project.progress || 0) / 100));
      return Math.min(calculated, totalPlanned);
    }
  }

  getDelay(project: Project): number {
    return this.getPlannedToDate(project) - this.getProjectAchieved(project);
  }

  getDelayPercentage(project: Project): string {
    const plannedToDate = this.getPlannedToDate(project);
    const delay = this.getDelay(project);
    return plannedToDate > 0 ? Math.abs((delay / plannedToDate) * 100).toFixed(1) : '0.0';
  }

  getProgressRingClass(progress: number): string {
    if (progress >= 90) return 'ring-green';
    if (progress >= 75) return 'ring-blue';
    if (progress >= 50) return 'ring-yellow';
    return 'ring-red';
  }

  getStrokeDasharray(): number {
    return 2 * Math.PI * 28;
  }

  getStrokeDashoffset(progress: number): number {
    return 2 * Math.PI * 28 * (1 - progress / 100);
  }

  getStatusIcon(project: Project): string {
    const delay = this.getDelay(project);
    if (delay > 0) return '⚠️';
    if (delay < 0) return '🎯';
    return '✅';
  }

  getStatusText(project: Project): string {
    const delay = this.getDelay(project);
    if (delay > 0) return `${Math.abs(delay).toLocaleString()} عقب‌افتادگی`;
    if (delay < 0) return `${Math.abs(delay).toLocaleString()} پیشرفت`;
    return 'مطابق برنامه';
  }

  getStatusColor(project: Project): string {
    const delay = this.getDelay(project);
    if (delay > 0) return 'status-red';
    if (delay < 0) return 'status-green';
    return 'status-blue';
  }

  getDayEfficiency(day: Last7DayEntry): number {
    return day.planned > 0 ? Math.round((day.achieved / day.planned) * 100) : 0;
  }

  getEfficiencyClass(efficiency: number): string {
    if (efficiency >= 90) return 'eff-green';
    if (efficiency >= 75) return 'eff-blue';
    if (efficiency >= 50) return 'eff-yellow';
    return 'eff-red';
  }

  resetData(): void {
    this.dataService.resetAllData();
    this.loadData();
  }
}
