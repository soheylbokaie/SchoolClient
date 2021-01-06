import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { ITeacherView } from '../Interfaces/Teacher-interface';
import {
  IDepartment,
  IResponseDepartment,
} from '../Interfaces/Department-interface';
import { IPaging } from '../Interfaces/paging-interface';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-taechers',
  templateUrl: './taechers.component.html',
  styleUrls: ['./taechers.component.css'],
})
export class TaechersComponent implements OnInit {
  baseUrl = this.httpService.baseUrl;
  departments: IDepartment[];
  pagingInfop: IPaging;

  constructor(
    private http: HttpClient,
    private httpService: HttpService,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.get_Teachers();
  }

  show(): void {
    console.log(this.departments);
  }

  get_Teachers(): void {
    this.route.queryParams.subscribe((obj) => {
      this.pagingInfop = {
        currentPages: !!obj.PageNumber ? +obj.PageNumber : 1,
        pageSize: !!obj.PageSize ? +obj.PageSize : 10,
        nextLink: '',
        prevLink: '',
        totalCount: 0,
        totalPages: 0,
      };
      const paramss = new HttpParams()
        .set('PageNumber', this.pagingInfop.currentPages.toString())
      this.http
        .get(this.baseUrl + 'GetAlldepartments', { params: paramss })
        .subscribe(
          (response: IResponseDepartment) => {
            this.departments = response.departments;
            this.pagingInfop = response.pagingInfo;
            if (this.pagingInfop.totalPages < this.pagingInfop.currentPages) {
              paramss.set('PageNumber', this.pagingInfop.totalPages.toString());
              this.router.navigate([], {
                relativeTo: this.route,
                queryParams: {
                  PageNumber: this.pagingInfop.totalPages,
                  PageSize: 10,
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
  counter(i: number): Array<string | number> {
    let list: Array<string | number> = [];
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
}
