import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { DataService } from '../../../../shared/services/data.service';
import { AuthService, User } from '../../../../core/services/auth.service';

interface LocalEquipment {
  id: string;
  name: string;
  code: string;
  type: string;
  model: string;
  manufacturer: string;
  yearOfPurchase: string;
  status: 'active' | 'maintenance' | 'out_of_service';
  assignedProject?: string;
  location: string;
  lastMaintenance?: string;
  nextMaintenance?: string;
  operationHours: number;
  description?: string;
  createdAt: string;
}

interface EquipmentTypeOption {
  value: string;
  label: string;
}

interface EquipmentStatusOption {
  value: string;
  label: string;
  color: string;
}

@Component({
  selector: 'app-equipment-management',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './equipment-management.component.html',
  styleUrl: './equipment-management.component.scss'
})
export class EquipmentManagementComponent implements OnInit {
  currentUser: User | null = null;
  isDialogOpen = false;
  isTransferDialogOpen = false;
  selectedEquipment: LocalEquipment | null = null;
  transferEquipment: LocalEquipment | null = null;
  newProjectId = '';

  equipmentTypes: EquipmentTypeOption[] = [
    { value: 'drilling', label: 'حفاری' },
    { value: 'excavator', label: 'بیل مکانیکی' },
    { value: 'truck', label: 'کامیون' },
    { value: 'loader', label: 'لودر' },
    { value: 'crusher', label: 'سنگ شکن' },
    { value: 'conveyor', label: 'نوار نقاله' },
    { value: 'pump', label: 'پمپ' },
    { value: 'generator', label: 'ژنراتور' },
  ];

  equipmentStatuses: EquipmentStatusOption[] = [
    { value: 'active', label: 'فعال', color: 'status-active' },
    { value: 'maintenance', label: 'در تعمیر', color: 'status-maintenance' },
    { value: 'out_of_service', label: 'خارج از سرویس', color: 'status-out' },
  ];

  equipment: LocalEquipment[] = [
    { id: '1', name: 'دستگاه حفاری JK 810', code: 'DR-JK810-001', type: 'drilling', model: 'JK 810', manufacturer: 'JK', yearOfPurchase: '1400', status: 'active', assignedProject: '1', location: 'معدن میشدوان - بافق', lastMaintenance: '1403/08/15', nextMaintenance: '1403/10/15', operationHours: 2450, description: 'دستگاه حفاری JK 810 برای عملیات حفاری معدن میشدوان', createdAt: '1400/01/15' },
    { id: '2', name: 'بیل مکانیکی کوماتسو 450', code: 'EX-KOM450-001', type: 'excavator', model: 'کوماتسو 450', manufacturer: 'Komatsu', yearOfPurchase: '1401', status: 'active', assignedProject: '1', location: 'معدن میشدوان - بافق', lastMaintenance: '1403/09/01', nextMaintenance: '1403/11/01', operationHours: 1890, createdAt: '1401/03/20' },
    { id: '3', name: 'کامیون بی\u200Cبن', code: 'TR-BB-001', type: 'truck', model: 'بی\u200Cبن 320', manufacturer: 'Mercedes-Benz', yearOfPurchase: '1402', status: 'active', assignedProject: '2', location: 'معدن ناریگان - بافق', lastMaintenance: '1403/08/20', nextMaintenance: '1403/09/20', operationHours: 1200, createdAt: '1402/05/10' },
    { id: '4', name: 'بیل مکانیکی کوماتسو 450', code: 'EX-KOM450-002', type: 'excavator', model: 'کوماتسو 450', manufacturer: 'Komatsu', yearOfPurchase: '1401', status: 'active', assignedProject: '2', location: 'معدن ناریگان - بافق', lastMaintenance: '1403/08/25', nextMaintenance: '1403/10/25', operationHours: 2100, createdAt: '1401/04/15' },
    { id: '5', name: 'بیل مکانیکی کوماتسو 450', code: 'EX-KOM450-003', type: 'excavator', model: 'کوماتسو 450', manufacturer: 'Komatsu', yearOfPurchase: '1400', status: 'active', assignedProject: '3', location: 'معدن تنهک - بزمان', lastMaintenance: '1403/08/10', nextMaintenance: '1403/10/10', operationHours: 2800, createdAt: '1400/06/15' },
    { id: '6', name: 'کامیون بی\u200Cبن', code: 'TR-BB-002', type: 'truck', model: 'بی\u200Cبن 380', manufacturer: 'Scania', yearOfPurchase: '1401', status: 'active', assignedProject: '3', location: 'معدن تنهک - بزمان', lastMaintenance: '1403/09/05', nextMaintenance: '1403/11/05', operationHours: 1650, createdAt: '1401/07/20' },
    { id: '7', name: 'دستگاه حفاری JK 810', code: 'DR-JK810-002', type: 'drilling', model: 'JK 810', manufacturer: 'JK', yearOfPurchase: '1402', status: 'active', assignedProject: '4', location: 'معدن گلیران - شرق', lastMaintenance: '1403/09/10', nextMaintenance: '1403/11/10', operationHours: 980, createdAt: '1402/08/20' },
    { id: '8', name: 'بیل مکانیکی کوماتسو 450', code: 'EX-KOM450-004', type: 'excavator', model: 'کوماتسو 450', manufacturer: 'Komatsu', yearOfPurchase: '1402', status: 'active', assignedProject: '4', location: 'معدن گلیران - شرق', lastMaintenance: '1403/09/08', nextMaintenance: '1403/11/08', operationHours: 1050, createdAt: '1402/09/01' },
    { id: '9', name: 'کامیون بی\u200Cبن', code: 'TR-BB-003', type: 'truck', model: 'بی\u200Cبن 340', manufacturer: 'Volvo', yearOfPurchase: '1399', status: 'maintenance', location: 'تعمیرگاه مرکزی', lastMaintenance: '1403/09/15', nextMaintenance: '1403/10/15', operationHours: 3200, createdAt: '1399/11/10' },
    { id: '10', name: 'بیل مکانیکی کوماتسو 450', code: 'EX-KOM450-005', type: 'excavator', model: 'کوماتسو 450', manufacturer: 'Komatsu', yearOfPurchase: '1398', status: 'out_of_service', location: 'انبار تجهیزات', lastMaintenance: '1403/07/01', operationHours: 4500, createdAt: '1398/05/25' }
  ];

  formData = {
    name: '',
    code: '',
    type: 'drilling',
    model: '',
    manufacturer: '',
    yearOfPurchase: '',
    status: 'active' as LocalEquipment['status'],
    assignedProject: '',
    location: '',
    lastMaintenance: '',
    nextMaintenance: '',
    operationHours: 0,
    description: ''
  };

  constructor(
    public dataService: DataService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
  }

  get filteredEquipment(): LocalEquipment[] {
    if (this.currentUser?.role === 'admin') return this.equipment;
    if (this.currentUser?.role === 'project_manager') {
      return this.equipment.filter(eq =>
        eq.assignedProject && this.currentUser?.assignedProjects?.includes(eq.assignedProject)
      );
    }
    return [];
  }

  get stats() {
    const filtered = this.filteredEquipment;
    return {
      total: filtered.length,
      active: filtered.filter(eq => eq.status === 'active').length,
      maintenance: filtered.filter(eq => eq.status === 'maintenance').length,
      outOfService: filtered.filter(eq => eq.status === 'out_of_service').length,
    };
  }

  getTypeLabel(type: string): string {
    return this.equipmentTypes.find(t => t.value === type)?.label || type;
  }

  getStatusInfo(status: string): EquipmentStatusOption {
    return this.equipmentStatuses.find(s => s.value === status) || this.equipmentStatuses[0];
  }

  getProjectName(projectId?: string): string {
    if (!projectId) return '-';
    return this.dataService.projects.find(p => p.id === projectId)?.name || '-';
  }

  get transferTargetProjects() {
    return this.dataService.projects.filter(p => p.id !== this.transferEquipment?.assignedProject);
  }

  openAddDialog(): void {
    this.resetForm();
    this.isDialogOpen = true;
  }

  openEditDialog(eq: LocalEquipment): void {
    this.selectedEquipment = eq;
    this.formData = {
      name: eq.name,
      code: eq.code,
      type: eq.type,
      model: eq.model,
      manufacturer: eq.manufacturer,
      yearOfPurchase: eq.yearOfPurchase,
      status: eq.status,
      assignedProject: eq.assignedProject || '',
      location: eq.location,
      lastMaintenance: eq.lastMaintenance || '',
      nextMaintenance: eq.nextMaintenance || '',
      operationHours: eq.operationHours,
      description: eq.description || ''
    };
    this.isDialogOpen = true;
  }

  openTransferDialog(eq: LocalEquipment): void {
    this.transferEquipment = eq;
    this.newProjectId = '';
    this.isTransferDialogOpen = true;
  }

  handleSubmit(): void {
    if (this.selectedEquipment) {
      const idx = this.equipment.findIndex(eq => eq.id === this.selectedEquipment!.id);
      if (idx >= 0) {
        this.equipment[idx] = {
          ...this.equipment[idx],
          ...this.formData,
          assignedProject: this.formData.assignedProject === '' ? undefined : this.formData.assignedProject
        };
        this.equipment = [...this.equipment];
      }
    } else {
      const newEq: LocalEquipment = {
        id: Date.now().toString(),
        ...this.formData,
        assignedProject: this.formData.assignedProject === '' ? undefined : this.formData.assignedProject,
        createdAt: new Date().toLocaleDateString('fa-IR')
      };
      this.equipment = [...this.equipment, newEq];
    }
    this.isDialogOpen = false;
    this.resetForm();
  }

  handleTransfer(): void {
    if (this.transferEquipment && this.newProjectId) {
      const projectName = this.dataService.projects.find(p => p.id === this.newProjectId)?.name || '';
      const idx = this.equipment.findIndex(eq => eq.id === this.transferEquipment!.id);
      if (idx >= 0) {
        this.equipment[idx] = {
          ...this.equipment[idx],
          assignedProject: this.newProjectId,
          location: `منتقل شده به ${projectName}`
        };
        this.equipment = [...this.equipment];
      }
      this.isTransferDialogOpen = false;
      this.transferEquipment = null;
      this.newProjectId = '';
    }
  }

  handleStatusChange(equipmentId: string, newStatus: LocalEquipment['status']): void {
    const idx = this.equipment.findIndex(eq => eq.id === equipmentId);
    if (idx >= 0) {
      this.equipment[idx] = { ...this.equipment[idx], status: newStatus };
      this.equipment = [...this.equipment];
    }
  }

  deleteEquipment(equipmentId: string): void {
    if (confirm('آیا از حذف این تجهیز اطمینان دارید؟')) {
      this.equipment = this.equipment.filter(eq => eq.id !== equipmentId);
    }
  }

  resetForm(): void {
    this.selectedEquipment = null;
    this.formData = {
      name: '',
      code: '',
      type: 'drilling',
      model: '',
      manufacturer: '',
      yearOfPurchase: '',
      status: 'active',
      assignedProject: '',
      location: '',
      lastMaintenance: '',
      nextMaintenance: '',
      operationHours: 0,
      description: ''
    };
  }

  closeDialog(): void {
    this.isDialogOpen = false;
    this.resetForm();
  }

  closeTransferDialog(): void {
    this.isTransferDialogOpen = false;
    this.transferEquipment = null;
    this.newProjectId = '';
  }
}
