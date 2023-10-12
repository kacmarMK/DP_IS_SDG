import { User, UserLogin } from 'src/models/User';
import { api } from 'src/boot/ofetch';

class AuthService {
  async login(userLogin: UserLogin): Promise<User> {
    const user: User = await api<User>(
      `user/loginUser/${userLogin.name}/${userLogin.password}`,
      {
        method: 'POST',
      }
    );
    return user;
  }
}

export default new AuthService();
