import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from '../http.service';
import { ITeacherReg, ITeacherView } from '../Interfaces/app-interface';
import { IPaging } from '../Interfaces/paging-interface';
import { IStudentReg, IStudentView } from '../Interfaces/Student-interface';
import { UserService } from '../user.service';
import * as MyValidators from '../validators/app-formvalidators';

@Component({
  selector: 'app-teacher-controll',
  templateUrl: './teacher-controll.component.html',
  styleUrls: [
    './teacher-controll.component.css',
    '../admin-panel/sb-admin-2.min.css',
  ],
})
export class TeacherControllComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private toastr: ToastrService,
    private httpService: HttpService
  ) {}
  //
  page = 1;
  count: number;
  deleteID: string;
  //
  base_url = this.httpService.base_url;
  pagingInfop: IPaging;
  teachers: ITeacherView[];
  mode: boolean = false;
  addForm: FormGroup;
  idtoken: string;
  depid: string;

  ngOnInit(): void {
    this.depid = this.route.snapshot.params['depid'];
    this.GetAllTeachers();
    this.formAddInit();
    this.get_Authorize();
  }

  formAddInit() {
    this.addForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        MyValidators.lowercaseValidator,
        MyValidators.lowercaseValidator,
        MyValidators.UniqueChars,
        MyValidators.Digit,
      ]),
      confirmPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        MyValidators.ConfirmCheck,
      ]),
      email: new FormControl('', [Validators.required, Validators.email]),
      studentName: new FormControl('', [Validators.required]),
    });
  }
  get_Authorize() {
    this.userService.currentToken$.subscribe((res) => {
      this.idtoken = res.token;
    });
  }

  add_item() {
    const temp: ITeacherReg = {
      teacherName: this.addForm.get('teacherName').value,
      userName: this.addForm.get('username').value,
      email: this.addForm.get('email').value,
      password: this.addForm.get('password').value,
      departmentId: +this.depid,
    };

    if (this.addForm.hasError) {
      this.http
        .post(this.base_url + 'api/TeacherRegister', temp, {
          headers: { Authorization: 'Bearer ' + this.idtoken },
        })
        .subscribe(
          (response) => {
            console.log(response);
            this.mode = false;
            this.addForm.reset();
            this.toastr.success('Student has successfully added', 'added');
            this.GetAllTeachers();
          },
          (error) => {
            this.toastr.error(error.error, 'Error');
            console.log(error);
          }
        );
    } else {
      console.log(this.addForm.errors);
      this.toastr.error('form is not valid', 'Error');
    }
  }
  public GetAllTeachers() {
    this.route.queryParams.subscribe((obj) => {
      this.pagingInfop = {
        currentPages: !!obj['PageNumber'] ? +obj['PageNumber'] : 1,
        pageSize: !!obj['PageSize'] ? +obj['PageSize'] : 10,
        nextLink: '',
        prevLink: '',
        totalCount: 0,
        totalPages: 0,
      };
      const paramss = new HttpParams()
        // .set('PageNumber', this.pagingInfop.currentPages.toString())
        // .set('PageSize', this.pagingInfop.pageSize.toString())
        .set('DepartmentId', this.depid);
      this.http
        .get(this.base_url + 'GetAllDepartmentTeachers', { params: paramss })
        .subscribe(
          (response: ITeacherView[]) => {
            this.teachers = response;
            this.count = this.teachers.length;

            // this.pagingInfop = response['pagingInfo'];
            // if (this.pagingInfop.totalPages < this.pagingInfop.currentPages) {
            //   paramss.set('PageNumber', this.pagingInfop.totalPages.toString());
            //   this.router.navigate([], {
            //     relativeTo: this.route,
            //     queryParams: {
            //       PageNumber: this.pagingInfop.totalPages,
            //       PageSize: this.pagingInfop.pageSize,
            //     },
            //   });
            // }
          },
          (error) => {
            console.log(error);
          }
        );
    });
  }

  delete_item() {
    console.log(this.deleteID);
  }
}
