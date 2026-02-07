import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  Project, Operation, Equipment, Operator, DelayReason,
  Plan, Achievement, PeriodPlan, PeriodAchievement, DayAchievement
} from '../models/data.models';
import {
  initialProjects, initialOperations, initialEquipment,
  initialOperators, initialDelayReasons, initialPlans, initialAchievements
} from '../models/initial-data';

@Injectable({ providedIn: 'root' })
export class DataService {
  // BehaviorSubjects
  private projectsSubject: BehaviorSubject<Project[]>;
  private operationsSubject: BehaviorSubject<Operation[]>;
  private equipmentSubject: BehaviorSubject<Equipment[]>;
  private operatorsSubject: BehaviorSubject<Operator[]>;
  private delayReasonsSubject: BehaviorSubject<DelayReason[]>;
  private plansSubject: BehaviorSubject<Plan[]>;
  private achievementsSubject: BehaviorSubject<Achievement[]>;
  private periodPlansSubject: BehaviorSubject<PeriodPlan[]>;
  private periodAchievementsSubject: BehaviorSubject<PeriodAchievement[]>;

  // Observables
  projects$: Observable<Project[]>;
  operations$: Observable<Operation[]>;
  equipment$: Observable<Equipment[]>;
  operators$: Observable<Operator[]>;
  delayReasons$: Observable<DelayReason[]>;
  plans$: Observable<Plan[]>;
  achievements$: Observable<Achievement[]>;
  periodPlans$: Observable<PeriodPlan[]>;
  periodAchievements$: Observable<PeriodAchievement[]>;

  constructor() {
    this.projectsSubject = new BehaviorSubject<Project[]>(
      this.loadData<Project>('mining_projects', initialProjects)
    );
    this.operationsSubject = new BehaviorSubject<Operation[]>(
      this.loadData<Operation>('mining_operations', initialOperations)
    );
    this.equipmentSubject = new BehaviorSubject<Equipment[]>(
      this.loadData<Equipment>('mining_equipment', initialEquipment)
    );
    this.operatorsSubject = new BehaviorSubject<Operator[]>(
      this.loadData<Operator>('mining_operators', initialOperators)
    );
    this.delayReasonsSubject = new BehaviorSubject<DelayReason[]>(
      this.loadData<DelayReason>('mining_delay_reasons', initialDelayReasons)
    );
    this.plansSubject = new BehaviorSubject<Plan[]>(
      this.loadData<Plan>('mining_plans', initialPlans)
    );
    this.achievementsSubject = new BehaviorSubject<Achievement[]>(
      this.loadData<Achievement>('mining_achievements', initialAchievements)
    );
    this.periodPlansSubject = new BehaviorSubject<PeriodPlan[]>(
      this.loadPeriodPlans()
    );
    this.periodAchievementsSubject = new BehaviorSubject<PeriodAchievement[]>(
      this.loadPeriodAchievements()
    );

    // Expose as observables
    this.projects$ = this.projectsSubject.asObservable();
    this.operations$ = this.operationsSubject.asObservable();
    this.equipment$ = this.equipmentSubject.asObservable();
    this.operators$ = this.operatorsSubject.asObservable();
    this.delayReasons$ = this.delayReasonsSubject.asObservable();
    this.plans$ = this.plansSubject.asObservable();
    this.achievements$ = this.achievementsSubject.asObservable();
    this.periodPlans$ = this.periodPlansSubject.asObservable();
    this.periodAchievements$ = this.periodAchievementsSubject.asObservable();

    // Auto-save to localStorage
    this.projects$.subscribe(data => this.saveData('mining_projects', data));
    this.operations$.subscribe(data => this.saveData('mining_operations', data));
    this.equipment$.subscribe(data => this.saveData('mining_equipment', data));
    this.operators$.subscribe(data => this.saveData('mining_operators', data));
    this.delayReasons$.subscribe(data => this.saveData('mining_delay_reasons', data));
    this.plans$.subscribe(data => this.saveData('mining_plans', data));
    this.achievements$.subscribe(data => this.saveData('mining_achievements', data));
    this.periodPlans$.subscribe(data => this.saveData('mining_period_plans', data));
    this.periodAchievements$.subscribe(data => this.saveData('mining_period_achievements', data));
  }

  // --- Synchronous getters ---
  get projects(): Project[] { return this.projectsSubject.value; }
  get operations(): Operation[] { return this.operationsSubject.value; }
  get equipmentList(): Equipment[] { return this.equipmentSubject.value; }
  get operators(): Operator[] { return this.operatorsSubject.value; }
  get delayReasons(): DelayReason[] { return this.delayReasonsSubject.value; }
  get plans(): Plan[] { return this.plansSubject.value; }
  get achievements(): Achievement[] { return this.achievementsSubject.value; }
  get periodPlans(): PeriodPlan[] { return this.periodPlansSubject.value; }
  get periodAchievements(): PeriodAchievement[] { return this.periodAchievementsSubject.value; }

  // --- Private helpers ---
  private loadData<T>(key: string, defaultData: T[]): T[] {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) as T[] : defaultData;
  }

  private saveData<T>(key: string, data: T[]): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  private loadPeriodPlans(): PeriodPlan[] {
    const saved = localStorage.getItem('mining_period_plans');
    if (saved) {
      const plans: PeriodPlan[] = JSON.parse(saved);
      return plans.map(plan => ({
        ...plan,
        days: plan.days.map(day => ({
          ...day,
          isHoliday: day.isHoliday !== undefined ? day.isHoliday : (day.plannedAmount === 0 && day.notes === '\u0631\u0648\u0632 \u062A\u0639\u0637\u06CC\u0644')
        }))
      }));
    }
    return [];
  }

  private loadPeriodAchievements(): PeriodAchievement[] {
    const saved = localStorage.getItem('mining_period_achievements');
    if (saved) {
      const achievements: PeriodAchievement[] = JSON.parse(saved);
      return achievements.map(achievement => ({
        ...achievement,
        days: achievement.days.map(day => ({
          ...day,
          isHoliday: day.isHoliday !== undefined ? day.isHoliday : (day.plannedAmount === 0 && (day.notes === '\u0631\u0648\u0632 \u062A\u0639\u0637\u06CC\u0644' || day.delayDescription === '\u0631\u0648\u0632 \u062A\u0639\u0637\u06CC\u0644'))
        }))
      }));
    }
    return [];
  }

  private generateId(): string {
    return Date.now().toString();
  }

  private now(): string {
    return new Date().toLocaleDateString('fa-IR');
  }

  // ==================== Projects ====================
  addProject(project: Omit<Project, 'id' | 'createdAt'>): void {
    const newProject: Project = { ...project, id: this.generateId(), createdAt: this.now() };
    this.projectsSubject.next([...this.projects, newProject]);
  }

  updateProject(id: string, data: Partial<Project>): void {
    this.projectsSubject.next(
      this.projects.map(p => p.id === id ? { ...p, ...data } : p)
    );
  }

  deleteProject(id: string): void {
    this.projectsSubject.next(this.projects.filter(p => p.id !== id));
    this.operationsSubject.next(this.operations.filter(op => op.projectId !== id));
  }

  getProject(id: string): Project | undefined {
    return this.projects.find(p => p.id === id);
  }

  // ==================== Operations ====================
  addOperation(operation: Omit<Operation, 'id' | 'createdAt'>): void {
    const newOp: Operation = { ...operation, id: this.generateId(), createdAt: this.now() };
    this.operationsSubject.next([...this.operations, newOp]);
  }

  updateOperation(id: string, data: Partial<Operation>): void {
    this.operationsSubject.next(
      this.operations.map(op => op.id === id ? { ...op, ...data } : op)
    );
  }

  deleteOperation(id: string): void {
    this.operationsSubject.next(this.operations.filter(op => op.id !== id));
  }

  getOperationsByProject(projectId: string): Operation[] {
    return this.operations.filter(op => op.projectId === projectId);
  }

  // ==================== Equipment ====================
  addEquipment(equipment: Omit<Equipment, 'id' | 'createdAt'>): void {
    const newEq: Equipment = { ...equipment, id: this.generateId(), createdAt: this.now() };
    this.equipmentSubject.next([...this.equipmentList, newEq]);
  }

  updateEquipment(id: string, data: Partial<Equipment>): void {
    this.equipmentSubject.next(
      this.equipmentList.map(eq => eq.id === id ? { ...eq, ...data } : eq)
    );
  }

  deleteEquipment(id: string): void {
    this.equipmentSubject.next(this.equipmentList.filter(eq => eq.id !== id));
  }

  getEquipmentByProject(projectId: string): Equipment[] {
    return this.equipmentList.filter(eq => eq.projectId === projectId);
  }

  // ==================== Operators ====================
  addOperator(operator: Omit<Operator, 'id' | 'createdAt'>): void {
    const newOp: Operator = { ...operator, id: this.generateId(), createdAt: this.now() };
    this.operatorsSubject.next([...this.operators, newOp]);
  }

  updateOperator(id: string, data: Partial<Operator>): void {
    this.operatorsSubject.next(
      this.operators.map(op => op.id === id ? { ...op, ...data } : op)
    );
  }

  deleteOperator(id: string): void {
    this.operatorsSubject.next(this.operators.filter(op => op.id !== id));
  }

  getOperatorsByProject(projectId: string): Operator[] {
    return this.operators.filter(op => op.assignedProjects?.includes(projectId));
  }

  // ==================== Delay Reasons ====================
  addDelayReason(reason: Omit<DelayReason, 'id' | 'createdAt'>): void {
    const newReason: DelayReason = { ...reason, id: this.generateId(), createdAt: this.now() };
    this.delayReasonsSubject.next([...this.delayReasons, newReason]);
  }

  updateDelayReason(id: string, data: Partial<DelayReason>): void {
    this.delayReasonsSubject.next(
      this.delayReasons.map(r => r.id === id ? { ...r, ...data } : r)
    );
  }

  deleteDelayReason(id: string): void {
    this.delayReasonsSubject.next(this.delayReasons.filter(r => r.id !== id));
  }

  getDelayReasonById(id: string): DelayReason | undefined {
    return this.delayReasons.find(r => r.id === id);
  }

  // ==================== Plans ====================
  addPlan(plan: Omit<Plan, 'id' | 'createdAt'>): void {
    const newPlan: Plan = { ...plan, id: this.generateId(), createdAt: this.now() };
    this.plansSubject.next([...this.plans, newPlan]);
  }

  updatePlan(id: string, data: Partial<Plan>): void {
    this.plansSubject.next(
      this.plans.map(p => p.id === id ? { ...p, ...data } : p)
    );
  }

  deletePlan(id: string): void {
    this.plansSubject.next(this.plans.filter(p => p.id !== id));
    this.achievementsSubject.next(this.achievements.filter(a => a.planId !== id));
  }

  getPlansByProject(projectId: string): Plan[] {
    return this.plans.filter(p => p.projectId === projectId);
  }

  getPlansByOperation(operationId: string): Plan[] {
    return this.plans.filter(p => p.operationId === operationId);
  }

  // ==================== Achievements ====================
  addAchievement(achievement: Omit<Achievement, 'id' | 'reportedAt'>): void {
    const newAch: Achievement = { ...achievement, id: this.generateId(), reportedAt: this.now() };
    this.achievementsSubject.next([...this.achievements, newAch]);
  }

  updateAchievement(id: string, data: Partial<Achievement>): void {
    this.achievementsSubject.next(
      this.achievements.map(a => a.id === id ? { ...a, ...data } : a)
    );
  }

  deleteAchievement(id: string): void {
    this.achievementsSubject.next(this.achievements.filter(a => a.id !== id));
  }

  getAchievementsByProject(projectId: string): Achievement[] {
    return this.achievements.filter(a => a.projectId === projectId);
  }

  getAchievementsByPlan(planId: string): Achievement[] {
    return this.achievements.filter(a => a.planId === planId);
  }

  // ==================== Period Plans ====================
  addPeriodPlan(plan: Omit<PeriodPlan, 'id' | 'createdAt' | 'updatedAt'>): void {
    const newPlan: PeriodPlan = {
      ...plan,
      id: this.generateId(),
      createdAt: this.now(),
      updatedAt: this.now()
    };
    this.periodPlansSubject.next([...this.periodPlans, newPlan]);

    // Auto-create period achievement
    const project = this.projects.find(p => p.id === newPlan.projectId);
    const dayAchievements: DayAchievement[] = newPlan.days.map(day => ({
      date: day.date,
      plannedAmount: day.isHoliday ? 0 : day.plannedAmount,
      achievedAmount: 0,
      achievementPercentage: 0,
      status: 'not_started' as const,
      delayReasons: [],
      delayDescription: day.isHoliday ? '\u0631\u0648\u0632 \u062A\u0639\u0637\u06CC\u0644' : '',
      notes: day.isHoliday ? '\u0631\u0648\u0632 \u062A\u0639\u0637\u06CC\u0644' : '',
      operatorHours: [],
      equipmentHours: [],
      reportedBy: '',
      reportedAt: '',
      isHoliday: day.isHoliday
    }));

    const periodType: 'weekly' | 'monthly' | 'yearly' =
      newPlan.period === 'custom' ? 'monthly' : newPlan.period;

    const newAchievement: PeriodAchievement = {
      id: this.generateId() + '_ach',
      periodPlanId: newPlan.id,
      planTitle: newPlan.title,
      projectId: newPlan.projectId,
      projectName: project?.name || '',
      operationId: newPlan.operationId,
      operationName: newPlan.operationName,
      period: periodType,
      startDate: newPlan.startDate,
      endDate: newPlan.endDate,
      unit: newPlan.unit,
      days: dayAchievements,
      totalPlanned: newPlan.totalPlanned,
      totalAchieved: 0,
      overallAchievement: 0,
      overallStatus: 'on_track',
      createdBy: newPlan.createdBy,
      createdAt: this.now(),
      updatedAt: this.now()
    };

    this.periodAchievementsSubject.next([...this.periodAchievements, newAchievement]);
  }

  updatePeriodPlan(id: string, data: Partial<PeriodPlan>): void {
    this.periodPlansSubject.next(
      this.periodPlans.map(p =>
        p.id === id ? { ...p, ...data, updatedAt: this.now() } : p
      )
    );

    // Cascade day updates to related achievement
    if (data.days) {
      const achievement = this.periodAchievements.find(a => a.periodPlanId === id);
      if (achievement) {
        const updatedDays = achievement.days.map((dayAch, index) => {
          const updatedDay = data.days?.[index];
          if (updatedDay) {
            return {
              ...dayAch,
              plannedAmount: updatedDay.isHoliday ? 0 : updatedDay.plannedAmount,
              notes: updatedDay.isHoliday ? '\u0631\u0648\u0632 \u062A\u0639\u0637\u06CC\u0644' : dayAch.notes,
              delayDescription: updatedDay.isHoliday ? '\u0631\u0648\u0632 \u062A\u0639\u0637\u06CC\u0644' : dayAch.delayDescription,
              isHoliday: updatedDay.isHoliday
            };
          }
          return dayAch;
        });

        const totalPlanned = updatedDays.reduce((sum, day) => sum + day.plannedAmount, 0);
        const totalAchieved = updatedDays.reduce((sum, day) => sum + day.achievedAmount, 0);
        const overallAchievement = totalPlanned > 0
          ? Math.round((totalAchieved / totalPlanned) * 100 * 10) / 10
          : 0;

        this.updatePeriodAchievement(achievement.id, {
          days: updatedDays,
          totalPlanned,
          totalAchieved,
          overallAchievement
        });
      }
    }
  }

  deletePeriodPlan(id: string): void {
    this.periodPlansSubject.next(this.periodPlans.filter(p => p.id !== id));
    this.periodAchievementsSubject.next(
      this.periodAchievements.filter(a => a.periodPlanId !== id)
    );
  }

  getPeriodPlansByProject(projectId: string): PeriodPlan[] {
    return this.periodPlans.filter(p => p.projectId === projectId);
  }

  getPeriodPlansByOperation(operationId: string): PeriodPlan[] {
    return this.periodPlans.filter(p => p.operationId === operationId);
  }

  // ==================== Period Achievements ====================
  addPeriodAchievement(achievement: Omit<PeriodAchievement, 'id' | 'createdAt' | 'updatedAt'>): void {
    const newAch: PeriodAchievement = {
      ...achievement,
      id: this.generateId(),
      createdAt: this.now(),
      updatedAt: this.now()
    };
    this.periodAchievementsSubject.next([...this.periodAchievements, newAch]);
  }

  updatePeriodAchievement(id: string, data: Partial<PeriodAchievement>): void {
    this.periodAchievementsSubject.next(
      this.periodAchievements.map(a =>
        a.id === id ? { ...a, ...data, updatedAt: this.now() } : a
      )
    );
  }

  deletePeriodAchievement(id: string): void {
    this.periodAchievementsSubject.next(
      this.periodAchievements.filter(a => a.id !== id)
    );
  }

  getPeriodAchievementsByProject(projectId: string): PeriodAchievement[] {
    return this.periodAchievements.filter(a => a.projectId === projectId);
  }

  getPeriodAchievementByPlanId(periodPlanId: string): PeriodAchievement | undefined {
    return this.periodAchievements.find(a => a.periodPlanId === periodPlanId);
  }

  // ==================== Utility ====================
  resetAllData(): void {
    localStorage.removeItem('mining_projects');
    localStorage.removeItem('mining_operations');
    localStorage.removeItem('mining_equipment');
    localStorage.removeItem('mining_operators');
    localStorage.removeItem('mining_delay_reasons');
    localStorage.removeItem('mining_plans');
    localStorage.removeItem('mining_achievements');
    localStorage.removeItem('mining_period_plans');
    localStorage.removeItem('mining_period_achievements');

    this.projectsSubject.next(initialProjects);
    this.operationsSubject.next(initialOperations);
    this.equipmentSubject.next(initialEquipment);
    this.operatorsSubject.next(initialOperators);
    this.delayReasonsSubject.next(initialDelayReasons);
    this.plansSubject.next(initialPlans);
    this.achievementsSubject.next(initialAchievements);
    this.periodPlansSubject.next([]);
    this.periodAchievementsSubject.next([]);
  }
}
