import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from '../http.service';
import { ICourse, IResponseCourse } from '../Interfaces/Course-interface';
import { IPaging } from '../Interfaces/paging-interface';
import {
  IAddCourseStudent,
  IStudentView,
} from '../Interfaces/Student-interface';
import { ITeacherEdit, ITeacherView } from '../Interfaces/Teacher-interface';
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
  availableCourses: ICourse[] = [];
  mode = false;
  editForm: FormGroup;
  deleteitem: string;
  addcoursemode = false;
  addform: FormGroup;
  pagingInfop: IPaging;
  teachermode = false;

  ngOnInit(): void {
    const params = this.route.snapshot.params.teacherid;
    if (params != null) {
      this.set_teacher(params);
      this.teachermode = false;
    } else {
      this.set_teacher(this.userService.decode_jwt().id);
      this.teachermode = true;
    }
    this.get_Authorize();
    this.get_teacher_detail();
    this.get_teacher_courses();
    this.get_all_courses();
    this.formAddInit();
  }

  get_Authorize(): void {
    this.userService.currentToken$.subscribe((res) => {
      this.idtoken = res?.token;
    });
  }
  set_teacher(
    id: string,
    Email: string = null,
    teachername: string = null,
    dep: string = null,
    username: string = null
  ): void {
    this.teacher = {
      teacherName: teachername,
      email: Email,
      teacherId: id,
      departmentName: dep,
      userName: username,
    };
  }
  get_teacher_detail(): void {
    this.http
      .get(
        this.httpService.baseUrl + 'api/getTeacher/' + this.teacher.teacherId
      )
      .subscribe((response: ITeacherView) => {
        this.teacher = response;
        this.editforminit();
      });
  }
  get_all_courses(): void {
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
      .get(this.httpService.baseUrl + 'GetAllCourses', { params: paramss })
      .subscribe(
        (response: IResponseCourse) => {
          this.allcourses = response.courses;
          this.pagingInfop = response.pagingInfo;
          this.allcourses.forEach((element) => {
            if (element.department === this.teacher.departmentName) {
              this.availableCourses.push(element);
            }
          });
        },
        (error) => {
          this.toaster.error('there is an error', 'error');
        }
      );
  }

  get_teacher_courses(): void {
    this.http
      .get(
        this.httpService.baseUrl + 'TeacherTimeTable/' + this.teacher.teacherId,
        {
          headers: { Authorization: 'Bearer ' + this.idtoken },
        }
      )
      .subscribe((response: ICourse[]) => {
        this.courses = response;
      });
  }

  drop_course(courseId: string): void {
    this.http
      .delete(this.httpService.baseUrl + 'DeleteTeacherCourse/' + courseId, {
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
  formAddInit(): void {
    this.addform = new FormGroup({
      course: new FormControl('', [Validators.required]),
    });
  }
  add_course(coursecode: string): void {
    const course: IAddCourseStudent = {
      courseId: coursecode,
      userId: this.teacher.teacherId,
    };
    this.http
      .post(this.httpService.baseUrl + 'api/Add/TeacherCourse', course, {
        headers: { Authorization: 'Bearer ' + this.idtoken },
      })
      .subscribe(
        (response) => {
          this.toaster.success('course has successfully aded', 'added!');
          this.get_teacher_courses();
        },
        (error) => {
          if (error.error === 'Has Clash') {
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

  counter(i: number): Array<number | string> {
    let list: Array<number | string> = [];
    if (i - 3 > 0) {
      list.push('..');
    }
    for (let index = i - 2; index <= i; index++) {
      if (index > 0) {
        list.push(index);
      }
    }
    for (let index = i + 1; index < i + 3; index++) {
      if (index <= this.pagingInfop.totalPages) {
        list.push(index);
      }
    }
    if (i + 2 < this.pagingInfop.totalPages) {
      list.push('..');
    }
    return list;
  }
  editTeacher(): void {
    const teacher: ITeacherEdit = {
      teacherName: this.editForm.get('teacherName').value,
    };
    const paramss = new HttpParams().set('userId', this.teacher.teacherId);
    this.http
      .put(this.httpService.baseUrl + 'api/UpdateTeacher', teacher, {
        params: paramss,
        headers: { Authorization: 'Bearer ' + this.idtoken },
      })
      .subscribe(
        (response) => {
          this.toaster.success(
            'name has been successfully changed ',
            'success'
          );
          this.mode = !this.mode;
          this.get_teacher_detail();
        },
        (error) => {
          this.toaster.error('there is an error (check console)', 'error');
          console.error(error);
        }
      );
  }
  editforminit(): void {
    this.editForm = new FormGroup({
      teacherName: new FormControl(this.teacher.teacherName, [
        Validators.required,
      ]),
    });
  }
}
