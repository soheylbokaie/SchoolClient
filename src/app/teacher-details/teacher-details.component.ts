import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from '../http.service';
import { ITeacherEdit, ITeacherView } from '../Interfaces/app-interface';
import { ICourse, IResponseCourse } from '../Interfaces/Course-interface';
import { IPaging } from '../Interfaces/paging-interface';
import {
  IAddCourseStudent,
  IStudentView,
} from '../Interfaces/Student-interface';
import { TokenService } from '../token.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-teacher-details',
  templateUrl: './teacher-details.component.html',
  styleUrls: [
    './teacher-details.component.css',
    '../admin-panel/sb-admin-2.min.css',
  ],
})
export class TeacherDetailsComponent implements OnInit {
  constructor(
    private httpService: HttpService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private token: TokenService,
    private userService: UserService,
    private toaster: ToastrService
  ) {}
  page = 1;
  teacher: ITeacherView;
  idtoken: string;
  courses: ICourse[];
  allcourses: ICourse[];
  available_courses: ICourse[] = [];
  mode: boolean = false;
  editForm: FormGroup;
  deleteitem: string;
  addcoursemode: boolean = false;
  addform: FormGroup;
  pagingInfop: IPaging;
  ngOnInit(): void {
    this.set_teacher(this.route.snapshot.params['teacherid']);
    this.get_Authorize();
    this.get_teacher_detail();
    this.get_teacher_courses();
    this.get_all_courses();
    this.formAddInit();
  }

  get_Authorize() {
    this.userService.currentToken$.subscribe((res) => {
      this.idtoken = res.token;
    });
  }
  set_teacher(
    id: string,
    email: string = null,
    teacherName: string = null,
    dep: string = null,
    userName: string = null
  ) {
    this.teacher = {
      teacherName: teacherName,
      email: email,
      teacherId: id,
      departmentName: dep,
      userName: userName,
    };
  }
  get_teacher_detail() {
    this.http
      .get(
        this.httpService.base_url + 'api/getTeacher/' + this.teacher.teacherId
      )
      .subscribe((response: ITeacherView) => {
        this.teacher = response;
        this.editforminit();
      });
  }
  get_all_courses() {
    this.route.queryParams.subscribe((obj) => {
      this.pagingInfop = {
        currentPages: 1,
        pageSize: 300,
        nextLink: '',
        prevLink: '',
        totalCount: 0,
        totalPages: 0,
      };
    });
    const paramss = new HttpParams()
      .set('PageNumber', this.pagingInfop.currentPages.toString())
      .set('PageSize', this.pagingInfop.pageSize.toString());
    this.http
      .get(this.httpService.base_url + 'GetAllCourses', { params: paramss })
      .subscribe(
        (response: IResponseCourse) => {
          this.allcourses = response['courses'];
          this.pagingInfop = response['pagingInfo'];
          this.allcourses.forEach((element) => {
            if (element.department == this.teacher.departmentName) {
              this.available_courses.push(element);
            }
          });
          console.log(this.available_courses);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  get_teacher_courses() {
    this.http
      .get(
        this.httpService.base_url +
          'TeacherTimeTable/' +
          this.teacher.teacherId,
        {
          headers: { Authorization: 'Bearer ' + this.idtoken },
        }
      )
      .subscribe((response: ICourse[]) => {
        this.courses = response;
        console.log(response);
      });
  }

  drop_course(course_id: String) {
    this.http
      .delete(this.httpService.base_url + 'DeleteTeacherCourse/' + course_id, {
        headers: { Authorization: 'Bearer ' + this.idtoken },
        responseType: 'text',
      })
      .subscribe(
        (response: string) => {
          this.toaster.success('course has successfully droped!', 'droped');
          this.get_teacher_courses();
        },
        (error) => {
          this.toaster.error(error.error, 'error');
          console.error(error);
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
      userId: this.teacher.teacherId,
    };
    this.http
      .post(this.httpService.base_url + 'api/Add/TeacherCourse', course, {
        headers: { Authorization: 'Bearer ' + this.idtoken },
      })
      .subscribe(
        (response) => {
          this.toaster.success('course has successfully aded', 'added!');
          this.get_teacher_courses();
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

  editTeacher() {
    const teacher: ITeacherEdit = {
      teacherName: this.editForm.get('teacherName').value,
    };
    const paramss = new HttpParams().set('userId', this.teacher.teacherId);
    this.http
      .put(this.httpService.base_url + 'api/UpdateTeacher', teacher, {
        params: paramss,
        headers: { Authorization: 'Bearer ' + this.idtoken },
      })
      .subscribe((response) => {
        console.log(response);
      });
  }
  editforminit() {
    this.editForm = new FormGroup({
      teacherName: new FormControl(this.teacher.teacherName, [
        Validators.required,
      ]),
    });
  }
}