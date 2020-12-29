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
  teacherId: string;
  departmentName: string;
  userName: string;
}
export interface ITeacherEdit {
  teacherName: string;
}
