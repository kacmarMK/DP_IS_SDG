import { User, UserLogin, UserRegister } from 'src/models/User';
import { api } from 'src/boot/ofetch';

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
}

export default new AuthService();
