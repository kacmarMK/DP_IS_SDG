interface User {
  uid?: string;
  nickname?: string;
  name?: string;
  surname?: string;
  mail?: string;
  password?: string;
}

interface UserLogin {
  nickname: string;
  password: string;
  remember: boolean;
}

interface UserRegister {
  nickname: string;
  name?: string;
  surname?: string;
  mail: string;
  password: string;
}

export type { User, UserLogin, UserRegister };
