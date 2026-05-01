import { User, UserRole } from '../types';

// Mock backend service for Authentication
export class AuthService {
  private static readonly USERS_KEY = 'binhi_users';
  private static readonly SESSION_KEY = 'binhi_session';

  static async login(email: string, password?: string): Promise<User> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users: User[] = JSON.parse(localStorage.getItem(this.USERS_KEY) || '[]');
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        
        if (!user) return reject(new Error("Account not found."));
        if (user.password !== password) return reject(new Error("Incorrect password."));
        
        localStorage.setItem(this.SESSION_KEY, JSON.stringify(user));
        resolve(user);
      }, 500); // Simulate network latency
    });
  }

  static async register(user: User): Promise<User> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users: User[] = JSON.parse(localStorage.getItem(this.USERS_KEY) || '[]');
        if (users.find(u => u.email.toLowerCase() === user.email.toLowerCase())) {
          return reject(new Error("Email already registered."));
        }
        
        users.push(user);
        localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
        localStorage.setItem(this.SESSION_KEY, JSON.stringify(user));
        resolve(user);
      }, 500);
    });
  }

  static logout(): void {
    localStorage.removeItem(this.SESSION_KEY);
  }

  static getCurrentUser(): User | null {
    const session = localStorage.getItem(this.SESSION_KEY);
    return session ? JSON.parse(session) : null;
  }
}
