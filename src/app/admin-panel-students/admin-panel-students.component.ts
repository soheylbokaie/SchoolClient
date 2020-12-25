import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { faGlobe, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from '../http.service';
import {
  IAddCourse,
  ICourse,
  IResponseCourse,
} from '../Interfaces/Course-interface';
import {
  IDepartment,
  IResponseDepartment,
} from '../Interfaces/Department-interface';

import { IPaging } from '../Interfaces/paging-interface';
import { UserService } from '../user.service';

@Component({
  selector: 'app-admin-panel-students',
  templateUrl: './admin-panel-students.component.html',
  styleUrls: [
    './admin-panel-students.component.css',
    '../admin-panel/sb-admin-2.min.css',
  ],
})
export class AdminPanelStudentsComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private toastr: ToastrService,
    private httpService: HttpService
  ) {}
  base_url = this.httpService.base_url;
  pagingInfop: IPaging;
  courses: ICourse[];
  mode: boolean = false;
  addForm: FormGroup;
  idtoken: string;
  icon: IconDefinition;
  departments: IDepartment[];

  ngOnInit(): void {
    this.GetallDepartments();
    this.get_Authorize();
  }
  get_Authorize() {
    this.userService.currentToken$.subscribe((res) => {
      this.idtoken = res.token;
    });
  }

  public GetallDepartments() {
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
        .set('PageNumber', this.pagingInfop.currentPages.toString())
        .set('PageSize', this.pagingInfop.pageSize.toString());
      this.http
        .get(this.base_url + 'GetAlldepartments', { params: paramss })
        .subscribe(
          (response: IResponseDepartment) => {
            this.departments = response['departments'];
            this.pagingInfop = response['pagingInfo'];
            if (this.pagingInfop.totalPages < this.pagingInfop.currentPages) {
              paramss.set('PageNumber', this.pagingInfop.totalPages.toString());
              this.router.navigate([], {
                relativeTo: this.route,
                queryParams: {
                  PageNumber: this.pagingInfop.totalPages,
                  PageSize: this.pagingInfop.pageSize,
                },
              });
            }
          },
          (error) => {
            console.log(error);
          }
        );
    });
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
