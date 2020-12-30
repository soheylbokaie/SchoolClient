import { HttpClient, HttpParams } from '@angular/common/http';
import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from '../http.service';
import {
  IAddDepartment,
  IDepartment,
  IEditDepartment,
  IResponseDepartment,
} from '../Interfaces/Department-interface';
import { IPaging } from '../Interfaces/paging-interface';
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
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private userService: UserService,
    private toastr: ToastrService,
    private router: Router,
    private httpService: HttpService
  ) {}
  @ViewChild('edit_name') editName: ElementRef;
  addForm: FormGroup;
  departments: IDepartment[];
  pagingInfop: IPaging;
  mode = true;
  deletItem: string = null;
  idtoken: string;
  editMode = false;
  editElement: number = null;

  baseUrl = this.httpService.baseUrl;
  ngOnInit(): void {
    this.GetallDepartments();
    this.formAddInit();
    this.get_Authorize();
  }

  public GetallDepartments(): void {
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
        .set('PageSize', this.pagingInfop.pageSize.toString());
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

  delete_item(): void {
    this.http
      .delete(this.baseUrl + 'deletedepartment/' + this.deletItem, {
        headers: { Authorization: 'Bearer ' + this.idtoken },
        responseType: 'text',
      })
      .subscribe({
        next: (data) => {
          console.log('Delete successful');
          this.GetallDepartments();
        },
        error: (error) => {
          console.log('There was an error!', error);
          this.toastr.error('There is Teachers in this Department', 'error');
        },
      });
  }

  add_item(): void {
    const name: IAddDepartment = {
      name: this.addForm.get('name').value,
    };
    if (this.addForm.get('name').hasError) {
      this.http
        .post(this.baseUrl + 'AddDepartment', name, {
          headers: { Authorization: 'Bearer ' + this.idtoken },
          responseType: 'text',
        })
        .subscribe(
          (response) => {
            this.mode = true;
            this.toastr.success('Department has successfully added', 'added');
            this.addForm.reset();
          },
          (error) => {
            this.toastr.error(error.error, 'Error');
          }
        );
    } else {
      this.toastr.error('new value is not valid', 'Error');
    }
  }

  formAddInit(): void {
    this.addForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
    });
  }

  get_Authorize(): void {
    this.userService.currentToken$.subscribe((res) => {
      this.idtoken = res.token;
    });
  }

  editelm(): void {
    const name: IEditDepartment = {
      name: this.editName.nativeElement.value,
    };
    this.http
      .put(this.baseUrl + 'updatedepartment/' + this.editElement, name, {
        headers: { Authorization: 'Bearer ' + this.idtoken },
      })
      .subscribe(
        (response) => {
          this.toastr.success('Department has successfully Edited', 'Edited');
          this.GetallDepartments();
        },
        (error) => {
          this.toastr.error(error.error, 'Error');
        }
      );
  }
}
