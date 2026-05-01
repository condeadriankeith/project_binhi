export class AdminService {
  private static readonly ADMIN_SESSION_KEY = 'binhi_admin_session';

  static async login(password: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (password === 'admin123') { // Hardcoded for prototype
          localStorage.setItem(this.ADMIN_SESSION_KEY, 'true');
          resolve(true);
        } else {
          resolve(false);
        }
      }, 500);
    });
  }

  static logout(): void {
    localStorage.removeItem(this.ADMIN_SESSION_KEY);
  }

  static isAuthenticated(): boolean {
    return localStorage.getItem(this.ADMIN_SESSION_KEY) === 'true';
  }

  static factoryReset(): void {
    localStorage.clear();
    window.location.href = '/';
  }

  static getAllUsers(): any[] {
    const users = localStorage.getItem('binhi_users');
    return users ? JSON.parse(users) : [];
  }

  static clearUser(email: string): void {
    const users = this.getAllUsers();
    const updated = users.filter(u => u.email !== email);
    localStorage.setItem('binhi_users', JSON.stringify(updated));
  }
}
