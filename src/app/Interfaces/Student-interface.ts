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
  photo: string;
}

export interface IStudentUpdate {
  StudentName: string;
  Photo: File;
}

export interface IAddCourseStudent {
  userId: string;
  courseId: string;
}
