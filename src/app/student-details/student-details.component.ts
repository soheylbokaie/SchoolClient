import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '../http.service';
import { ICourse } from '../Interfaces/Course-interface';
import { IStudentReg, IStudentView } from '../Interfaces/Student-interface';
import { TokenService } from '../token.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-student-details',
  templateUrl: './student-details.component.html',
  styleUrls: [
    './student-details.component.css',
    '../admin-panel/sb-admin-2.min.css',
  ],
})
export class StudentDetailsComponent implements OnInit {
  constructor(
    private httpService: HttpService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private token: TokenService,
    private userService: UserService
  ) {}
  student: IStudentView;
  idtoken: string;
  courses: ICourse[];
  mode: boolean;
  deleteitem: string;
  ngOnInit(): void {
    this.set_student(this.route.snapshot.params['studentid']);
    this.get_Authorize();
    this.get_student_detail();
    this.get_student_courses();
  }

  back() {
    this.httpService.back();
  }
  get_Authorize() {
    this.userService.currentToken$.subscribe((res) => {
      this.idtoken = res.token;
    });
  }
  set_student(
    id: string,
    studentname: string = null,
    departmentname: string = null
  ) {
    this.student = {
      id: id,
      studentName: studentname,
      departmentName: departmentname,
    };
  }
  get_student_detail() {
    this.http
      .get(this.httpService.base_url + 'api/getStudent/' + this.student.id)
      .subscribe((response: IStudentView) => {
        this.student = response;
      });
  }
  get_all_courses() {
    this.http
      .get(this.httpService.base_url + '/GetAllCourses')
      .subscribe((response: ICourse[]) => {
        this.courses = response;
        console.log(this.courses);
      });
  }

  get_student_courses() {
    this.http
      .get(this.httpService.base_url + 'StudentTimeTable/' + this.student.id, {
        headers: { Authorization: 'Bearer ' + this.idtoken },
      })
      .subscribe((response: ICourse[]) => {
        this.courses = response;
        console.log(this.courses);
      });
  }
  boraz(c) {
    console.log(c);
  }
}
