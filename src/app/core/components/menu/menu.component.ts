import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

export interface MenuItem {
  id: string;
  route: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
  @Input() menuItems: MenuItem[] = [];
  @Input() activeRoute = '';
  @Input() sidebarOpen = true;
  @Output() navigate = new EventEmitter<string>();

  onNavigate(route: string): void {
    this.navigate.emit(route);
  }
}
