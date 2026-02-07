import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { DataService } from '../../../../shared/services/data.service';
import { AuthService, User } from '../../../../core/services/auth.service';
import { DelayReason } from '../../../../shared/models/data.models';
import { Subscription } from 'rxjs';

interface CategoryInfo {
  key: string;
  label: string;
  color: string;
}

@Component({
  selector: 'app-delay-reasons',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './delay-reasons.component.html',
  styleUrl: './delay-reasons.component.scss'
})
export class DelayReasonsComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  reasons: DelayReason[] = [];
  isDialogOpen = false;
  selectedReason: DelayReason | null = null;
  private subscription: Subscription | null = null;

  categories: CategoryInfo[] = [
    { key: 'equipment', label: 'خرابی تجهیزات', color: '#FF5733' },
    { key: 'weather', label: 'آب و هوا', color: '#33C1FF' },
    { key: 'material', label: 'کمبود مواد', color: '#FFB533' },
    { key: 'maintenance', label: 'تعمیرات', color: '#9D33FF' },
    { key: 'other', label: 'سایر', color: '#6C757D' }
  ];

  formData = {
    name: '',
    category: 'equipment' as DelayReason['category'],
    description: '',
    color: '#FF5733',
    isActive: true
  };

  constructor(
    private dataService: DataService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.subscription = this.dataService.delayReasons$.subscribe(reasons => {
      this.reasons = reasons;
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  get activeReasons(): DelayReason[] {
    return this.reasons.filter(r => r.isActive);
  }

  get inactiveReasons(): DelayReason[] {
    return this.reasons.filter(r => !r.isActive);
  }

  get uniqueCategoryCount(): number {
    return new Set(this.reasons.map(r => r.category)).size;
  }

  get stats() {
    return {
      total: this.reasons.length,
      active: this.activeReasons.length,
      inactive: this.inactiveReasons.length,
      categories: this.uniqueCategoryCount
    };
  }

  get categoryBreakdown(): { info: CategoryInfo; count: number; reasons: DelayReason[] }[] {
    return this.categories.map(cat => ({
      info: cat,
      count: this.reasons.filter(r => r.category === cat.key).length,
      reasons: this.reasons.filter(r => r.category === cat.key)
    })).filter(item => item.count > 0);
  }

  getCategoryInfo(category: string): CategoryInfo {
    return this.categories.find(c => c.key === category) || this.categories[4];
  }

  truncateDescription(desc?: string, maxLen = 40): string {
    if (!desc) return '-';
    return desc.length > maxLen ? desc.substring(0, maxLen) + '...' : desc;
  }

  openAddDialog(): void {
    this.selectedReason = null;
    this.formData = {
      name: '',
      category: 'equipment',
      description: '',
      color: '#FF5733',
      isActive: true
    };
    this.isDialogOpen = true;
  }

  openEditDialog(reason: DelayReason): void {
    this.selectedReason = reason;
    this.formData = {
      name: reason.name,
      category: reason.category,
      description: reason.description || '',
      color: reason.color || '#FF5733',
      isActive: reason.isActive
    };
    this.isDialogOpen = true;
  }

  handleSubmit(): void {
    if (!this.formData.name.trim()) return;

    if (this.selectedReason) {
      this.dataService.updateDelayReason(this.selectedReason.id, {
        name: this.formData.name,
        category: this.formData.category,
        description: this.formData.description,
        color: this.formData.color,
        isActive: this.formData.isActive
      });
    } else {
      this.dataService.addDelayReason({
        name: this.formData.name,
        category: this.formData.category,
        description: this.formData.description,
        color: this.formData.color,
        isActive: this.formData.isActive
      });
    }
    this.closeDialog();
  }

  deleteReason(id: string): void {
    if (confirm('آیا از حذف این دلیل تاخیر اطمینان دارید؟')) {
      this.dataService.deleteDelayReason(id);
    }
  }

  closeDialog(): void {
    this.isDialogOpen = false;
    this.selectedReason = null;
  }
}
