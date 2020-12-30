import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../http.service';
import { IUSer } from '../Interfaces/app-interface';
import { ITeacherView } from '../Interfaces/Teacher-interface';
import { TokenService } from '../token.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: [
    './user-profile.component.css',
    '../admin-panel/sb-admin-2.min.css',
  ],
})
export class UserProfileComponent implements OnInit {
  constructor(
    private tokenService: TokenService,
    private userService: UserService,
    private http: HttpClient,
    private httpService: HttpService
  ) {}
  baseUrl = this.httpService.baseUrl;
  user: IUSer;
  ngOnInit(): void {
    this.user = this.userService.decode_jwt();
  }
}
