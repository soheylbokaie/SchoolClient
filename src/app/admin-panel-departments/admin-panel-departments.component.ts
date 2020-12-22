import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '../http.service';
import { IAddDepartment, IDepartment } from '../Interfaces/app-interface';
import { IDepartmentDelet } from '../Interfaces/delet-interface';
import { IPaging } from '../Interfaces/paging-interface';
import { IResponseDepartment } from '../Interfaces/response-interface';
import { UserService } from '../user.service';

@Component({
  selector: 'app-admin-panel-departments',
  templateUrl: './admin-panel-departments.component.html',
  styleUrls: [
    './admin-panel-departments.component.css',
    '../admin-panel/sb-admin-2.min.css',
  ],
})
export class AdminPanelDepartmentsComponent implements OnInit {
  addForm: FormGroup;
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private userService: UserService
  ) {}
  departments: IDepartment[];
  pagingInfop: IPaging;
  mode: boolean = true;
  deletItem: string = null;
  idtoken: string;

  base_url = 'https://localhost:5001/';
  ngOnInit(): void {
    this.s();
    this.formAddInit();
  }

  public s() {
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

  delete_item() {
    this.get_Authorize();
    this.http
      .delete(this.base_url + 'deletedepartment/' + this.deletItem, {
        headers: { Authorization: 'Bearer ' + this.idtoken },
        responseType: 'text',
      })
      .subscribe({
        next: (data) => {
          console.log('Delete successful');
        },
        error: (error) => {
          console.log('There was an error!', error);
        },
      });
    this.s();
  }

  add_item() {
    this.get_Authorize();
    const name: IAddDepartment = {
      name: this.addForm.get('name').value,
    };
    this.http
      .post(this.base_url + 'AddDepartment', name, {
        headers: { Authorization: 'Bearer ' + this.idtoken },
        responseType: 'text',
      })
      .subscribe(
        (response) => {
          console.log(response);
          this.mode = true;
        },
        (error) => {
          console.log(error);
        }
      );
    console.log(name);
  }

  formAddInit() {
    this.addForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
    });
  }

  get_Authorize() {
    this.userService.currentToken$.subscribe((res) => {
      this.idtoken = res.token;
    });
  }
}
