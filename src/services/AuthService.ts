import { User, UserLogin, UserRegister } from 'src/models/User';
import { api } from 'src/boot/ofetch';

class AuthService {
  async login(userLogin: UserLogin): Promise<User> {
    const user: User = await api<User>(
      `user/loginUser/${userLogin.nickname}/${userLogin.password}`,
      {
        method: 'POST',
      }
    );
    return user;
  }

  async register(userRegister: UserRegister): Promise<User> {
    const user: User = await api<User>('user/create', {
      method: 'POST',
      body: userRegister,
    });
    return user;
  }
}

export default new AuthService();
