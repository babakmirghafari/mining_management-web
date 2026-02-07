import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MenuComponent, MenuItem } from './menu.component';

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;

  const mockMenuItems: MenuItem[] = [
    { id: 'dashboard', route: 'dashboard', label: 'menu.dashboard', icon: '📊' },
    { id: 'users', route: 'users', label: 'menu.users', icon: '👥' },
    { id: 'projects', route: 'projects', label: 'menu.projects', icon: '🏗️' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuComponent, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default empty menuItems', () => {
    expect(component.menuItems).toEqual([]);
  });

  it('should default sidebarOpen to true', () => {
    expect(component.sidebarOpen).toBe(true);
  });

  it('should default activeRoute to empty string', () => {
    expect(component.activeRoute).toBe('');
  });

  it('should render menu items when provided', () => {
    component.menuItems = mockMenuItems;
    fixture.detectChanges();
    const buttons = fixture.nativeElement.querySelectorAll('.menu-btn');
    expect(buttons.length).toBe(3);
  });

  it('should emit navigate event on button click', () => {
    component.menuItems = mockMenuItems;
    fixture.detectChanges();

    const navigateSpy = vi.fn();
    component.navigate.subscribe(navigateSpy);

    component.onNavigate('dashboard');
    expect(navigateSpy).toHaveBeenCalledWith('dashboard');
  });

  it('should apply active class to matching route', () => {
    component.menuItems = mockMenuItems;
    component.activeRoute = 'dashboard';
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('.menu-btn');
    expect(buttons[0].classList.contains('active')).toBe(true);
    expect(buttons[1].classList.contains('active')).toBe(false);
  });

  it('should show labels when sidebarOpen is true', () => {
    component.menuItems = mockMenuItems;
    component.sidebarOpen = true;
    fixture.detectChanges();

    const labels = fixture.nativeElement.querySelectorAll('.menu-label');
    expect(labels.length).toBe(3);
  });

  it('should hide labels when sidebarOpen is false', () => {
    component.menuItems = mockMenuItems;
    component.sidebarOpen = false;
    fixture.detectChanges();

    const labels = fixture.nativeElement.querySelectorAll('.menu-label');
    expect(labels.length).toBe(0);
  });
});
