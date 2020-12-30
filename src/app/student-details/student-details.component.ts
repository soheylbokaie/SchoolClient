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
  IStudentUpdate,
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
  profile_photo: string = 'assets/undraw_profile.svg';
  page = 1;
  student: IStudentView;
  idtoken: string;
  courses: ICourse[];
  allcourses: ICourse[];
  available_courses: ICourse[] = [];
  mode: boolean;
  deleteitem: string;
  addcoursemode: boolean = false;
  addform: FormGroup;
  editform: FormGroup;
  pagingInfop: IPaging;
  studentmode: boolean = false;
  editmode: boolean = false;
  ngOnInit(): void {
    const params = this.route.snapshot.params['studentid'];
    if (params != null) {
      this.set_student(params);
      this.studentmode = false;
    } else {
      this.set_student(this.userService.decode_jwt().id);
      this.studentmode = true;
    }
    this.get_Authorize();
    this.get_student_detail();
    this.get_student_courses();
    this.get_all_courses();
    this.formAddInit();
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
      photo: null,
    };
  }
  get_student_detail() {
    this.http
      .get(this.httpService.base_url + 'api/getStudent/' + this.student.id)
      .subscribe((response: IStudentView) => {
        this.student = response;
        console.log(response);
        if (response.photo != null) {
          this.profile_photo =
            this.userService.base_url +
            'api/getStudentprofile/' +
            this.student.id;
        }
        this.formEditInit();
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
            if (element.department == this.student.departmentName) {
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

  get_student_courses() {
    this.http
      .get(this.httpService.base_url + 'StudentTimeTable/' + this.student.id, {
        headers: { Authorization: 'Bearer ' + this.idtoken },
      })
      .subscribe((response: ICourse[]) => {
        this.courses = response;
      });
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

  formEditInit() {
    this.editform = new FormGroup({
      name: new FormControl(this.student.studentName, [Validators.required]),
      picture: new FormControl('', [Validators.required]),
    });
  }
  edit_item() {
    var formData = new FormData();
    formData.append('Photo', this.file_to_upload);
    formData.append('StudentName', this.editform.get('name').value);
    const paramss = new HttpParams().set('userId', this.student.id);
    this.http
      .put(this.userService.base_url + 'api/UpdateStudent', formData, {
        headers: { Authorization: 'Bearer ' + this.idtoken },
        params: paramss,
        responseType: 'text',
      })
      .subscribe((response) => {
        window.location.reload();
      });
  }
  file_to_upload = null;
  upload(event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.file_to_upload = file;
  }
}
