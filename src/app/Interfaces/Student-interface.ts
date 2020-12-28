export interface IStudentReg {
  userName: string;
  studentName: string;
  email: string;
  password: string;
  departmentId: number;
}

export interface IStudentView {
  id: string;
  studentName: string;
  departmentName: string;
}

export interface IStudentUpdate {}

export interface IAddCourseStudent {
  userId: string;
  courseId: string;
}
