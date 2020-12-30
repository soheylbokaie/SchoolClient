import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ILoginResp, IUSer, IUserLogin } from '../Interfaces/app-interface';
import { UserService } from '../user.service';
import jwt_decode from 'jwt-decode';
import jwtDecode from 'jwt-decode';
import { Token } from '@angular/compiler/src/ml_parser/lexer';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  currentUser$: Observable<IUSer>;
  baseurl = 'https://localhost:5001/';
  constructor(
    private http: HttpClient,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.formInit();
    this.currentUser$ = this.userService.currentUser$;
  }

  formInit(): void {
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
  }

  logout(): void {
    this.userService.logout();
  }

  login(): void {
    const user: IUserLogin = {
      username: this.loginForm.get('username').value,
      password: this.loginForm.get('password').value,
    };
    this.userService.login(user);
  }

  public decode_jwt(): void {
    this.userService.decode_jwt();
  }
}
