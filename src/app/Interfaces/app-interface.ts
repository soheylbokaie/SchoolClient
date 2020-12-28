export interface ITeacherReg {
  teacherName: string;
  userName: string;
  password: string;
  departmentId: number;
  email: string;
}

export interface ITeacherView {
  teacherName: string;
  email: string;
}



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
