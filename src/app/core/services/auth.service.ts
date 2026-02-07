import { Injectable } from '@angular/core';

export interface User {
  id: string;
  name: string;
  username: string;
  role: 'admin' | 'project_manager' | 'operator';
  assignedProjects?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: User | null = null;

  private readonly mockUsers: User[] = [
    { id: '1', name: 'مدیر سیستم', username: 'admin', role: 'admin' },
    { id: '2', name: 'علی احمدی', username: 'ali_pm', role: 'project_manager', assignedProjects: ['1', '2'] },
    { id: '3', name: 'محمد رضایی', username: 'operator1', role: 'operator', assignedProjects: ['1'] }
  ];

  constructor() {
    const saved = localStorage.getItem('currentUser');
    if (saved) {
      this.currentUser = JSON.parse(saved);
    }
  }

  login(username: string, password: string): { success: boolean; user?: User; error?: string } {
    const user = this.mockUsers.find(u => u.username === username);
    if (user && password === '123456') {
      this.currentUser = user;
      localStorage.setItem('currentUser', JSON.stringify(user));
      return { success: true, user };
    }
    return { success: false, error: 'نام کاربری یا رمز عبور اشتباه است' };
  }

  logout(): void {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  getMockUsers(): User[] {
    return this.mockUsers;
  }
}
