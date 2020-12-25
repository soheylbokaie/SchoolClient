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
  base_url = this.httpService.base_url;
  courseId: string;
  course: ICourse;
  idtoken: string;
  editmode: boolean = false;
  editForm: FormGroup;

  ngOnInit(): void {
    this.courseId = this.route.snapshot.params['id'];

    this.GetCourse();

    this.get_Authorize();
  }

  GetCourse() {
    this.http
      .get(this.base_url + 'api/GetCourse/' + this.courseId)
      .subscribe((params: ICourse) => {
        this.course = params[0];
        this.formEditInit();
      });
  }

  get_Authorize() {
    this.userService.currentToken$.subscribe((res) => {
      this.idtoken = res.token;
    });
  }

  deleteCourse() {
    this.http
      .delete(this.base_url + 'deletecourse/' + this.courseId, {
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
  formEditInit() {
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
  editCourse() {
    const temp: IUpdateCourse = {
      courseName: this.editForm.get('courseName').value,
      courseDescription: this.editForm.get('courseDescription').value,
      startDate: this.editForm.get('startDate').value,
      endDate: this.editForm.get('endDate').value,
    };

    this.http
      .put(this.base_url + 'updatecourse/' + this.courseId, temp, {
        headers: { Authorization: 'Bearer ' + this.idtoken },
      })
      .subscribe((response) => {
        this.editmode = !this.editmode;
        this.toaster.success('course has been updated', 'success');
      });
  }

  back() {
    this.httpService.back();
  }
}
