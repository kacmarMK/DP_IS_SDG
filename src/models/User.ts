interface User {
  uid?: string;
  name?: string;
  mail?: string;
  password?: string;
}

interface UserLogin {
  name: string;
  password: string;
}

interface UserRegister {
  name: string;
  mail: string;
  password: string;
}

export type { User, UserLogin, UserRegister };
