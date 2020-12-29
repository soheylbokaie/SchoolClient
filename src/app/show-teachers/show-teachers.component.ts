import { HttpClient, HttpParams } from '@angular/common/http';
import { Route } from '@angular/compiler/src/core';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '../http.service';
import { ITeacherView } from '../Interfaces/Teacher-interface';
import { UserService } from '../user.service';

@Component({
  selector: 'app-show-teachers',
  templateUrl: './show-teachers.component.html',
  styleUrls: ['./show-teachers.component.css'],
})
export class ShowTeachersComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private httpService: HttpService
  ) {}
  base_url = this.httpService.base_url;
  teachers: Array<ITeacherView>;
  departmentId: string;
  ngOnInit(): void {
    this.get_teachers();
  }

  get_teachers() {
    this.route.queryParams.subscribe((obj) => {
      this.departmentId = obj['DepartmentId'];
    });
    const paramss = new HttpParams().set('DepartmentId', this.departmentId);
    return this.http
      .get(this.base_url + 'GetAllDepartmentTeachers', { params: paramss })
      .subscribe(
        (response: Array<ITeacherView>) => {
          this.teachers = response;
        },
        (error) => {
          console.log(error);
        }
      );
  }
}
