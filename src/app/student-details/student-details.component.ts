import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from '../http.service';
import {
  IAddCourse,
  IAddCourseToTimeTable,
  ICourse,
  IResponseCourse,
} from '../Interfaces/Course-interface';
import { IPaging } from '../Interfaces/paging-interface';
import {
  IAddCourseStudent,
  IStudentReg,
  IStudentView,
} from '../Interfaces/Student-interface';
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
    private userService: UserService,
    private toaster: ToastrService
  ) {}
  student: IStudentView;
  idtoken: string;
  courses: ICourse[];
  allcourses: ICourse[];
  mode: boolean;
  deleteitem: string;
  addcoursemode: boolean = false;
  addform: FormGroup;
  pagingInfop: IPaging;
  ngOnInit(): void {
    this.set_student(this.route.snapshot.params['studentid']);
    this.get_Authorize();
    this.get_student_detail();
    this.get_student_courses();
    this.get_all_courses();
    this.formAddInit();
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
    this.route.queryParams.subscribe((obj) => {
      this.pagingInfop = {
        currentPages: !!obj['PageNumber'] ? +obj['PageNumber'] : 1,
        pageSize: 10,
        nextLink: '',
        prevLink: '',
        totalCount: 0,
        totalPages: 0,
      };
    });
    console.log(this.pagingInfop);
    const paramss = new HttpParams().set(
      'PageNumber',
      this.pagingInfop.currentPages.toString()
    );
    this.http
      .get(this.httpService.base_url + 'GetAllCourses', { params: paramss })
      .subscribe((response: IResponseCourse) => {
        this.allcourses = response['courses'];
        this.pagingInfop = response['pagingInfo'];
        console.log(this.allcourses);
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

  drop_course(course_id: String) {
    this.http
      .delete(this.httpService.base_url + 'DeleteStudentCourse/' + course_id, {
        headers: { Authorization: 'Bearer ' + this.idtoken },
        responseType: 'text',
      })
      .subscribe(
        (response: string) => {
          this.toaster.success('course has successfully droped!', 'droped');
          this.get_student_courses();
        },
        (error) => {
          this.toaster.error(error.error, 'error');
        }
      );
  }
  formAddInit() {
    this.addform = new FormGroup({
      course: new FormControl('', [Validators.required]),
    });
  }
  add_course(coursecode: string) {
    const course: IAddCourseStudent = {
      courseId: coursecode,
      userId: this.student.id,
    };
    this.http
      .post(this.httpService.base_url + 'api/Add/StudentCourse', course, {
        headers: { Authorization: 'Bearer ' + this.idtoken },
      })
      .subscribe(
        (response) => {
          this.toaster.success('course has successfully aded', 'added!');
          this.get_student_courses();
        },
        (error) => {
          if (error.error == 'Has Clash') {
            this.toaster.error(
              'this course has clash with other courses ',
              'clash'
            );
          } else {
            this.toaster.error(error.error, 'error');
          }
        }
      );
  }

  counter(i: number) {
    let list = [];
    if (i - 3 > 0) {
      list.push('..');
    }
    for (let index = i - 2; index <= i; index++) {
      if (index > 0) list.push(index);
    }
    for (let index = i + 1; index < i + 3; index++) {
      if (index <= this.pagingInfop.totalPages) list.push(index);
    }
    if (i + 2 < this.pagingInfop.totalPages) {
      list.push('..');
    }
    return list;
  }
}
