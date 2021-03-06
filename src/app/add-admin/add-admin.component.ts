import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from '../http.service';
import { IAdminAdd } from '../Interfaces/Admin-interface';
import { UserService } from '../user.service';
import * as MyValidators from '../validators/app-formvalidators';
@Component({
  selector: 'app-add-admin',
  templateUrl: './add-admin.component.html',
  styleUrls: ['./add-admin.component.css', '../admin-panel/sb-admin-2.min.css'],
})
export class AddAdminComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private toastr: ToastrService,
    private httpService: HttpService
  ) {}
  addForm: FormGroup;
  idtoken: string;
  baseUrl = this.httpService.baseUrl;

  ngOnInit(): void {
    this.get_Authorize();
    this.AddformInit();
  }

  AddformInit(): void {
    this.addForm = new FormGroup({
      userName: new FormControl('', [Validators.required]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        MyValidators.lowercaseValidator,
        MyValidators.UppercaseValidator,
        MyValidators.UniqueChars,
        MyValidators.Digit,
      ]),
      confirmPassword: new FormControl('', [
        Validators.required,
        MyValidators.ConfirmCheck,
      ]),
      adminName: new FormControl('', [Validators.required]),
    });
  }
  get_Authorize(): void {
    this.userService.currentToken$.subscribe((res) => {
      this.idtoken = res?.token;
    });
  }
  add_item(): void {
    const temp: IAdminAdd = {
      adminName: this.addForm.get('adminName').value,
      userName: this.addForm.get('userName').value,
      password: this.addForm.get('password').value,
    };
    if (this.addForm.status === 'VALID') {
      this.http
        .post(this.baseUrl + 'api/AdminRegister', temp, {
          headers: { Authorization: 'Bearer ' + this.idtoken },
        })
        .subscribe(
          (response) => {
            this.toastr.success('admin has added successfully', 'success');
            this.addForm.reset();
            this.router.navigate(['/admin-panel']);
          },
          (error) => {
            let errorMessage: string;
            switch (error.status) {
              case 403 || 401:
                errorMessage = 'you are not allowed to do that !';
                break;

              default:
                errorMessage = 'this user name has been taken'
                break;
            }
            this.toastr.error(errorMessage, 'Error');
          }
        );
    } else {
      this.toastr.error('form is not valid', 'Error');
    }
  }
}
