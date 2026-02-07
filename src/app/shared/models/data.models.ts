export interface User {
  id: string;
  name: string;
  username: string;
  role: 'admin' | 'project_manager' | 'operator';
  assignedProjects?: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  status: 'planning' | 'active' | 'completed' | 'suspended';
  progress: number;
  managerId?: string;
  budget?: number;
  totalPlanned?: number;
  totalAchieved?: number;
  efficiency?: number;
  createdAt: string;
}

export interface Operation {
  id: string;
  projectId: string;
  name: string;
  type: string;
  description?: string;
  status: 'active' | 'completed' | 'suspended';
  startDate: string;
  endDate?: string;
  assignedEquipment?: string[];
  assignedOperators?: string[];
  budget?: number;
  createdAt: string;
}

export interface Equipment {
  id: string;
  name: string;
  type: string;
  model?: string;
  serialNumber?: string;
  projectId?: string;
  status: 'available' | 'in_use' | 'maintenance' | 'retired';
  efficiency?: number;
  lastMaintenanceDate?: string;
  nextMaintenanceDate?: string;
  createdAt: string;
}

export interface Operator {
  id: string;
  name: string;
  username: string;
  role: 'operator';
  assignedProjects?: string[];
  skills?: string[];
  createdAt: string;
}

export interface DelayReason {
  id: string;
  name: string;
  category: 'equipment' | 'weather' | 'material' | 'maintenance' | 'other';
  description?: string;
  color?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Plan {
  id: string;
  projectId: string;
  operationId?: string;
  type: 'daily' | 'weekly' | 'monthly';
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  targetAmount: number;
  unit: string;
  priority: 'low' | 'medium' | 'high';
  assignedEquipment?: string[];
  assignedOperators?: string[];
  status: 'draft' | 'approved' | 'active' | 'completed';
  createdBy: string;
  createdAt: string;
}

export interface Achievement {
  id: string;
  planId: string;
  projectId: string;
  operationId?: string;
  date: string;
  plannedAmount: number;
  achievedAmount: number;
  unit: string;
  efficiency: number;
  status: 'completed' | 'partial' | 'failed';
  delayReasons?: string[];
  delayDescription?: string;
  operatorHours: { operatorId: string; hours: number }[];
  equipmentHours: { equipmentId: string; hours: number }[];
  notes?: string;
  reportedBy: string;
  reportedAt: string;
}

export interface DayPlan {
  date: string;
  plannedAmount: number;
  notes?: string;
  isHoliday?: boolean;
}

export interface PeriodPlan {
  id: string;
  projectId: string;
  operationId: string;
  operationName: string;
  title: string;
  description?: string;
  period: 'weekly' | 'monthly' | 'yearly' | 'custom';
  startDate: string;
  endDate: string;
  unit: string;
  days: DayPlan[];
  totalPlanned: number;
  priority: 'low' | 'medium' | 'high';
  assignedEquipment?: string[];
  assignedOperators?: string[];
  status: 'draft' | 'approved' | 'active' | 'completed';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface DayAchievement {
  date: string;
  plannedAmount: number;
  achievedAmount: number;
  achievementPercentage: number;
  status: 'not_started' | 'in_progress' | 'completed' | 'delayed';
  delayReasons: string[];
  delayDescription: string;
  notes: string;
  operatorHours: { operatorId: string; operatorName: string; hours: number }[];
  equipmentHours: { equipmentId: string; equipmentName: string; hours: number }[];
  reportedBy: string;
  reportedAt: string;
  isHoliday?: boolean;
}

export interface PeriodAchievement {
  id: string;
  periodPlanId: string;
  planTitle: string;
  projectId: string;
  projectName: string;
  operationId: string;
  operationName: string;
  period: 'weekly' | 'monthly' | 'yearly';
  startDate: string;
  endDate: string;
  unit: string;
  days: DayAchievement[];
  totalPlanned: number;
  totalAchieved: number;
  overallAchievement: number;
  overallStatus: 'on_track' | 'delayed' | 'completed' | 'at_risk';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}
