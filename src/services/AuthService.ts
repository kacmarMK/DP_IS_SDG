import { User, UserLogin, UserRegister, UserUpdate } from 'src/models/User';
import { api } from '@/utils/api';

class AuthService {
  async login(userLogin: UserLogin): Promise<string> {
    const jwt = await api<string>(
      `user/login/${userLogin.name}/${userLogin.password}`,
      {
        method: 'POST',
      },
    );
    return jwt;
  }

  async register(userRegister: UserRegister): Promise<User> {
    const user: User = await api<User>('user/create/user', {
      method: 'POST',
      body: userRegister,
    });
    return user;
  }

  async getUserById(id: string): Promise<User> {
    const user: User = await api<User>(`user/getUserById/${id}`, {
      method: 'GET',
    });
    return user;
  }

  async updateUser(user: UserUpdate, id: string): Promise<User> {
    const updatedUser: User = await api<User>(`user/updateUser/${id}`, {
      method: 'POST',
      body: user,
    });
    return updatedUser;
  }
}

export default new AuthService();
