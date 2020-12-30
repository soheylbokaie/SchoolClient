import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from '../http.service';
import { ICourse, IUpdateCourse } from '../Interfaces/Course-interface';
import { UserService } from '../user.service';
import { Location } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { textChangeRangeIsUnchanged } from 'typescript';

@Component({
  selector: 'app-courses-controll',
  templateUrl: './courses-controll.component.html',
  styleUrls: [
    './courses-controll.component.css',
    '../admin-panel/sb-admin-2.min.css',
  ],
})
export class CoursesControllComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private httpService: HttpService,
    private http: HttpClient,
    private userService: UserService,
    private toaster: ToastrService,
    private router: Router,
    private location: Location
  ) {}
  baseUrl = this.httpService.baseUrl;
  courseId: string;
  course: ICourse;
  idtoken: string;
  editmode = false;
  editForm: FormGroup;

  ngOnInit(): void {
    this.courseId = this.route.snapshot.params.id;

    this.GetCourse();

    this.get_Authorize();
  }

  GetCourse(): void {
    this.http
      .get(this.baseUrl + 'api/GetCourse/' + this.courseId)
      .subscribe((params: ICourse) => {
        this.course = params[0];
        this.formEditInit();
      });
  }

  get_Authorize(): void {
    this.userService.currentToken$.subscribe((res) => {
      this.idtoken = res.token;
    });
  }

  deleteCourse(): void {
    this.http
      .delete(this.baseUrl + 'deletecourse/' + this.courseId, {
        headers: { Authorization: 'Bearer ' + this.idtoken },
        responseType: 'text',
      })
      .subscribe(
        (params) => {
          this.toaster.info('course deleted!', 'deleted');
          this.back();
        },
        (error) => {
          this.toaster.error(error.error, 'error');
        }
      );
  }
  formEditInit(): void {
    this.editForm = new FormGroup({
      courseName: new FormControl(this.course.courseName, [
        Validators.required,
      ]),
      courseDescription: new FormControl(this.course.courseDescription, [
        Validators.required,
      ]),
      startDate: new FormControl('', [Validators.required]),
      endDate: new FormControl('', [Validators.required]),
    });
  }
  editCourse(): void {
    const temp: IUpdateCourse = {
      courseName: this.editForm.get('courseName').value,
      courseDescription: this.editForm.get('courseDescription').value,
      startDate: this.editForm.get('startDate').value,
      endDate: this.editForm.get('endDate').value,
    };

    this.http
      .put(this.baseUrl + 'updatecourse/' + this.courseId, temp, {
        headers: { Authorization: 'Bearer ' + this.idtoken },
      })
      .subscribe((response) => {
        this.editmode = !this.editmode;
        this.toaster.success('course has been updated', 'success');
      });
  }

  back(): void {
    this.httpService.back();
  }
}
