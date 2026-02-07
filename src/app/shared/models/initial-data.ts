import {
  Project, Operation, Equipment, Operator, DelayReason,
  Plan, Achievement
} from './data.models';

export const initialProjects: Project[] = [
  {
    id: '1',
    name: '\u067E\u0631\u0648\u0698\u0647 \u0645\u0639\u062F\u0646 \u0645\u06CC\u0634\u062F\u0648\u0627\u0646',
    description: '\u067E\u0631\u0648\u0698\u0647 \u062A\u0648\u0633\u0639\u0647 \u0645\u0639\u062F\u0646 \u062F\u0631 \u0628\u062E\u0634 \u0634\u0645\u0627\u0644\u06CC - \u0634\u0627\u0645\u0644 \u062D\u0641\u0627\u0631\u06CC \u0648 \u0627\u0633\u062A\u062E\u0631\u0627\u062C',
    location: '\u0628\u0627\u0641\u0642',
    startDate: '1403/01/01',
    endDate: '1403/06/30',
    status: 'active',
    progress: 75,
    managerId: '2',
    budget: 5000000000,
    totalPlanned: 500,
    totalAchieved: 425,
    efficiency: 85,
    createdAt: '1402/12/15'
  },
  {
    id: '2',
    name: '\u067E\u0631\u0648\u0698\u0647 \u0645\u0639\u062F\u0646 \u0646\u0627\u0631\u06CC\u06AF\u0627\u0646',
    description: '\u067E\u0631\u0648\u0698\u0647 \u0627\u0633\u062A\u062E\u0631\u0627\u062C \u0648 \u062D\u0645\u0644 \u0645\u0648\u0627\u062F \u0645\u0639\u062F\u0646\u06CC \u0627\u0632 \u0628\u062E\u0634 \u062C\u0646\u0648\u0628\u06CC',
    location: '\u0628\u0627\u0641\u0642',
    startDate: '1403/02/01',
    endDate: '1403/08/30',
    status: 'active',
    progress: 60,
    managerId: '2',
    budget: 8000000000,
    totalPlanned: 800,
    totalAchieved: 850,
    efficiency: 106,
    createdAt: '1403/01/10'
  },
  {
    id: '3',
    name: '\u067E\u0631\u0648\u0698\u0647 \u0645\u0639\u062F\u0646 \u062A\u0646\u0647\u06A9',
    description: '\u067E\u0631\u0648\u0698\u0647 \u0628\u0647\u0631\u0647\u200C\u0628\u0631\u062F\u0627\u0631\u06CC \u0627\u0632 \u0645\u0639\u062F\u0646 \u0634\u0631\u0642\u06CC',
    location: '\u0628\u0632\u0645\u0627\u0646',
    startDate: '1402/10/01',
    endDate: '1403/12/30',
    status: 'active',
    progress: 90,
    budget: 3000000000,
    totalPlanned: 600,
    totalAchieved: 468,
    efficiency: 78,
    createdAt: '1402/09/20'
  },
  {
    id: '4',
    name: '\u067E\u0631\u0648\u0698\u0647 \u0645\u0639\u062F\u0646 \u06AF\u0644\u06CC\u0631\u0627\u0646',
    description: '\u067E\u0631\u0648\u0698\u0647 \u0627\u06A9\u062A\u0634\u0627\u0641 \u0645\u0646\u0627\u0628\u0639 \u062C\u062F\u06CC\u062F \u062F\u0631 \u0628\u062E\u0634 \u063A\u0631\u0628\u06CC',
    location: '\u0634\u0631\u0642',
    startDate: '1403/03/01',
    endDate: '1403/09/30',
    status: 'planning',
    progress: 15,
    budget: 2000000000,
    totalPlanned: 700,
    totalAchieved: 595,
    efficiency: 100,
    createdAt: '1403/02/01'
  }
];

export const initialOperations: Operation[] = [
  {
    id: '1', projectId: '1', name: '\u062D\u0641\u0627\u0631', type: 'drilling',
    description: '\u0639\u0645\u0644\u06CC\u0627\u062A \u062D\u0641\u0627\u0631\u06CC \u0645\u0639\u062F\u0646 \u0645\u06CC\u0634\u062F\u0648\u0627\u0646',
    status: 'active', startDate: '1403/01/01', endDate: '1403/06/30',
    assignedEquipment: ['1'], assignedOperators: ['3', '4'],
    budget: 2000000000, createdAt: '1402/12/15'
  },
  {
    id: '2', projectId: '2', name: '\u062D\u0645\u0644 \u0645\u0627\u062F\u0647 \u0645\u0639\u062F\u0646\u06CC', type: 'ore_transportation',
    description: '\u0627\u0646\u062A\u0642\u0627\u0644 \u0645\u0648\u0627\u062F \u0645\u0639\u062F\u0646\u06CC \u0627\u0632 \u0645\u0639\u062F\u0646 \u0628\u0647 \u06A9\u0627\u0631\u062E\u0627\u0646\u0647',
    status: 'active', startDate: '1403/02/01', endDate: '1403/08/30',
    assignedEquipment: ['3'], assignedOperators: ['5'],
    budget: 4000000000, createdAt: '1403/01/10'
  },
  {
    id: '3', projectId: '2', name: '\u062D\u0645\u0644 \u0645\u0627\u062F\u0647 \u0628\u0627\u0637\u0644\u0647', type: 'waste_transportation',
    description: '\u0627\u0646\u062A\u0642\u0627\u0644 \u0645\u0648\u0627\u062F \u0628\u0627\u0637\u0644\u0647 \u0628\u0647 \u0645\u062D\u0644 \u062F\u067E\u0648',
    status: 'active', startDate: '1403/02/15',
    assignedEquipment: ['3'], assignedOperators: ['6'],
    budget: 2000000000, createdAt: '1403/02/01'
  },
  {
    id: '4', projectId: '3', name: '\u067E\u06CC\u0634 \u0641\u0631\u0627\u0648\u0631\u06CC', type: 'preprocessing',
    description: '\u0641\u0631\u0622\u06CC\u0646\u062F \u067E\u06CC\u0634 \u0641\u0631\u0627\u0648\u0631\u06CC \u0645\u0648\u0627\u062F \u0645\u0639\u062F\u0646\u06CC',
    status: 'active', startDate: '1402/10/01', endDate: '1403/12/30',
    assignedEquipment: ['2'], assignedOperators: ['3'],
    budget: 1500000000, createdAt: '1402/09/20'
  },
  {
    id: '5', projectId: '3', name: '\u0641\u0631\u0627\u0648\u0631\u06CC', type: 'processing',
    description: '\u0641\u0631\u0622\u06CC\u0646\u062F \u0641\u0631\u0627\u0648\u0631\u06CC \u0646\u0647\u0627\u06CC\u06CC \u0645\u0648\u0627\u062F \u0645\u0639\u062F\u0646\u06CC',
    status: 'active', startDate: '1402/10/01', endDate: '1403/12/30',
    assignedEquipment: ['2'], assignedOperators: ['4'],
    budget: 1500000000, createdAt: '1402/09/20'
  },
  {
    id: '6', projectId: '4', name: '\u062D\u0641\u0627\u0631\u06CC', type: 'drilling',
    description: '\u0639\u0645\u0644\u06CC\u0627\u062A \u062D\u0641\u0627\u0631\u06CC \u0627\u06A9\u062A\u0634\u0627\u0641\u06CC \u0645\u0639\u062F\u0646 \u06AF\u0644\u06CC\u0631\u0627\u0646',
    status: 'active', startDate: '1403/03/01', endDate: '1403/09/30',
    assignedEquipment: ['1'], assignedOperators: ['5'],
    budget: 1000000000, createdAt: '1403/02/01'
  },
  {
    id: '7', projectId: '4', name: '\u062D\u0641\u0627\u0631\u06CC \u0627\u06A9\u062A\u0634\u0627\u0641\u06CC', type: 'drilling',
    description: '\u062D\u0641\u0627\u0631\u06CC\u200C\u0647\u0627\u06CC \u0627\u06A9\u062A\u0634\u0627\u0641\u06CC \u0628\u0631\u0627\u06CC \u0634\u0646\u0627\u0633\u0627\u06CC\u06CC \u0645\u0646\u0627\u0628\u0639 \u062C\u062F\u06CC\u062F',
    status: 'active', startDate: '1403/03/01', endDate: '1403/09/30',
    assignedEquipment: ['7'], assignedOperators: ['3'],
    budget: 1000000000, createdAt: '1403/02/01'
  }
];

export const initialEquipment: Equipment[] = [
  { id: '1', name: '\u062F\u0633\u062A\u06AF\u0627\u0647 \u062D\u0641\u0627\u0631\u06CC JK 810', type: 'drilling', model: 'JK 810', serialNumber: 'DR-JK810-001', projectId: '1', status: 'in_use', efficiency: 85, lastMaintenanceDate: '1403/08/15', nextMaintenanceDate: '1403/10/15', createdAt: '1400/01/15' },
  { id: '2', name: '\u0628\u06CC\u0644 \u0645\u06A9\u0627\u0646\u06CC\u06A9\u06CC \u06A9\u0648\u0645\u0627\u062A\u0633\u0648 450', type: 'excavator', model: '\u06A9\u0648\u0645\u0627\u062A\u0633\u0648 450', serialNumber: 'EX-KOM450-001', projectId: '1', status: 'in_use', efficiency: 92, lastMaintenanceDate: '1403/09/01', nextMaintenanceDate: '1403/11/01', createdAt: '1401/03/20' },
  { id: '3', name: '\u06A9\u0627\u0645\u06CC\u0648\u0646 \u0628\u06CC\u200C\u0628\u0646', type: 'truck', model: '\u0628\u06CC\u200C\u0628\u0646 320', serialNumber: 'TR-BB-001', projectId: '2', status: 'in_use', efficiency: 88, lastMaintenanceDate: '1403/08/20', nextMaintenanceDate: '1403/09/20', createdAt: '1402/05/10' },
  { id: '4', name: '\u0628\u06CC\u0644 \u0645\u06A9\u0627\u0646\u06CC\u06A9\u06CC \u06A9\u0648\u0645\u0627\u062A\u0633\u0648 450', type: 'excavator', model: '\u06A9\u0648\u0645\u0627\u062A\u0633\u0648 450', serialNumber: 'EX-KOM450-002', projectId: '2', status: 'in_use', efficiency: 90, lastMaintenanceDate: '1403/08/25', nextMaintenanceDate: '1403/10/25', createdAt: '1401/04/15' },
  { id: '5', name: '\u0628\u06CC\u0644 \u0645\u06A9\u0627\u0646\u06CC\u06A9\u06CC \u06A9\u0648\u0645\u0627\u062A\u0633\u0648 450', type: 'excavator', model: '\u06A9\u0648\u0645\u0627\u062A\u0633\u0648 450', serialNumber: 'EX-KOM450-003', projectId: '3', status: 'in_use', efficiency: 87, lastMaintenanceDate: '1403/08/10', nextMaintenanceDate: '1403/10/10', createdAt: '1400/06/15' },
  { id: '6', name: '\u06A9\u0627\u0645\u06CC\u0648\u0646 \u0628\u06CC\u200C\u0628\u0646', type: 'truck', model: '\u0628\u06CC\u200C\u0628\u0646 380', serialNumber: 'TR-BB-002', projectId: '3', status: 'in_use', efficiency: 91, lastMaintenanceDate: '1403/09/05', nextMaintenanceDate: '1403/11/05', createdAt: '1401/07/20' },
  { id: '7', name: '\u062F\u0633\u062A\u06AF\u0627\u0647 \u062D\u0641\u0627\u0631\u06CC JK 810', type: 'drilling', model: 'JK 810', serialNumber: 'DR-JK810-002', projectId: '4', status: 'in_use', efficiency: 83, lastMaintenanceDate: '1403/09/10', nextMaintenanceDate: '1403/11/10', createdAt: '1402/08/20' },
  { id: '8', name: '\u0628\u06CC\u0644 \u0645\u06A9\u0627\u0646\u06CC\u06A9\u06CC \u06A9\u0648\u0645\u0627\u062A\u0633\u0648 450', type: 'excavator', model: '\u06A9\u0648\u0645\u0627\u062A\u0633\u0648 450', serialNumber: 'EX-KOM450-004', projectId: '4', status: 'in_use', efficiency: 89, lastMaintenanceDate: '1403/09/08', nextMaintenanceDate: '1403/11/08', createdAt: '1402/09/01' },
  { id: '9', name: '\u06A9\u0627\u0645\u06CC\u0648\u0646 \u0628\u06CC\u200C\u0628\u0646', type: 'truck', model: '\u0628\u06CC\u200C\u0628\u0646 340', serialNumber: 'TR-BB-003', status: 'maintenance', efficiency: 70, lastMaintenanceDate: '1403/09/15', nextMaintenanceDate: '1403/10/15', createdAt: '1399/11/10' },
  { id: '10', name: '\u0628\u06CC\u0644 \u0645\u06A9\u0627\u0646\u06CC\u06A9\u06CC \u06A9\u0648\u0645\u0627\u062A\u0633\u0648 450', type: 'excavator', model: '\u06A9\u0648\u0645\u0627\u062A\u0633\u0648 450', serialNumber: 'EX-KOM450-005', status: 'retired', efficiency: 45, lastMaintenanceDate: '1403/07/01', createdAt: '1398/05/25' }
];

export const initialOperators: Operator[] = [
  { id: '3', name: '\u0645\u062D\u0645\u062F \u0631\u0636\u0627\u06CC\u06CC', username: 'operator1', role: 'operator', assignedProjects: ['1'], skills: ['drilling', 'excavation'], createdAt: '1402/11/01' },
  { id: '4', name: '\u062D\u0633\u0646 \u0645\u062D\u0645\u062F\u06CC', username: 'operator2', role: 'operator', assignedProjects: ['1'], skills: ['drilling'], createdAt: '1402/11/05' },
  { id: '5', name: '\u0639\u0644\u06CC \u06A9\u0631\u0645\u06CC', username: 'operator3', role: 'operator', assignedProjects: ['1', '2'], skills: ['excavation', 'transportation'], createdAt: '1402/11/10' },
  { id: '6', name: '\u0645\u0647\u062F\u06CC \u0641\u0631\u0647\u0627\u062F\u06CC', username: 'operator4', role: 'operator', assignedProjects: ['2'], skills: ['transportation'], createdAt: '1402/11/15' }
];

export const initialDelayReasons: DelayReason[] = [
  { id: '1', name: '\u062E\u0631\u0627\u0628\u06CC \u062A\u062C\u0647\u06CC\u0632\u0627\u062A', category: 'equipment', description: '\u062E\u0631\u0627\u0628\u06CC \u062F\u0631 \u0639\u0645\u0644\u06A9\u0631\u062F \u062A\u062C\u0647\u06CC\u0632\u0627\u062A \u0645\u0639\u062F\u0646\u06CC', color: '#FF5733', isActive: true, createdAt: '1403/01/01' },
  { id: '2', name: '\u0628\u0627\u0631\u0634 \u0634\u062F\u06CC\u062F', category: 'weather', description: '\u0634\u0631\u0627\u06CC\u0637 \u0622\u0628 \u0648 \u0647\u0648\u0627\u06CC\u06CC \u0646\u0627\u0645\u0633\u0627\u0639\u062F', color: '#33FF57', isActive: true, createdAt: '1403/01/01' },
  { id: '3', name: '\u0645\u0648\u0627\u062F \u0646\u0627\u0642\u0635', category: 'material', description: '\u0639\u062F\u0645 \u0648\u062C\u0648\u062F \u0645\u0648\u0627\u062F \u0644\u0627\u0632\u0645 \u0628\u0631\u0627\u06CC \u0639\u0645\u0644\u06CC\u0627\u062A', color: '#3357FF', isActive: true, createdAt: '1403/01/01' },
  { id: '4', name: '\u062A\u0639\u0645\u06CC\u0631\u0627\u062A \u062A\u062C\u0647\u06CC\u0632\u0627\u062A', category: 'maintenance', description: '\u062A\u0639\u0645\u06CC\u0631\u0627\u062A \u0648 \u0646\u06AF\u0647\u062F\u0627\u0631\u06CC \u062A\u062C\u0647\u06CC\u0632\u0627\u062A', color: '#FF33A1', isActive: true, createdAt: '1403/01/01' },
  { id: '5', name: '\u0633\u0627\u06CC\u0631 \u0645\u0648\u0627\u0631\u062F', category: 'other', description: '\u062F\u0644\u0627\u06CC\u0644 \u062F\u06CC\u06AF\u0631 \u062A\u0623\u062E\u06CC\u0631 \u0639\u0645\u0644\u06CC\u0627\u062A', color: '#FF33FF', isActive: true, createdAt: '1403/01/01' }
];

export const initialPlans: Plan[] = [
  // پروژه میشدوان - حفاری
  { id: '1', projectId: '1', operationId: '1', type: 'daily', title: 'حفاری روزانه - سکتور A', description: 'حفاری عمودی با عمق 50 متر', startDate: '1403/08/15', endDate: '1403/08/15', targetAmount: 50, unit: 'meter', priority: 'high', assignedEquipment: ['1'], assignedOperators: ['3', '4'], status: 'completed', createdBy: '2', createdAt: '1403/08/10' },
  { id: '2', projectId: '1', operationId: '1', type: 'daily', title: 'حفاری روزانه - سکتور B', description: 'حفاری افقی با عمق 45 متر', startDate: '1403/08/20', endDate: '1403/08/20', targetAmount: 45, unit: 'meter', priority: 'high', assignedEquipment: ['1'], assignedOperators: ['3'], status: 'completed', createdBy: '2', createdAt: '1403/08/15' },
  { id: '3', projectId: '1', operationId: '1', type: 'weekly', title: 'حفاری هفتگی - هفته اول مهر', description: 'برنامه حفاری هفته اول', startDate: '1403/07/01', endDate: '1403/07/07', targetAmount: 300, unit: 'meter', priority: 'high', assignedEquipment: ['1'], assignedOperators: ['3', '4'], status: 'completed', createdBy: '2', createdAt: '1403/06/25' },
  { id: '4', projectId: '1', operationId: '1', type: 'monthly', title: 'حفاری ماهانه - مهر', description: 'کل حفاری ماه مهر', startDate: '1403/07/01', endDate: '1403/07/30', targetAmount: 1200, unit: 'meter', priority: 'high', assignedEquipment: ['1'], assignedOperators: ['3', '4'], status: 'completed', createdBy: '2', createdAt: '1403/06/25' },
  // پروژه ناریگان - حمل مواد
  { id: '5', projectId: '2', operationId: '3', type: 'daily', title: 'حمل روزانه - مسیر اصلی', description: 'حمل مواد به انبار مرکزی', startDate: '1403/08/15', endDate: '1403/08/15', targetAmount: 150, unit: 'ton', priority: 'medium', assignedEquipment: ['3'], assignedOperators: ['5', '6'], status: 'completed', createdBy: '2', createdAt: '1403/08/10' },
  { id: '6', projectId: '2', operationId: '3', type: 'weekly', title: 'حمل هفتگی - هفته اول مهر', description: 'برنامه حمل هفته اول', startDate: '1403/07/01', endDate: '1403/07/07', targetAmount: 1000, unit: 'ton', priority: 'medium', assignedEquipment: ['3'], assignedOperators: ['5', '6'], status: 'completed', createdBy: '2', createdAt: '1403/06/25' },
  { id: '7', projectId: '2', operationId: '3', type: 'monthly', title: 'حمل ماهانه - مهر', description: 'کل حمل ماه مهر', startDate: '1403/07/01', endDate: '1403/07/30', targetAmount: 4200, unit: 'ton', priority: 'high', assignedEquipment: ['3'], assignedOperators: ['5', '6'], status: 'completed', createdBy: '2', createdAt: '1403/06/25' },
  { id: '8', projectId: '2', operationId: '4', type: 'daily', title: 'بارگیری روزانه', description: 'بارگیری مواد استخراج شده', startDate: '1403/08/16', endDate: '1403/08/16', targetAmount: 200, unit: 'ton', priority: 'high', assignedEquipment: ['2'], assignedOperators: ['5'], status: 'completed', createdBy: '2', createdAt: '1403/08/10' },
  // پروژه تنهک - فراوری
  { id: '9', projectId: '3', operationId: '5', type: 'daily', title: 'فراوری روزانه', description: 'فراوری مواد خام', startDate: '1403/08/15', endDate: '1403/08/15', targetAmount: 100, unit: 'ton', priority: 'high', assignedEquipment: ['4'], assignedOperators: ['3', '4', '5'], status: 'completed', createdBy: '1', createdAt: '1403/08/10' },
  { id: '10', projectId: '3', operationId: '5', type: 'weekly', title: 'فراوری هفتگی - هفته اول مهر', description: 'برنامه فراوری هفته اول', startDate: '1403/07/01', endDate: '1403/07/07', targetAmount: 700, unit: 'ton', priority: 'high', assignedEquipment: ['4'], assignedOperators: ['3', '4', '5'], status: 'completed', createdBy: '1', createdAt: '1403/06/25' },
  { id: '11', projectId: '3', operationId: '5', type: 'monthly', title: 'فراوری ماهانه - مهر', description: 'کل فراوری ماه مهر', startDate: '1403/07/01', endDate: '1403/07/30', targetAmount: 2800, unit: 'ton', priority: 'high', assignedEquipment: ['4'], assignedOperators: ['3', '4', '5'], status: 'completed', createdBy: '1', createdAt: '1403/06/25' },
  { id: '12', projectId: '3', operationId: '6', type: 'daily', title: 'پیش فراوری روزانه', description: 'آماده\u200Cسازی مواد برای فراوری', startDate: '1403/08/14', endDate: '1403/08/14', targetAmount: 120, unit: 'ton', priority: 'medium', assignedEquipment: ['2'], assignedOperators: ['4'], status: 'completed', createdBy: '1', createdAt: '1403/08/10' },
  // پروژه گلیران - حفاری
  { id: '13', projectId: '4', operationId: '7', type: 'daily', title: 'حفاری اکتشافی روزانه', description: 'حفاری در نقاط اکتشافی', startDate: '1403/08/15', endDate: '1403/08/15', targetAmount: 30, unit: 'meter', priority: 'high', assignedEquipment: ['1'], assignedOperators: ['3'], status: 'completed', createdBy: '2', createdAt: '1403/08/10' },
  { id: '14', projectId: '4', operationId: '7', type: 'weekly', title: 'حفاری هفتگی - هفته اول مهر', description: 'برنامه حفاری هفته اول', startDate: '1403/07/01', endDate: '1403/07/07', targetAmount: 200, unit: 'meter', priority: 'high', assignedEquipment: ['1'], assignedOperators: ['3'], status: 'completed', createdBy: '2', createdAt: '1403/06/25' },
  { id: '15', projectId: '4', operationId: '7', type: 'monthly', title: 'حفاری ماهانه - مهر', description: 'کل حفاری ماه مهر', startDate: '1403/07/01', endDate: '1403/07/30', targetAmount: 850, unit: 'meter', priority: 'high', assignedEquipment: ['1'], assignedOperators: ['3'], status: 'completed', createdBy: '2', createdAt: '1403/06/25' },
  // 7 روز اخیر - پروژه میشدوان
  { id: 'p_7d_1', projectId: '1', operationId: '1', type: 'daily', title: 'حفاری روزانه - 1403/08/22', description: 'حفاری سکتور C', startDate: '2024-11-12', endDate: '2024-11-12', targetAmount: 48, unit: 'meter', priority: 'high', assignedEquipment: ['1'], assignedOperators: ['3', '4'], status: 'completed', createdBy: '2', createdAt: '1403/08/22' },
  { id: 'p_7d_2', projectId: '1', operationId: '1', type: 'daily', title: 'حفاری روزانه - 1403/08/23', description: 'حفاری سکتور D', startDate: '2024-11-13', endDate: '2024-11-13', targetAmount: 50, unit: 'meter', priority: 'high', assignedEquipment: ['1'], assignedOperators: ['3', '4'], status: 'completed', createdBy: '2', createdAt: '1403/08/23' },
  { id: 'p_7d_3', projectId: '1', operationId: '1', type: 'daily', title: 'حفاری روزانه - 1403/08/24', description: 'حفاری سکتور E', startDate: '2024-11-14', endDate: '2024-11-14', targetAmount: 52, unit: 'meter', priority: 'high', assignedEquipment: ['1'], assignedOperators: ['3', '4'], status: 'completed', createdBy: '2', createdAt: '1403/08/24' },
  { id: 'p_7d_4', projectId: '1', operationId: '1', type: 'daily', title: 'حفاری روزانه - 1403/08/25', description: 'حفاری سکتور F', startDate: '2024-11-15', endDate: '2024-11-15', targetAmount: 50, unit: 'meter', priority: 'high', assignedEquipment: ['1'], assignedOperators: ['3', '4'], status: 'completed', createdBy: '2', createdAt: '1403/08/25' },
  { id: 'p_7d_5', projectId: '1', operationId: '1', type: 'daily', title: 'حفاری روزانه - 1403/08/26', description: 'حفاری سکتور G', startDate: '2024-11-16', endDate: '2024-11-16', targetAmount: 48, unit: 'meter', priority: 'high', assignedEquipment: ['1'], assignedOperators: ['3', '4'], status: 'completed', createdBy: '2', createdAt: '1403/08/26' },
  { id: 'p_7d_6', projectId: '1', operationId: '1', type: 'daily', title: 'حفاری روزانه - 1403/08/27', description: 'حفاری سکتور H', startDate: '2024-11-17', endDate: '2024-11-17', targetAmount: 50, unit: 'meter', priority: 'high', assignedEquipment: ['1'], assignedOperators: ['3', '4'], status: 'completed', createdBy: '2', createdAt: '1403/08/27' },
  { id: 'p_7d_7', projectId: '1', operationId: '1', type: 'daily', title: 'حفاری روزانه - 1403/08/28', description: 'حفاری سکتور I', startDate: '2024-11-18', endDate: '2024-11-18', targetAmount: 55, unit: 'meter', priority: 'high', assignedEquipment: ['1'], assignedOperators: ['3', '4'], status: 'active', createdBy: '2', createdAt: '1403/08/28' },
  // 7 روز اخیر - پروژه ناریگان
  { id: 'p_7d_8', projectId: '2', operationId: '3', type: 'daily', title: 'حمل مواد - 1403/08/22', description: 'حمل به انبار مرکزی', startDate: '2024-11-12', endDate: '2024-11-12', targetAmount: 160, unit: 'ton', priority: 'medium', assignedEquipment: ['3'], assignedOperators: ['5', '6'], status: 'completed', createdBy: '2', createdAt: '1403/08/22' },
  { id: 'p_7d_9', projectId: '2', operationId: '3', type: 'daily', title: 'حمل مواد - 1403/08/23', description: 'حمل به انبار مرکزی', startDate: '2024-11-13', endDate: '2024-11-13', targetAmount: 155, unit: 'ton', priority: 'medium', assignedEquipment: ['3'], assignedOperators: ['5', '6'], status: 'completed', createdBy: '2', createdAt: '1403/08/23' },
  { id: 'p_7d_10', projectId: '2', operationId: '3', type: 'daily', title: 'حمل مواد - 1403/08/24', description: 'حمل به انبار مرکزی', startDate: '2024-11-14', endDate: '2024-11-14', targetAmount: 150, unit: 'ton', priority: 'medium', assignedEquipment: ['3'], assignedOperators: ['5', '6'], status: 'completed', createdBy: '2', createdAt: '1403/08/24' },
  { id: 'p_7d_11', projectId: '2', operationId: '3', type: 'daily', title: 'حمل مواد - 1403/08/25', description: 'حمل به انبار مرکزی', startDate: '2024-11-15', endDate: '2024-11-15', targetAmount: 165, unit: 'ton', priority: 'medium', assignedEquipment: ['3'], assignedOperators: ['5', '6'], status: 'completed', createdBy: '2', createdAt: '1403/08/25' },
  { id: 'p_7d_12', projectId: '2', operationId: '3', type: 'daily', title: 'حمل مواد - 1403/08/26', description: 'حمل به انبار مرکزی', startDate: '2024-11-16', endDate: '2024-11-16', targetAmount: 160, unit: 'ton', priority: 'medium', assignedEquipment: ['3'], assignedOperators: ['5', '6'], status: 'completed', createdBy: '2', createdAt: '1403/08/26' },
  { id: 'p_7d_13', projectId: '2', operationId: '3', type: 'daily', title: 'حمل مواد - 1403/08/27', description: 'حمل به انبار مرکزی', startDate: '2024-11-17', endDate: '2024-11-17', targetAmount: 158, unit: 'ton', priority: 'medium', assignedEquipment: ['3'], assignedOperators: ['5', '6'], status: 'completed', createdBy: '2', createdAt: '1403/08/27' },
  { id: 'p_7d_14', projectId: '2', operationId: '3', type: 'daily', title: 'حمل مواد - 1403/08/28', description: 'حمل به انبار مرکزی', startDate: '2024-11-18', endDate: '2024-11-18', targetAmount: 170, unit: 'ton', priority: 'medium', assignedEquipment: ['3'], assignedOperators: ['5', '6'], status: 'active', createdBy: '2', createdAt: '1403/08/28' },
  // 7 روز اخیر - پروژه تنهک
  { id: 'p_7d_15', projectId: '3', operationId: '5', type: 'daily', title: 'فراوری - 1403/08/22', description: 'فراوری مواد خام', startDate: '2024-11-12', endDate: '2024-11-12', targetAmount: 95, unit: 'ton', priority: 'high', assignedEquipment: ['4'], assignedOperators: ['3', '4', '5'], status: 'completed', createdBy: '1', createdAt: '1403/08/22' },
  { id: 'p_7d_16', projectId: '3', operationId: '5', type: 'daily', title: 'فراوری - 1403/08/23', description: 'فراوری مواد خام', startDate: '2024-11-13', endDate: '2024-11-13', targetAmount: 100, unit: 'ton', priority: 'high', assignedEquipment: ['4'], assignedOperators: ['3', '4', '5'], status: 'completed', createdBy: '1', createdAt: '1403/08/23' },
  { id: 'p_7d_17', projectId: '3', operationId: '5', type: 'daily', title: 'فراوری - 1403/08/24', description: 'فراوری مواد خام', startDate: '2024-11-14', endDate: '2024-11-14', targetAmount: 98, unit: 'ton', priority: 'high', assignedEquipment: ['4'], assignedOperators: ['3', '4', '5'], status: 'completed', createdBy: '1', createdAt: '1403/08/24' },
  { id: 'p_7d_18', projectId: '3', operationId: '5', type: 'daily', title: 'فراوری - 1403/08/25', description: 'فراوری مواد خام', startDate: '2024-11-15', endDate: '2024-11-15', targetAmount: 105, unit: 'ton', priority: 'high', assignedEquipment: ['4'], assignedOperators: ['3', '4', '5'], status: 'completed', createdBy: '1', createdAt: '1403/08/25' },
  { id: 'p_7d_19', projectId: '3', operationId: '5', type: 'daily', title: 'فراوری - 1403/08/26', description: 'فراوری مواد خام', startDate: '2024-11-16', endDate: '2024-11-16', targetAmount: 100, unit: 'ton', priority: 'high', assignedEquipment: ['4'], assignedOperators: ['3', '4', '5'], status: 'completed', createdBy: '1', createdAt: '1403/08/26' },
  { id: 'p_7d_20', projectId: '3', operationId: '5', type: 'daily', title: 'فراوری - 1403/08/27', description: 'فراوری مواد خام', startDate: '2024-11-17', endDate: '2024-11-17', targetAmount: 102, unit: 'ton', priority: 'high', assignedEquipment: ['4'], assignedOperators: ['3', '4', '5'], status: 'completed', createdBy: '1', createdAt: '1403/08/27' },
  { id: 'p_7d_21', projectId: '3', operationId: '5', type: 'daily', title: 'فراوری - 1403/08/28', description: 'فراوری مواد خام', startDate: '2024-11-18', endDate: '2024-11-18', targetAmount: 110, unit: 'ton', priority: 'high', assignedEquipment: ['4'], assignedOperators: ['3', '4', '5'], status: 'active', createdBy: '1', createdAt: '1403/08/28' },
  // 7 روز اخیر - پروژه گلیران
  { id: 'p_7d_22', projectId: '4', operationId: '7', type: 'daily', title: 'حفاری - 1403/08/22', description: 'حفاری اکتشافی', startDate: '2024-11-12', endDate: '2024-11-12', targetAmount: 42, unit: 'meter', priority: 'high', assignedEquipment: ['1'], assignedOperators: ['3'], status: 'completed', createdBy: '2', createdAt: '1403/08/22' },
  { id: 'p_7d_23', projectId: '4', operationId: '7', type: 'daily', title: 'حفاری - 1403/08/23', description: 'حفاری اکتشافی', startDate: '2024-11-13', endDate: '2024-11-13', targetAmount: 40, unit: 'meter', priority: 'high', assignedEquipment: ['1'], assignedOperators: ['3'], status: 'completed', createdBy: '2', createdAt: '1403/08/23' },
  { id: 'p_7d_24', projectId: '4', operationId: '7', type: 'daily', title: 'حفاری - 1403/08/24', description: 'حفاری اکتشافی', startDate: '2024-11-14', endDate: '2024-11-14', targetAmount: 45, unit: 'meter', priority: 'high', assignedEquipment: ['1'], assignedOperators: ['3'], status: 'completed', createdBy: '2', createdAt: '1403/08/24' },
  { id: 'p_7d_25', projectId: '4', operationId: '7', type: 'daily', title: 'حفاری - 1403/08/25', description: 'حفاری اکتشافی', startDate: '2024-11-15', endDate: '2024-11-15', targetAmount: 43, unit: 'meter', priority: 'high', assignedEquipment: ['1'], assignedOperators: ['3'], status: 'completed', createdBy: '2', createdAt: '1403/08/25' },
  { id: 'p_7d_26', projectId: '4', operationId: '7', type: 'daily', title: 'حفاری - 1403/08/26', description: 'حفاری اکتشافی', startDate: '2024-11-16', endDate: '2024-11-16', targetAmount: 40, unit: 'meter', priority: 'high', assignedEquipment: ['1'], assignedOperators: ['3'], status: 'completed', createdBy: '2', createdAt: '1403/08/26' },
  { id: 'p_7d_27', projectId: '4', operationId: '7', type: 'daily', title: 'حفاری - 1403/08/27', description: 'حفاری اکتشافی', startDate: '2024-11-17', endDate: '2024-11-17', targetAmount: 44, unit: 'meter', priority: 'high', assignedEquipment: ['1'], assignedOperators: ['3'], status: 'completed', createdBy: '2', createdAt: '1403/08/27' },
  { id: 'p_7d_28', projectId: '4', operationId: '7', type: 'daily', title: 'حفاری - 1403/08/28', description: 'حفاری اکتشافی', startDate: '2024-11-18', endDate: '2024-11-18', targetAmount: 46, unit: 'meter', priority: 'high', assignedEquipment: ['1'], assignedOperators: ['3'], status: 'active', createdBy: '2', createdAt: '1403/08/28' }
];

export const initialAchievements: Achievement[] = [
  // پروژه میشدوان - حفاری
  { id: '1', planId: '1', projectId: '1', operationId: '1', date: '1403/08/15', plannedAmount: 50, achievedAmount: 45, unit: 'meter', efficiency: 90, status: 'partial', delayReasons: ['1'], delayDescription: 'خرابی پمپ هیدرولیک دستگاه حفاری', operatorHours: [{ operatorId: '3', hours: 8 }, { operatorId: '4', hours: 6 }], equipmentHours: [{ equipmentId: '1', hours: 7 }], notes: 'با وجود خرابی تجهیز، کار تا حد مطلوبی پیش رفت', reportedBy: '2', reportedAt: '1403/08/15' },
  { id: '2', planId: '2', projectId: '1', operationId: '1', date: '1403/08/20', plannedAmount: 45, achievedAmount: 47, unit: 'meter', efficiency: 104, status: 'completed', operatorHours: [{ operatorId: '3', hours: 8 }], equipmentHours: [{ equipmentId: '1', hours: 8 }], notes: 'عملکرد بهتر از برنامه', reportedBy: '2', reportedAt: '1403/08/20' },
  { id: '3', planId: '3', projectId: '1', operationId: '1', date: '1403/07/07', plannedAmount: 300, achievedAmount: 285, unit: 'meter', efficiency: 95, status: 'partial', delayReasons: ['2'], delayDescription: 'بارش شدید در روزهای پایانی', operatorHours: [{ operatorId: '3', hours: 40 }, { operatorId: '4', hours: 35 }], equipmentHours: [{ equipmentId: '1', hours: 42 }], notes: 'با وجود شرایط نامساعد، عملکرد خوبی داشتیم', reportedBy: '2', reportedAt: '1403/07/07' },
  { id: '4', planId: '4', projectId: '1', operationId: '1', date: '1403/07/30', plannedAmount: 1200, achievedAmount: 1150, unit: 'meter', efficiency: 96, status: 'partial', delayReasons: ['4'], delayDescription: 'نگهداری دوره\u200Cای تجهیزات', operatorHours: [{ operatorId: '3', hours: 160 }, { operatorId: '4', hours: 155 }], equipmentHours: [{ equipmentId: '1', hours: 165 }], notes: 'ماه پرکار و موفق', reportedBy: '2', reportedAt: '1403/07/30' },
  // پروژه ناریگان - حمل مواد
  { id: '5', planId: '5', projectId: '2', operationId: '3', date: '1403/08/15', plannedAmount: 150, achievedAmount: 165, unit: 'ton', efficiency: 110, status: 'completed', operatorHours: [{ operatorId: '5', hours: 8 }, { operatorId: '6', hours: 8 }], equipmentHours: [{ equipmentId: '3', hours: 8 }], notes: 'عملکرد بهتر از انتظار', reportedBy: '2', reportedAt: '1403/08/15' },
  { id: '6', planId: '6', projectId: '2', operationId: '3', date: '1403/07/07', plannedAmount: 1000, achievedAmount: 1080, unit: 'ton', efficiency: 108, status: 'completed', operatorHours: [{ operatorId: '5', hours: 42 }, { operatorId: '6', hours: 42 }], equipmentHours: [{ equipmentId: '3', hours: 45 }], notes: 'هفته موفق با راندمان بالا', reportedBy: '2', reportedAt: '1403/07/07' },
  { id: '7', planId: '7', projectId: '2', operationId: '3', date: '1403/07/30', plannedAmount: 4200, achievedAmount: 4450, unit: 'ton', efficiency: 106, status: 'completed', operatorHours: [{ operatorId: '5', hours: 170 }, { operatorId: '6', hours: 168 }], equipmentHours: [{ equipmentId: '3', hours: 175 }], notes: 'ماه بسیار موفق، پیشرفت بیشتر از برنامه', reportedBy: '2', reportedAt: '1403/07/30' },
  { id: '8', planId: '8', projectId: '2', operationId: '4', date: '1403/08/16', plannedAmount: 200, achievedAmount: 195, unit: 'ton', efficiency: 98, status: 'partial', delayReasons: ['1'], delayDescription: 'کمی تاخیر در بارگیری به دلیل خرابی جرثقیل', operatorHours: [{ operatorId: '5', hours: 8 }], equipmentHours: [{ equipmentId: '2', hours: 7.5 }], notes: 'در مجموع عملکرد خوب', reportedBy: '2', reportedAt: '1403/08/16' },
  // پروژه تنهک - فراوری
  { id: '9', planId: '9', projectId: '3', operationId: '5', date: '1403/08/15', plannedAmount: 100, achievedAmount: 92, unit: 'ton', efficiency: 92, status: 'partial', delayReasons: ['3'], delayDescription: 'کمبود مواد اولیه در ساعات پایانی', operatorHours: [{ operatorId: '3', hours: 8 }, { operatorId: '4', hours: 8 }, { operatorId: '5', hours: 7 }], equipmentHours: [{ equipmentId: '4', hours: 7.5 }], notes: 'نیاز به هماهنگی بهتر با بخش تامین', reportedBy: '1', reportedAt: '1403/08/15' },
  { id: '10', planId: '10', projectId: '3', operationId: '5', date: '1403/07/07', plannedAmount: 700, achievedAmount: 665, unit: 'ton', efficiency: 95, status: 'partial', delayReasons: ['4'], delayDescription: 'تعمیرات برنامه\u200Cریزی شده خط فراوری', operatorHours: [{ operatorId: '3', hours: 40 }, { operatorId: '4', hours: 40 }, { operatorId: '5', hours: 38 }], equipmentHours: [{ equipmentId: '4', hours: 42 }], notes: 'تعمیرات لازم انجام شد', reportedBy: '1', reportedAt: '1403/07/07' },
  { id: '11', planId: '11', projectId: '3', operationId: '5', date: '1403/07/30', plannedAmount: 2800, achievedAmount: 2660, unit: 'ton', efficiency: 95, status: 'partial', delayReasons: ['4'], delayDescription: 'تعمیرات دوره\u200Cای و نگهداری تجهیزات', operatorHours: [{ operatorId: '3', hours: 160 }, { operatorId: '4', hours: 158 }, { operatorId: '5', hours: 155 }], equipmentHours: [{ equipmentId: '4', hours: 168 }], notes: 'عملکرد قابل قبول', reportedBy: '1', reportedAt: '1403/07/30' },
  { id: '12', planId: '12', projectId: '3', operationId: '6', date: '1403/08/14', plannedAmount: 120, achievedAmount: 118, unit: 'ton', efficiency: 98, status: 'partial', operatorHours: [{ operatorId: '4', hours: 8 }], equipmentHours: [{ equipmentId: '2', hours: 8 }], notes: 'عملکرد مطلوب', reportedBy: '1', reportedAt: '1403/08/14' },
  // پروژه گلیران - حفاری
  { id: '13', planId: '13', projectId: '4', operationId: '7', date: '1403/08/15', plannedAmount: 30, achievedAmount: 28, unit: 'meter', efficiency: 93, status: 'partial', delayReasons: ['2'], delayDescription: 'شرایط آب و هوایی نامساعد', operatorHours: [{ operatorId: '3', hours: 7 }], equipmentHours: [{ equipmentId: '1', hours: 7 }], notes: 'پروژه اکتشافی در مرحله آغازین', reportedBy: '2', reportedAt: '1403/08/15' },
  { id: '14', planId: '14', projectId: '4', operationId: '7', date: '1403/07/07', plannedAmount: 200, achievedAmount: 192, unit: 'meter', efficiency: 96, status: 'partial', delayReasons: ['1'], delayDescription: 'خرابی جزئی دستگاه حفاری', operatorHours: [{ operatorId: '3', hours: 40 }], equipmentHours: [{ equipmentId: '1', hours: 38 }], notes: 'عملکرد خوب در هفته اول', reportedBy: '2', reportedAt: '1403/07/07' },
  { id: '15', planId: '15', projectId: '4', operationId: '7', date: '1403/07/30', plannedAmount: 850, achievedAmount: 816, unit: 'meter', efficiency: 96, status: 'partial', delayReasons: ['2', '4'], delayDescription: 'شرایط آب و هوایی و تعمیرات دوره\u200Cای', operatorHours: [{ operatorId: '3', hours: 160 }], equipmentHours: [{ equipmentId: '1', hours: 155 }], notes: 'با توجه به شرایط، عملکرد مطلوب بود', reportedBy: '2', reportedAt: '1403/07/30' },
  // 7 روز اخیر - میشدوان
  { id: 'a_7d_1', planId: 'p_7d_1', projectId: '1', operationId: '1', date: '1403/08/22', plannedAmount: 48, achievedAmount: 46, unit: 'meter', efficiency: 96, status: 'partial', operatorHours: [{ operatorId: '3', hours: 8 }, { operatorId: '4', hours: 8 }], equipmentHours: [{ equipmentId: '1', hours: 8 }], notes: 'عملکرد خوب', reportedBy: '2', reportedAt: '2024-11-12' },
  { id: 'a_7d_2', planId: 'p_7d_2', projectId: '1', operationId: '1', date: '1403/08/23', plannedAmount: 50, achievedAmount: 48, unit: 'meter', efficiency: 96, status: 'partial', delayReasons: ['1'], delayDescription: 'کمبود قطعات یدکی', operatorHours: [{ operatorId: '3', hours: 8 }, { operatorId: '4', hours: 7 }], equipmentHours: [{ equipmentId: '1', hours: 7 }], notes: 'تاخیر جزئی', reportedBy: '2', reportedAt: '2024-11-13' },
  { id: 'a_7d_3', planId: 'p_7d_3', projectId: '1', operationId: '1', date: '1403/08/24', plannedAmount: 52, achievedAmount: 54, unit: 'meter', efficiency: 104, status: 'completed', operatorHours: [{ operatorId: '3', hours: 8 }, { operatorId: '4', hours: 8 }], equipmentHours: [{ equipmentId: '1', hours: 8 }], notes: 'عملکرد عالی', reportedBy: '2', reportedAt: '2024-11-14' },
  { id: 'a_7d_4', planId: 'p_7d_4', projectId: '1', operationId: '1', date: '1403/08/25', plannedAmount: 50, achievedAmount: 45, unit: 'meter', efficiency: 90, status: 'partial', delayReasons: ['2'], delayDescription: 'بارش باران', operatorHours: [{ operatorId: '3', hours: 7 }, { operatorId: '4', hours: 7 }], equipmentHours: [{ equipmentId: '1', hours: 7 }], notes: 'مشکل آب و هوا', reportedBy: '2', reportedAt: '2024-11-15' },
  { id: 'a_7d_5', planId: 'p_7d_5', projectId: '1', operationId: '1', date: '1403/08/26', plannedAmount: 48, achievedAmount: 50, unit: 'meter', efficiency: 104, status: 'completed', operatorHours: [{ operatorId: '3', hours: 8 }, { operatorId: '4', hours: 8 }], equipmentHours: [{ equipmentId: '1', hours: 8 }], notes: 'عملکرد بهتر از برنامه', reportedBy: '2', reportedAt: '2024-11-16' },
  { id: 'a_7d_6', planId: 'p_7d_6', projectId: '1', operationId: '1', date: '1403/08/27', plannedAmount: 50, achievedAmount: 52, unit: 'meter', efficiency: 104, status: 'completed', operatorHours: [{ operatorId: '3', hours: 8 }, { operatorId: '4', hours: 8 }], equipmentHours: [{ equipmentId: '1', hours: 8 }], notes: 'روند مثبت ادامه دارد', reportedBy: '2', reportedAt: '2024-11-17' },
  { id: 'a_7d_7', planId: 'p_7d_7', projectId: '1', operationId: '1', date: '1403/08/28', plannedAmount: 55, achievedAmount: 53, unit: 'meter', efficiency: 96, status: 'partial', operatorHours: [{ operatorId: '3', hours: 8 }, { operatorId: '4', hours: 8 }], equipmentHours: [{ equipmentId: '1', hours: 8 }], notes: 'در حال انجام', reportedBy: '2', reportedAt: '2024-11-18' },
  // 7 روز اخیر - ناریگان
  { id: 'a_7d_8', planId: 'p_7d_8', projectId: '2', operationId: '3', date: '1403/08/22', plannedAmount: 160, achievedAmount: 168, unit: 'ton', efficiency: 105, status: 'completed', operatorHours: [{ operatorId: '5', hours: 8 }, { operatorId: '6', hours: 8 }], equipmentHours: [{ equipmentId: '3', hours: 8 }], notes: 'عملکرد عالی', reportedBy: '2', reportedAt: '2024-11-12' },
  { id: 'a_7d_9', planId: 'p_7d_9', projectId: '2', operationId: '3', date: '1403/08/23', plannedAmount: 155, achievedAmount: 158, unit: 'ton', efficiency: 102, status: 'completed', operatorHours: [{ operatorId: '5', hours: 8 }, { operatorId: '6', hours: 8 }], equipmentHours: [{ equipmentId: '3', hours: 8 }], notes: 'بهتر از برنامه', reportedBy: '2', reportedAt: '2024-11-13' },
  { id: 'a_7d_10', planId: 'p_7d_10', projectId: '2', operationId: '3', date: '1403/08/24', plannedAmount: 150, achievedAmount: 145, unit: 'ton', efficiency: 97, status: 'partial', delayReasons: ['1'], delayDescription: 'مشکل فنی کامیون', operatorHours: [{ operatorId: '5', hours: 7 }, { operatorId: '6', hours: 7 }], equipmentHours: [{ equipmentId: '3', hours: 7 }], notes: 'تعمیر سریع انجام شد', reportedBy: '2', reportedAt: '2024-11-14' },
  { id: 'a_7d_11', planId: 'p_7d_11', projectId: '2', operationId: '3', date: '1403/08/25', plannedAmount: 165, achievedAmount: 172, unit: 'ton', efficiency: 104, status: 'completed', operatorHours: [{ operatorId: '5', hours: 8 }, { operatorId: '6', hours: 8 }], equipmentHours: [{ equipmentId: '3', hours: 8 }], notes: 'روند خوب', reportedBy: '2', reportedAt: '2024-11-15' },
  { id: 'a_7d_12', planId: 'p_7d_12', projectId: '2', operationId: '3', date: '1403/08/26', plannedAmount: 160, achievedAmount: 165, unit: 'ton', efficiency: 103, status: 'completed', operatorHours: [{ operatorId: '5', hours: 8 }, { operatorId: '6', hours: 8 }], equipmentHours: [{ equipmentId: '3', hours: 8 }], notes: 'عملکرد مطلوب', reportedBy: '2', reportedAt: '2024-11-16' },
  { id: 'a_7d_13', planId: 'p_7d_13', projectId: '2', operationId: '3', date: '1403/08/27', plannedAmount: 158, achievedAmount: 162, unit: 'ton', efficiency: 103, status: 'completed', operatorHours: [{ operatorId: '5', hours: 8 }, { operatorId: '6', hours: 8 }], equipmentHours: [{ equipmentId: '3', hours: 8 }], notes: 'ادامه روند خوب', reportedBy: '2', reportedAt: '2024-11-17' },
  { id: 'a_7d_14', planId: 'p_7d_14', projectId: '2', operationId: '3', date: '1403/08/28', plannedAmount: 170, achievedAmount: 175, unit: 'ton', efficiency: 103, status: 'completed', operatorHours: [{ operatorId: '5', hours: 8 }, { operatorId: '6', hours: 8 }], equipmentHours: [{ equipmentId: '3', hours: 8 }], notes: 'در حال انجام', reportedBy: '2', reportedAt: '2024-11-18' },
  // 7 روز اخیر - تنهک
  { id: 'a_7d_15', planId: 'p_7d_15', projectId: '3', operationId: '5', date: '1403/08/22', plannedAmount: 95, achievedAmount: 92, unit: 'ton', efficiency: 97, status: 'partial', operatorHours: [{ operatorId: '3', hours: 8 }, { operatorId: '4', hours: 8 }, { operatorId: '5', hours: 8 }], equipmentHours: [{ equipmentId: '4', hours: 8 }], notes: 'تقریباً مطابق برنامه', reportedBy: '1', reportedAt: '2024-11-12' },
  { id: 'a_7d_16', planId: 'p_7d_16', projectId: '3', operationId: '5', date: '1403/08/23', plannedAmount: 100, achievedAmount: 98, unit: 'ton', efficiency: 98, status: 'partial', operatorHours: [{ operatorId: '3', hours: 8 }, { operatorId: '4', hours: 8 }, { operatorId: '5', hours: 8 }], equipmentHours: [{ equipmentId: '4', hours: 8 }], notes: 'عملکرد خوب', reportedBy: '1', reportedAt: '2024-11-13' },
  { id: 'a_7d_17', planId: 'p_7d_17', projectId: '3', operationId: '5', date: '1403/08/24', plannedAmount: 98, achievedAmount: 95, unit: 'ton', efficiency: 97, status: 'partial', delayReasons: ['3'], delayDescription: 'کمبود مواد اولیه', operatorHours: [{ operatorId: '3', hours: 7 }, { operatorId: '4', hours: 7 }, { operatorId: '5', hours: 7 }], equipmentHours: [{ equipmentId: '4', hours: 7 }], notes: 'کمبود موقت مواد', reportedBy: '1', reportedAt: '2024-11-14' },
  { id: 'a_7d_18', planId: 'p_7d_18', projectId: '3', operationId: '5', date: '1403/08/25', plannedAmount: 105, achievedAmount: 108, unit: 'ton', efficiency: 103, status: 'completed', operatorHours: [{ operatorId: '3', hours: 8 }, { operatorId: '4', hours: 8 }, { operatorId: '5', hours: 8 }], equipmentHours: [{ equipmentId: '4', hours: 8 }], notes: 'بهبود عملکرد', reportedBy: '1', reportedAt: '2024-11-15' },
  { id: 'a_7d_19', planId: 'p_7d_19', projectId: '3', operationId: '5', date: '1403/08/26', plannedAmount: 100, achievedAmount: 102, unit: 'ton', efficiency: 102, status: 'completed', operatorHours: [{ operatorId: '3', hours: 8 }, { operatorId: '4', hours: 8 }, { operatorId: '5', hours: 8 }], equipmentHours: [{ equipmentId: '4', hours: 8 }], notes: 'عملکرد مطلوب', reportedBy: '1', reportedAt: '2024-11-16' },
  { id: 'a_7d_20', planId: 'p_7d_20', projectId: '3', operationId: '5', date: '1403/08/27', plannedAmount: 102, achievedAmount: 100, unit: 'ton', efficiency: 98, status: 'partial', operatorHours: [{ operatorId: '3', hours: 8 }, { operatorId: '4', hours: 8 }, { operatorId: '5', hours: 8 }], equipmentHours: [{ equipmentId: '4', hours: 8 }], notes: 'نزدیک به برنامه', reportedBy: '1', reportedAt: '2024-11-17' },
  { id: 'a_7d_21', planId: 'p_7d_21', projectId: '3', operationId: '5', date: '1403/08/28', plannedAmount: 110, achievedAmount: 112, unit: 'ton', efficiency: 102, status: 'completed', operatorHours: [{ operatorId: '3', hours: 8 }, { operatorId: '4', hours: 8 }, { operatorId: '5', hours: 8 }], equipmentHours: [{ equipmentId: '4', hours: 8 }], notes: 'در حال انجام', reportedBy: '1', reportedAt: '2024-11-18' },
  // 7 روز اخیر - گلیران
  { id: 'a_7d_22', planId: 'p_7d_22', projectId: '4', operationId: '7', date: '1403/08/22', plannedAmount: 42, achievedAmount: 40, unit: 'meter', efficiency: 95, status: 'partial', operatorHours: [{ operatorId: '3', hours: 8 }], equipmentHours: [{ equipmentId: '1', hours: 8 }], notes: 'عملکرد قابل قبول', reportedBy: '2', reportedAt: '2024-11-12' },
  { id: 'a_7d_23', planId: 'p_7d_23', projectId: '4', operationId: '7', date: '1403/08/23', plannedAmount: 40, achievedAmount: 38, unit: 'meter', efficiency: 95, status: 'partial', delayReasons: ['2'], delayDescription: 'باران خفیف', operatorHours: [{ operatorId: '3', hours: 7 }], equipmentHours: [{ equipmentId: '1', hours: 7 }], notes: 'تأخیر جزئی', reportedBy: '2', reportedAt: '2024-11-13' },
  { id: 'a_7d_24', planId: 'p_7d_24', projectId: '4', operationId: '7', date: '1403/08/24', plannedAmount: 45, achievedAmount: 45, unit: 'meter', efficiency: 100, status: 'completed', operatorHours: [{ operatorId: '3', hours: 8 }], equipmentHours: [{ equipmentId: '1', hours: 8 }], notes: 'دقیقاً مطابق برنامه', reportedBy: '2', reportedAt: '2024-11-14' },
  { id: 'a_7d_25', planId: 'p_7d_25', projectId: '4', operationId: '7', date: '1403/08/25', plannedAmount: 43, achievedAmount: 44, unit: 'meter', efficiency: 102, status: 'completed', operatorHours: [{ operatorId: '3', hours: 8 }], equipmentHours: [{ equipmentId: '1', hours: 8 }], notes: 'بهتر از برنامه', reportedBy: '2', reportedAt: '2024-11-15' },
  { id: 'a_7d_26', planId: 'p_7d_26', projectId: '4', operationId: '7', date: '1403/08/26', plannedAmount: 40, achievedAmount: 41, unit: 'meter', efficiency: 103, status: 'completed', operatorHours: [{ operatorId: '3', hours: 8 }], equipmentHours: [{ equipmentId: '1', hours: 8 }], notes: 'عملکرد خوب', reportedBy: '2', reportedAt: '2024-11-16' },
  { id: 'a_7d_27', planId: 'p_7d_27', projectId: '4', operationId: '7', date: '1403/08/27', plannedAmount: 44, achievedAmount: 43, unit: 'meter', efficiency: 98, status: 'partial', operatorHours: [{ operatorId: '3', hours: 8 }], equipmentHours: [{ equipmentId: '1', hours: 8 }], notes: 'تقریباً مطابق', reportedBy: '2', reportedAt: '2024-11-17' },
  { id: 'a_7d_28', planId: 'p_7d_28', projectId: '4', operationId: '7', date: '1403/08/28', plannedAmount: 46, achievedAmount: 46, unit: 'meter', efficiency: 100, status: 'completed', operatorHours: [{ operatorId: '3', hours: 8 }], equipmentHours: [{ equipmentId: '1', hours: 8 }], notes: 'در حال انجام', reportedBy: '2', reportedAt: '2024-11-18' }
];
