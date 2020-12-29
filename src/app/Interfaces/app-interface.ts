export interface IUserLogin {
  username: string;
  password: string;
}

export interface ILoginResp {
  token: string;
  refreshToken: string;
  success: boolean;
  role: string;
}

export interface IUSer {
  name: string;
  id: string;
  role: string;
}

export interface ITokenRefresh {
  token: string;
  refreshToken: string;
}
