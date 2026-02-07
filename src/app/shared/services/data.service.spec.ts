import { TestBed } from '@angular/core/testing';
import { DataService } from './data.service';

describe('DataService', () => {
  let service: DataService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // === Projects ===
  it('should have initial projects', () => {
    expect(service.projects.length).toBeGreaterThan(0);
  });

  it('should add a project', () => {
    const initialCount = service.projects.length;
    service.addProject({
      name: 'Test Project',
      description: 'Desc',
      location: 'Location',
      startDate: '1403/01/01',
      endDate: '1403/12/29',
      status: 'planning',
      progress: 0,
    });
    expect(service.projects.length).toBe(initialCount + 1);
  });

  it('should update a project', () => {
    const projectId = service.projects[0].id;
    service.updateProject(projectId, { name: 'Updated Name' });
    expect(service.getProject(projectId)?.name).toBe('Updated Name');
  });

  it('should delete a project', () => {
    const projectId = service.projects[0].id;
    const initialCount = service.projects.length;
    service.deleteProject(projectId);
    expect(service.projects.length).toBe(initialCount - 1);
  });

  it('should get project by id', () => {
    const project = service.projects[0];
    expect(service.getProject(project.id)).toEqual(project);
  });

  // === Operations ===
  it('should have initial operations', () => {
    expect(service.operations.length).toBeGreaterThan(0);
  });

  it('should get operations by project', () => {
    const firstProjectId = service.projects[0].id;
    const ops = service.getOperationsByProject(firstProjectId);
    ops.forEach(op => expect(op.projectId).toBe(firstProjectId));
  });

  // === Equipment ===
  it('should have initial equipment', () => {
    expect(service.equipmentList.length).toBeGreaterThan(0);
  });

  it('should get equipment by project', () => {
    const result = service.getEquipmentByProject('1');
    expect(Array.isArray(result)).toBe(true);
  });

  // === Operators ===
  it('should have initial operators', () => {
    expect(service.operators.length).toBeGreaterThan(0);
  });

  // === Delay Reasons ===
  it('should have initial delay reasons', () => {
    expect(service.delayReasons.length).toBeGreaterThan(0);
  });

  it('should add a delay reason', () => {
    const initialCount = service.delayReasons.length;
    service.addDelayReason({
      name: 'Test Reason',
      category: 'equipment',
      isActive: true,
    });
    expect(service.delayReasons.length).toBe(initialCount + 1);
  });

  it('should delete a delay reason', () => {
    const id = service.delayReasons[0].id;
    const initialCount = service.delayReasons.length;
    service.deleteDelayReason(id);
    expect(service.delayReasons.length).toBe(initialCount - 1);
  });

  // === Plans ===
  it('should have initial plans', () => {
    expect(service.plans.length).toBeGreaterThan(0);
  });

  it('should add a plan', () => {
    const initialCount = service.plans.length;
    service.addPlan({
      projectId: '1',
      type: 'daily',
      title: 'Test Plan',
      startDate: '1403/01/01',
      endDate: '1403/01/01',
      targetAmount: 100,
      unit: 'meter',
      priority: 'medium',
      status: 'draft',
      createdBy: '1',
    });
    expect(service.plans.length).toBe(initialCount + 1);
  });

  it('should update a plan', () => {
    const planId = service.plans[0].id;
    service.updatePlan(planId, { title: 'Updated Title' });
    const updated = service.plans.find(p => p.id === planId);
    expect(updated?.title).toBe('Updated Title');
  });

  // === Achievements ===
  it('should have initial achievements', () => {
    expect(service.achievements.length).toBeGreaterThan(0);
  });

  // === Reset ===
  it('should reset all data', () => {
    service.addProject({
      name: 'Extra',
      description: 'Desc',
      location: 'Loc',
      startDate: '1403/01/01',
      endDate: '1403/12/29',
      status: 'planning',
      progress: 0,
    });
    const countBefore = service.projects.length;
    service.resetAllData();
    expect(service.projects.length).toBeLessThanOrEqual(countBefore);
    expect(service.periodPlans.length).toBe(0);
    expect(service.periodAchievements.length).toBe(0);
  });

  // === Observables ===
  it('should expose projects$ observable', () => {
    let emittedProjects: unknown[] = [];
    service.projects$.subscribe(p => {
      emittedProjects = p;
    });
    expect(emittedProjects.length).toBeGreaterThan(0);
  });

  it('should expose delayReasons$ observable', () => {
    let emitted: unknown[] = [];
    service.delayReasons$.subscribe(r => {
      emitted = r;
    });
    expect(emitted.length).toBeGreaterThan(0);
  });
});
